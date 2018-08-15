[link-overflow]: http://stackoverflow.com/questions/1882981/google-chrome-alphanumeric-hashes-to-identify-extensions/2050916#2050916
[link-prev]: {{link "002-packaging-chrome-extensions"}}
[link-autoupdate]: http://code.google.com/chrome/extensions/autoupdate.html

I've gone [in-depth on the structure of CRX files][link-prev], but left out a
crucial portion for anyone looking to host their own CRX from a server.

<!--BREAK-->

In order to get the advantages of auto-updating your extension, you'll need to
host an autoupdate manifest file.  From the [documentation][link-autoupdate] of
this feature, the file should be similar to the following:

    <?xml version='1.0' encoding='UTF-8'?>
    <gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
      <app appid='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'>
        <updatecheck codebase='http://example.com/extension.crx' version='2.0' />
      </app>
    </gupdate>

Note that the <code>appid</code> attribute requires the 32 character long
identifier for the extension (the same one printed in each extension's listing
on the <code>chrome://extensions</code> page).

While it's easy enough to obtain this value by installing an extension and
copying and pasting from the extensions information page, this approach is not
ideal if you're generating your own signing keys, which the previous article
covered in depth.

I thought it might be good to cover that as an addendum here.  Luckily, Erik
Kay explained the format of this number in [this post on
StackOverflow][link-overflow]:

<blockquote>
To be precise, it's the first 128 bits of the SHA256 of an RSA public key
encoded in base 16.

Another random bit of trivia is that the encoding uses a-p instead of 0-9a-f.
The reason is that leading numeric characters in the host field of an origin
can wind up being treated as potential IP addresses by Chrome. We refer to it
internally as "mpdecimal" after the guy who came up with it.
</blockquote>

Generating the number is easy enough, especially considering that I've already
covered the process to obtain an RSA public key.

Here's the code from last time, which generates the key and DER encodes it:

    from pyasn1.codec.der import encoder
    from pyasn1.type import univ
    from Crypto.PublicKey import RSA
    import os

    ...

    # Generate an RSA key
    rsakey = RSA.generate(1024, os.urandom)

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

The result is that <code>publickey</code> contains the raw bytes of a DER
encoded RSA public key.

According to Erik's instructions, we need to generate the <code>sha256</code>
hash of this key, then take the first 128 bits and encode it to hex.  128 bits
worth of hex is 32 characters, so we'll use the Python <code>hashlib</code>
module to <code>sha256</code> the public key, and pull the first 32 characters
from the hex version of the hash:

    import hashlib

    ...

    digest = hashlib.sha256(publickey).hexdigest()[:32]

Finally, encode the "mpdecimal" version of the hex-encoded <code>digest</code>
variable.  This just involves shifting each character in the hex string over by
10 characters:

    extension_id = ''.join(["abcdefghijklmnop"[int(i,16)] for i in digest])

Voilà! <code>extension_id</code> now contains a 32 character string that
represents the extension's ID number.  This is suitable for including in the
extension's autoupdate manifest file, as described above.
