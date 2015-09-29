#!/usr/bin/env bash

GITROOT=`git rev-parse --show-toplevel`
cd $GITROOT/blog.roomanna.com
./node_modules/.bin/r.js -o src/site/posts/031-binpacking-shelf-next-fit/src/build.js
