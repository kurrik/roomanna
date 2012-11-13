[link-samples]: http://code.google.com/chrome/extensions/samples.html
[link-docs]: http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/
[link-pack]: http://grack.com/blog/2009/11/09/packing-chrome-extensions-in-python/
[link-crx-format]: http://code.google.com/chrome/extensions/crx.html
[link-pycrypto]: http://www.dlitz.net/software/pycrypto/
[link-pkcs]: http://tools.ietf.org/html/rfc2313#section-8.1
[link-pyasn]: http://sourceforge.net/projects/pyasn1/
[link-digestalgo]: http://tools.ietf.org/html/rfc2313#section-10.1.2
[link-x509algos]: http://tools.ietf.org/html/rfc3279#section-2.2.1
[link-opensslrsa]: http://www.openssl.org/docs/apps/rsa.html
[link-x509publickey]: http://tools.ietf.org/html/rfc5280#section-4.1
[link-bash]: http://code.google.com/chrome/extensions/crx.html#H3-5
[link-opensocial]: http://opensocial-resources.googlecode.com/svn/spec/1.0/OpenSocial-Specification.xml
[link-sample]: https://github.com/kurrik/chrome-extensions/tree/master/crx-appengine-packager

I've been working at Google for about three years now, and was fortunate enough
to transfer onto the Chrome extensions team about a year ago.  Mostly, I
support developers working on Chrome extensions, but from time to time I work
on projects for the team to keep my sanity.  A good example of this is the
[Chrome extensions samples browser][link-samples].  The extension docs
are built and hosted automatically from the [Chromium source tree][link-docs]
so I modified the docs build script to generate the gallery and zip each
sample into an easily-downloadable archive.

Of course zips are fine if you want to peek into sample code, but not so good
if you just want to quickly test a sample to see what it does.  To address this,
I've been working on a method to offer each zip as a packaged crx.

Some considerations:

 * I didn't want to check the .crx files into the source tree because of the
   hassles involved with binary files in source control.  We've had some issues
   with the generated zip files, so managing two sets of archives seemed like it
   could be trouble.

 * The extension docs are hosted on App Engine, meaning there are some
   restrictions on what kind of libraries I could use.  While there are
   already [solutions for packing extensions in Python][link-pack], they
   rely on OpenSSL, which isn't available on App Engine.

I decided to write a Python library which could run on App Engine and convert
a directory of files into a Chrome extension crx archive.  I didn't
find a ton of information online to help me do this automatically, so I decided
to write up my findings for anyone heading down this road in the future.  It
should be pretty useful if you ever want to host a CRX from an app engine app
for whatever reason (offering a debug/trusted tester version, for example).


## Figuring out the format

From [the CRX format documentation][link-crx-format] I knew I needed to create
a binary file containing a header, an RSA public key, an RSA signature, and the
bytes of a zip file with the extension contents.

The RSA key is used to generate
a signature of the zip file contents, so I needed to figure out how to get a
zip of a directory first.

## Obtaining a zip file

Technically, the Chrome extension documentation samples are already zipped
and checked into
source control, but it's fairly easy to zip up a directory in Python.  Most
projects probably won't have a zip handy, so I'm including the step here.

I wanted some code that wouldn't have to write the
zip to the filesystem, so I used the `StringIO` module to generate a zip file
in memory:

<pre class="brush: python">
import StringIO
import os
import zipfile

...

zip_buffer = StringIO.StringIO()
zip_file = zipfile.ZipFile(zip_buffer, 'w')
path = 'path/to/extension/directory'
try:
  for root, dirs, files in os.walk(path):
    for file in files:
      # Absolute path to the file to be added.
      abspath = os.path.realpath(os.path.join(root, file))
      # Write a relative path into the zip file.
      relpath = abspath.replace(path + '/', "")
      zip_file.write(abspath, relpath)
except RuntimeError, msg:
  raise Exception("Could not write zip!")
finally:
  zip_file.close()

zip_string = zip_buffer.getvalue()
</pre>

This way `zip_string` contains the bytes of a zip file containing the specified
directory.  You'll see that I'm using a simple form of generating a relative
path:

