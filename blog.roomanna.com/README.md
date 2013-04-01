This project contains the source and content of http://blog.roomanna.com.

Setup
=====
To build, install dependencies:

  1. Go from golang.org
  2. npm from npmjs.org
  3. Golang App Engine server installed in ~/src/google_appengine_go/ from https://developers.google.com/appengine/downloads

Run:

    go get -u github.com/kurrik/ghostwriter
    npm install

Building
========

This builds the entire site:

    grunt all

This creates a new post template:

    grunt create

This builds the site, starts a webserver at http://localhost:9998 and watches the source files for any changes:

    grunt develop

This deploys the site:

    grunt deploy
