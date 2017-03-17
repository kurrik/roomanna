#!/usr/bin/env bash

# brew install imagemagick
# http://www.imagemagick.org/Usage/thumbnails/

GITROOT=`git rev-parse --show-toplevel`
POSTROOT=$GITROOT/blog.roomanna.com/src/site/posts/038-an-art-a-day

mkdir -p $POSTROOT/thumbs
cd $POSTROOT/images
mogrify \
  -format jpg \
  -path $POSTROOT/thumbs \
  -define jpeg:size=500x180 \
  -auto-orient \
  -thumbnail 250x90 \
  -unsharp 0x.5 \
  '*.jpg'