<pre class="brush: python">
# Absolute path to the file to be added.
abspath = os.path.realpath(os.path.join(root, file))
# Write a relative path into the zip file.
relpath = abspath.replace(path + '/', "")
</pre>

There's actually an `os.path.relpath` function which would do this a bit more
directly, but according to the Python docs, this function is only available in
Python 2.6 on Windows and Unix, so I try not to rely on it.

## Generating an RSA key

For the rest of the file contents, I needed to sign the zip file with an RSA
key, which had to be generated.  While App Engine doesn't have OpenSSL
module support (which I would normally use), it does include a simple RSA
package which can be used to generate a key:

<pre class="brush: python">
from Crypto.PublicKey import RSA
import os

...

rsakey = RSA.generate(1024, os.urandom)
</pre>

This is computationally intensive, so I usually generate a key if needed and
store it in the data store for reuse. For local development, you can install
the package from the [PyCrypto homepage][link-pycrypto].

At this point I had a zip file and a key, so I needed to figure out exactly
how to sign a piece of data according to the RSA specification in order to
obtain the signature.

## Figuring out the RSA signature payload format

From the packaging instructions, I knew I could use OpenSSL to generate a
signature, but wasn't really sure what it was doing under the covers.  So I
figured the best approach would be to sign an existing extension and see
what the signature was using OpenSSL's command line tools.  I packaged an
extension using Chrome to generate a .pem key, then zipped the sources and ran
the following:

<pre class="blockquote">
<strong>$ openssl sha1 -sign key.pem extension.zip > extension.sig
$ openssl rsautl -verify -in extension.sig -inkey key.pem -raw -hexdump</strong>
0000 - 00 01 ff ff ff ff ff ff-ff ff ff ff ff ff ff ff   ................
0010 - ff ff ff ff ff ff ff ff-ff ff ff ff ff ff ff ff   ................
0020 - ff ff ff ff ff ff ff ff-ff ff ff ff ff ff ff ff   ................
0030 - ff ff ff ff ff ff ff ff-ff ff ff ff ff ff ff ff   ................
0040 - ff ff ff ff ff ff ff ff-ff ff ff ff ff ff ff ff   ................
0050 - ff ff ff ff ff ff ff ff-ff ff ff ff 00 30 21 30   .............0!0
0060 - 09 06 05 2b 0e 03 02 1a-05 00 04 14 2d bf 9f 85   ...+........-...
0070 - 4a a1 68 a9 a0 64 b2 c7-11 36 da ce 92 17 e9 29   J.h..d...6.....)
</pre>

