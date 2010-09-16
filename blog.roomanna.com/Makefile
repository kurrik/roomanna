.PHONY : deploy server serve-prod serve clean usage

usage:
	@echo '    server        Build server'
	@echo '    serve         Run Jekyll development server'
	@echo '    serve-prod    Run App Engine server on built server'
	@echo '    clean         Clean all'
	@echo '    deploy        Deploy blog'

clean:
	rm -rf build

build:
	mkdir build
	mkdir build/_site

serve:
	rm -rf _site
	ejekyll --server

serve-prod: build
	dev_appserver.py --port=9999 --address=0.0.0.0 build

server: build
	cp -r appengine build
	ejekyll

deploy: server
	appcfg.py update build

all: server
