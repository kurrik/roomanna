#!/usr/bin/env bash

# Watches for changes & builds the scripts for this blog post.
#
# Dependencies:
#   fswatch   - https://github.com/emcrisostomo/fswatch
#   requirejs - `npm install` from project root.

GITROOT=`git rev-parse --show-toplevel`
BLOGROOT=$GITROOT/blog.roomanna.com
POSTROOT=$BLOGROOT/src/site/posts/031-binpacking-shelf

function build {
  $BLOGROOT/node_modules/.bin/r.js -o $POSTROOT/build.js
}

build
fswatch -0 $POSTROOT/src | while read -d "" event
do
  build
done