This gave me a raw hex dump of the signature, so I started going through
the RSA-related specifications to figure out what I was looking at. Turns
out this is actually formatted according to <u>Section 8.1 Encryption-block
formatting</u> of the [PKCS#1 specification][link-pkcs]:

<pre class="blockquote">
A block type BT, a padding string PS, and the data D shall be
formatted into an octet string EB, the encryption block.

          EB = 00 || BT || PS || 00 || D .           (1)

The block type BT shall be a single octet indicating the structure of
the encryption block. For this version of the document it shall have
value 00, 01, or 02. For a private- key operation, the block type
shall be 00 or 01. For a public-key operation, it shall be 02.

The padding string PS shall consist of k-3-||D|| octets. For block
type 00, the octets shall have value 00; for block type 01, they
shall have value FF; and for block type 02, they shall be
pseudorandomly generated and nonzero. This makes the length of the
encryption block EB equal to k.
</pre>

The format of the hext dump corresponds with block type 01.  Knowing that
the octet string started at the first <code>30</code> octet, I thought a good
approach would be to write a script to decode that data and see what exactly
was stored there.  I've done some work
with RSA signatures before and know that everything is encoded using the ASN.1
format.  Luckily there's a [great Python pyasn library][link-pyasn] which
will decode this data and work on App Engine, to boot.

Here's the script I wrote:

<pre class="brush: python">
from pyasn1.codec.der import decoder

raw_obj = ('3021300906052b0e03021a050004142dbf9'
           'f854aa168a9a064b2c71136dace9217e929').decode('hex')
der_obj = decoder.decode(raw_obj)
</pre>

You'll see that the string I'm decoding corresponds with the contents of the hex
dump listed above.  Dumping the resulting <code>der_obj</code> gave me this
ASN.1 structure:

<pre class="blockquote">
(Sequence()
  .setComponentByPosition(0,
    Sequence()
      .setComponentByPosition(0, ObjectIdentifier('1.3.14.3.2.26'))
      .setComponentByPosition(1, Null('')))
  .setComponentByPosition(1, OctetString(
    <strong>'-\xbf\x9f\x85J\xa1h\xa9\xa0d\xb2\xc7\x116\xda\xce\x92\x17\xe9)'</strong>))
, '')
</pre>

It might not look promising, but this was pretty good.  The
<code>OctetString</code> towards the end was actually the raw hex bytes of a
SHA1 hash of the same zip file.  You can calculate this in python with:

<pre class="brush: python">
import hashlib
hashlib.sha1(zip_string).digest()
</pre>

where <code>zip_string</code> is the contents of a zip file read from the
filesystem, or generated using the <code>StringIO</code> approach I listed
above.

I wanted to know what the <code>ObjectIdentifier</code> string represented.  I
had a hunch it was the signing algorithm, and from [PKCS #1][link-digestalgo]
I found that the digest information should be encoded in the following way:

<pre class="blockquote">
DigestInfo ::= SEQUENCE {
   digestAlgorithm DigestAlgorithmIdentifier,
   digest Digest }
DigestAlgorithmIdentifier ::= AlgorithmIdentifier
Digest ::= OCTET STRING
</pre>

Sure enough, the compnents before the <code>OctetString</code> were algorithm
identifiers.  I found it strange that SHA1 wasn't actually listed as an
<code>AlgorithmIdentifier</code> (maybe it came after?) but later the spec
talks about the <code>md#</code> algorithms:

<pre class="blockquote">
These object identifiers are intended to be used in the algorithm
field of a value of type AlgorithmIdentifier. The parameters field of
that type, which has the algorithm-specific syntax ANY DEFINED BY
algorithm, would have ASN.1 type NULL for these algorithms.
</pre>

So cool, at least that explains the
<code>.setComponentByPosition(1, Null(''))</code> in the algorithm identifier.

At this point I was pretty sure that <code>'1.3.14.3.2.26'</code> was the
algorithm identifier for SHA1, but I wanted to make sure.  Looking a bit more,
I found the identifier in the [X.509 algorithms spec][link-x509algos]:

<pre class="blockquote">
The signature algorithm with SHA-1 and the RSA encryption algorithm
is implemented using the padding and encoding conventions described
in PKCS #1 [RFC 2313].  The message digest is computed using the
SHA-1 hash algorithm.

The RSA signature algorithm, as specified in PKCS #1 [RFC 2313]
includes a data encoding step.  In this step, the message digest and
the OID for the one-way hash function used to compute the digest are
combined.  When performing the data encoding step, the md2, md5, and
id-sha1 OIDs MUST be used to specify the MD2, MD5, and SHA-1 one-way
hash functions, respectively:

  ...
  id-sha1  OBJECT IDENTIFIER ::= {
    iso(1) identified-organization(3) oiw(14) secsig(3)
    algorithms(2) 26 }
</pre>

Sure enough, <code>iso(1) identified-organization(3) oiw(14) secsig(3)
algorithms(2) 26</code> matches <code>'1.3.14.3.2.26'</code>.

That explained the payload format.  Now I needed a way to build up the
signature from my own code to match this structure.

## Generating the RSA signature

Thankfully pyasn1 makes generating the appropriate structures pretty easy.

<pre class="brush: python">
import hashlib
from pyasn1.codec.der import encoder
from pyasn1.type import univ

...

# Obtain the hash of the zip file contents
zip_hash = hashlib.sha1(zip_string).digest()

# Get the SHA1 AlgorithmIdentifier
sha1identifier = univ.ObjectIdentifier('1.3.14.3.2.26')
sha1info = univ.Sequence()
sha1info.setComponentByPosition(0, sha1identifier)
sha1info.setComponentByPosition(1, univ.Null(''))

# Get the DigestInfo sequence, composed of the SHA1 id and the zip hash
digestinfo = univ.Sequence()
digestinfo.setComponentByPosition(0, sha1info)
digestinfo.setComponentByPosition(1, univ.OctetString(zip_hash))

# Encode the sequence into ASN.1
digest = encoder.encode(digestinfo)
</pre>

Now <code>digest</code> contains the raw bytes of the ASN.1
<code>DigestInfo</code> structure.  I needed to pad it with <code>ff</code>
octets according to the PKCS#1 specification.

<pre class="brush: python">
paddinglength = 128 - 3 - len(digest)
paddedhexstr = "0001%s00%s" % (paddinglength * 'ff', digest.encode('hex'))
</pre>

Finally, <code>pycrypto</code> supports a method to generate a RSA signature
given a key.

<pre class="brush: python">
from Crypto.PublicKey import RSA
import os

...

rsakey = RSA.generate(1024, os.urandom)
signature_bytes = rsakey.sign(paddedhexstr.decode('hex'), "")[0]
signature = ('%X' % signature_bytes).decode('hex')
</pre>

There are a lot of conversions back and forth between hex and binary here.  I
feel that could be cleaned up a bit and everything could probably be kept
in binary, but it'd be a bit harder to follow what was going on.  At the end
of the day, the <code>signature</code> variable contains the raw bytes of a
RSA signature of the zip file contents.

## Obtaining a public key

At this point I had the contents of the zip file and an RSA signature of that.
The last major component of the CRX file that I needed to calculate was the
public key portion of the RSA key.

The script in the CRX format documentation uses OpenSSL to generate a public
key:

<pre class="blockquote">
$ openssl rsa -pubout -outform DER
</pre>

From the [documentation][link-opensslrsa] the <code>-outform DER</code>
option states:

<pre class="blockquote">
The DER option uses an ASN1 DER encoded form compatible with the PKCS#1
RSAPrivateKey or SubjectPublicKeyInfo format.
</pre>

Strangely, I couldn't find a reference to <code>SubjectPublicKeyInfo</code>
in PKCS #1, but it was in the
[X.509 certificate profile spec][link-x509publickey]:

<pre class="blockquote">
SubjectPublicKeyInfo  ::=  SEQUENCE  {
    algorithm            AlgorithmIdentifier,
    subjectPublicKey     BIT STRING  }
</pre>

and the appropriate algorithm identifier and key format was once again found in
the [X.509 algorithms spec][link-x509algos]:

<pre class="blockquote">
The OID rsaEncryption identifies RSA public keys.

  pkcs-1 OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840)
                 rsadsi(113549) pkcs(1) 1 }

  rsaEncryption OBJECT IDENTIFIER ::=  { pkcs-1 1}

