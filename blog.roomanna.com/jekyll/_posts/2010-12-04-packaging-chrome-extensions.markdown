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

