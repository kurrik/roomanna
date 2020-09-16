#!/usr/bin/env zsh

ROOT=${0:a:h}

# brew install imagemagick
# http://www.imagemagick.org/Usage/thumbnails/

mogrify \
  -format jpg \
  -path $ROOT \
  -resize 80x80% \
  -quality 80 \
  -unsharp 0x.5 \
  $ROOT/originals/*.*

mkdir -p $ROOT/thumbs

mogrify \
  -format jpg \
  -path $ROOT/thumbs \
  -define jpeg:size=500x180 \
  -auto-orient \
  -thumbnail 250x90 \
  -unsharp 0x.5 \
  '*.jpg'