The rsaEncryption OID is intended to be used in the algorithm field
of a value of type AlgorithmIdentifier.  The parameters field MUST
have ASN.1 type NULL for this algorithm identifier.

The RSA public key MUST be encoded using the ASN.1 type RSAPublicKey:

  RSAPublicKey ::= SEQUENCE {
     modulus            INTEGER,    -- n
     publicExponent     INTEGER  }  -- e
</pre>

So I needed to get the bit string format of the <code>RSAPublicKey</code>
version of my RSA key, and then encode that together into a
<code>SubjectPublicKey</code> format:

<pre class="brush: python">
from pyasn1.codec.der import encoder
from pyasn1.type import univ

...

# Get a RSAPublicKey structure
pkinfo = univ.Sequence()
pkinfo.setComponentByPosition(0, univ.Integer(rsakey.n))
pkinfo.setComponentByPosition(1, univ.Integer(rsakey.e))

#Convert the key into a bit string
def to_bitstring(self, num):
  buf = ''
  while num > 1:
    buf = str(num &amp; 1) + buf
    num = num >> 1
  buf = str(num) + buf
  return buf
pklong = long(encoder.encode(pkinfo).encode('hex'), 16)
pkbitstring = univ.BitString("'00%s'B" % to_bitstring(pklong))

# Get the rsaEncryption identifier:
idrsaencryption = univ.ObjectIdentifier('1.2.840.113549.1.1.1')

