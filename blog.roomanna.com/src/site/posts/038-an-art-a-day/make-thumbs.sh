#!/usr/bin/env bash

GITROOT=`git rev-parse --show-toplevel`
POSTROOT=$GITROOT/blog.roomanna.com/src/site/posts/038-an-art-a-day

cd $POSTROOT
mogrify \
  -format jpg \
  -define jpeg:size=500x180 \
  -auto-orient \
  -thumbnail 250x90 \
  -unsharp 0x.5 \
  '*.jpg'
