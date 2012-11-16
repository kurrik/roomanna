.PHONY : deploy server serve-prod serve clean usage

usage:
	@echo '    serve         Run Jekyll development server'
	@echo '    serve-prod    Run App Engine server on built server'
	@echo '    clean         Clean all'
	@echo '    deploy        Deploy blog'

GW_FLAGS=-src=src -dst=build/content
CONTENT_FILES=$(shell find src -type f)
SERVER_FILES=$(shell find server -type f)

clean:
	rm -rf build

%/.dir:
	mkdir -p $*
	touch $*/.dir

build/content/index.html: build/.dir build/content/.dir ${CONTENT_FILES}
	ghostwriter $(GW_FLAGS)

build/app.yaml: $(SERVER_FILES)
	cp -r server/* build

watch:
	ghostwriter $(GW_FLAGS) -watch -serve=127.0.0.1:9998

server: build/content/index.html build/app.yaml

serve: server
	~/src/google_appengine_go/dev_appserver.py --port=9998 --address=0.0.0.0 build

deploy: server
	~/src/google_appengine_go/appcfg.py update build