# Get the AlgorithmIdentifier for rsaEncryption
idinfo = univ.Sequence()
idinfo.setComponentByPosition(0, idrsaencryption)
idinfo.setComponentByPosition(1, univ.Null(''))

# Get the SubjectPublicKeyInfo structure
publickeyinfo = univ.Sequence()
publickeyinfo.setComponentByPosition(0, idinfo)
publickeyinfo.setComponentByPosition(1, pkbitstring)

# Encode the public key structure
publickey = encoder.encode(publickeyinfo)
</pre>

## Writing the CRX format

Compared to the research and byte manipulating I needed to do earlier, actually
getting the component pieces into the CRX format was incredibly easy.  I used
another <code>StringIO</code> instance to write the pieces in the following
order (obtained from the CRX format docs):

1. The string "Cr24", a 'magic number' specific to the CRX format
1. The number 2 (CRX file format version)
1. The length of the public key in bytes
1. The length of the signature in bytes
1. The public key
1. The signature
1. The contents of the zip file

Here it is in python:

<pre class="brush: python">
import StringIO
import struct

...

crx_buffer = StringIO.StringIO("wb")
crx_buffer.write("Cr24")  # Extension file magic number, from the CRX focs
crx_buffer.write(struct.pack('iii', 2, len(publickey), len(signature)))
crx_buffer.write(publickey)
crx_buffer.write(signature)
crx_buffer.write(zip_string)

crx_file = crx_buffer.getvalue()
</pre>

Outputting <code>crx_file</code> to a file or serving it from a webserver
as a binary file will deliver the CRX file in a package that can be installed
into Chrome.

## Conclusion

It was certainly a lot of research to accomplish the same effect as this
[42 line script][link-bash], but I find it pretty satisfying to be able to
figure out the component parts of the CRX format.  Having been on the [author
end of a specification][link-opensocial], I really appreciate how much work
went into making these RFCs comprehensive yet still understandable.

At the end of the day, I had a script that could run on App Engine and package
a directory into a CRX file.  If you're interested in running it, I've included
a finished version below.  You can download the
[entire sample project][link-sample] on github.

**main.py**

<pre class="brush: python">
#!/usr/bin/env python
#
# Copyright 2010 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import crx
import os

class MainHandler(webapp.RequestHandler):
  def get(self):
    self.response.out.write('Download the <a href="extension.crx">'
                            'packaged extension</a>.')

class CrxHandler(webapp.RequestHandler):
  def get(self):
    zipper = crx.Zipper()
    packager = crx.Packager()
    key = crx.SigningKey.getOrCreate()
    base_dir = os.path.realpath(os.path.dirname(__file__))
    extension_dir = os.path.join(base_dir, "extension-dir")
    extension = packager.package(zipper.zip(extension_dir), key)
    self.response.headers['Content-Type'] = 'application/x-chrome-extension'
    self.response.out.write(extension)

