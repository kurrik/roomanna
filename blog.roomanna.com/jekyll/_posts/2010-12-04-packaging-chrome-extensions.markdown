---
layout: post
title: Packaging Google Chrome extensions
tags: 
- chrome
- extensions
- app engine
---
[link-samples]: http://code.google.com/chrome/extensions/samples.html
[link-docs]: http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/
[link-pack]: http://grack.com/blog/2009/11/09/packing-chrome-extensions-in-python/
[link-crx-format]: http://code.google.com/chrome/extensions/crx.html
[link-pycrypto]: http://www.dlitz.net/software/pycrypto/

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
   with the generated zip files, so managing two sets of archives seemed like
   it could be troublesome.
   
 * The extension docs are hosted with App Engine, meaning there are some
   restrictions on what kind of libraries I could use.  While there are 
   already [solutions for packing extensions in Python][link-pack], they 
   rely on openssl, which isn't available on App Engine.
   
So I decided to write a Python library which could run on App Engine and convert
a zip or a directory of files into a Chrome extension crx archive.  I didn't
find a ton of information online to help me do this automatically, so I decided
to write up my findings for anyone heading down this road in the future.  It 
should be pretty useful if you ever want to host a CRX from an app engine app
for whatever reason (offering a debug/trusted tester version, for example).

<!-- -**-END-**- -->

## Figuring out the format

From [the crx format documentation][link-crx-format] I knew I needed to create
a binary file containing a header, an RSA public key, an RSA signature, and the
bytes of a zip file with the extension contents.  The key is used to generate
a signature of the zip file contents, so obtaining the zip file was the first
(and simplest) thing to figure out.

## Obtaining a zip file

I already had a zip of the sample contents, but it's fairly easy to zip up
a directory in Python.  I wanted some code that wouldn't have to write the
zip to the filesystem, so I used the `StringIO` module to generate a zip file
in memory:

<pre class="brush: js">
import StringIO
import os
import zipfile

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
directory.  You'll see that I used a simple form of generating a relative path:

<pre class="brush: js">
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

<pre class="brush: js">
from Crypto.PublicKey import RSA

rsakey = RSA.generate(1024, os.urandom)
</pre>

This is computationally intensive, so I usually generate a key if needed and 
store it in the data store for reuse. For local development, you can install 
the package from the [PyCrypto homepage][link-pycrypto].

## Figuring out the RSA signature payload format

At this point I had a zip file and a key, so I needed to figure out exactly
how to sign a piece of data according to the RSA specification in order to 
obtain the signature. 