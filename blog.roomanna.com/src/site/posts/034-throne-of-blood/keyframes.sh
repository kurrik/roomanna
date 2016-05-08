#!/usr/bin/env bash

GITROOT=`git rev-parse --show-toplevel`
POSTROOT=$GITROOT/blog.roomanna.com/src/site/posts/034-throne-of-blood

for video in `ls $POSTROOT/*.mp4`; do
  echo "Generating poster for $video"
  ffmpeg -i $video -ss 00:00:00.000 -vframes 1 ${video}.png
done