def main():
  application = webapp.WSGIApplication([
    ('/', MainHandler),
    ('/extension\.crx', CrxHandler),
  ], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
</pre>

**crx.py**

<pre class="brush: python">
#!/usr/bin/env python
#
# Copyright 2010 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import StringIO
import os
import hashlib
import zipfile
import struct
import pickle

from pyasn1.codec.der import encoder
from pyasn1.type import univ
from Crypto.PublicKey import RSA

from google.appengine.ext import db

class Zipper(object):
  """ Handles creating zip files. """

  def zip(self, path):
    """ Returns the contents of a path as a binary string reprentation of a
    zip file."""
    zip_buffer = StringIO.StringIO()
    zip_file = zipfile.ZipFile(zip_buffer, 'w')
    try:
      for root, dirs, files in os.walk(path):
        for file in files:
          # Absolute path to the file to be added.
          abspath = os.path.realpath(os.path.join(root, file))
          # Write a relative path into the zip file.
          relpath = abspath.replace(path + '/', "")
          zip_file.write(abspath, relpath)
    except RuntimeError, msg:
      raise Exception("Could not write zip!")
    finally:
      zip_file.close()
    zip_string = zip_buffer.getvalue()
    return zip_string


class SigningKey(db.Model):
  """ Represents an RSA key that can be used to sign an extension.

  The first time getOrCreate is called, a new key is generated and stored in
  the data store.  Subsequent calls will return the original key."""

  blob = db.BlobProperty()

  def toBitString_(self, num):
    """ Converts a long into the bit string. """
    buf = ''
    while num > 1:
      buf = str(num &amp; 1) + buf
      num = num >> 1
    buf = str(num) + buf
    return buf

  def getRSAKey(self):
    """ Gets a data structure representing an RSA public+private key. """
    return pickle.loads(self.blob)

  def getRSAPublicKey(self):
    """ Gets an ASN.1-encoded form of this RSA key's public key. """
    # Get a RSAPublicKey structure
    pkinfo = univ.Sequence()
    rsakey = self.getRSAKey()
    pkinfo.setComponentByPosition(0, univ.Integer(rsakey.n))
    pkinfo.setComponentByPosition(1, univ.Integer(rsakey.e))

    # Encode the public key info as a bit string
    pklong = long(encoder.encode(pkinfo).encode('hex'), 16)
    pkbitstring = univ.BitString("'00%s'B" % self.toBitString_(pklong))

    # Get the rsaEncryption identifier:
    idrsaencryption = univ.ObjectIdentifier('1.2.840.113549.1.1.1')

    # Get the AlgorithmIdentifier for rsaEncryption
    idinfo = univ.Sequence()
    idinfo.setComponentByPosition(0, idrsaencryption)
    idinfo.setComponentByPosition(1, univ.Null(''))

    # Get the SubjectPublicKeyInfo structure
    publickeyinfo = univ.Sequence()
    publickeyinfo.setComponentByPosition(0, idinfo)
    publickeyinfo.setComponentByPosition(1, pkbitstring)

    # Encode the public key structure
    publickey = encoder.encode(publickeyinfo)
    return publickey

  @staticmethod
  def getOrCreate():
    """ Returns a signing key from the data store or creates one if it doesn't
    already exist. """
    # See if there's already a key in the datastore
    key = SigningKey.get_by_key_name('signingkey')
    if not key:
      # Create one if not
      rsakey = RSA.generate(1024, os.urandom)
      key = SigningKey(key_name='signingkey', blob=pickle.dumps(rsakey))
      # Store it for use later
      key.put()
    return key


class Packager(object):
  """ Handles creating CRX files. """

  def package(self, zip_string, key):
    """ Packages a zip file into a CRX, given a signing key. """
    # Obtain the hash of the zip file contents
    zip_hash = hashlib.sha1(zip_string).digest()

    # Get the SHA1 AlgorithmIdentifier
    sha1identifier = univ.ObjectIdentifier('1.3.14.3.2.26')
    sha1info = univ.Sequence()
    sha1info.setComponentByPosition(0, sha1identifier)
    sha1info.setComponentByPosition(1, univ.Null(''))

    # Get the DigestInfo sequence, composed of the SHA1 id and the zip hash
    digestinfo = univ.Sequence()
    digestinfo.setComponentByPosition(0, sha1info)
    digestinfo.setComponentByPosition(1, univ.OctetString(zip_hash))

    # Encode the sequence into ASN.1
    digest = encoder.encode(digestinfo)

    # Pad the hash
    paddinglength = 128 - 3 - len(digest)
    paddedhexstr = "0001%s00%s" % (paddinglength * 'ff', digest.encode('hex'))

    # Calculate the signature
    signature_bytes = key.getRSAKey().sign(paddedhexstr.decode('hex'), "")[0]
    signature = ('%X' % signature_bytes).decode('hex')

    # Get the public key
    publickey = key.getRSAPublicKey()

    # Write the actual CRX contents
    crx_buffer = StringIO.StringIO("wb")
    crx_buffer.write("Cr24")  # Extension file magic number, from the CRX focs
    crx_buffer.write(struct.pack('iii', 2, len(publickey), len(signature)))
    crx_buffer.write(publickey)
    crx_buffer.write(signature)
    crx_buffer.write(zip_string)
    crx_file = crx_buffer.getvalue()
    return crx_file
</pre>
