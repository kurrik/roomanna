.PHONY : deploy server serve watch clean usage create

usage:
	@echo '    watch         Run Ghostwriter server in watch mode'
	@echo '    serve         Build once and run App Engine server'
	@echo '    server        Build content and App Engine files'
	@echo '    clean         Clean all'
	@echo '    deploy        Deploy'

GW_FLAGS=-src=src -dst=build/content
CONTENT_FILES=$(shell find src -type f)
SERVER_FILES=$(shell find server -type f)

clean:
	rm -rf build

%/.dir:
	mkdir -p $*
	touch $*/.dir

build/content/index.html: build/.dir build/content/.dir ${CONTENT_FILES}
	ghostwriter -action=process $(GW_FLAGS)

build/app.yaml: $(SERVER_FILES)
	cp -r server/* build

watch:
	ghostwriter $(GW_FLAGS) -watch -action=serve -address=127.0.0.1:9998

create:
	ghostwriter $(GW_FLAGS) -action=create

server: build/content/index.html build/app.yaml

serve: server
	~/src/google_appengine_go/dev_appserver.py --port=9998 --address=0.0.0.0 build

deploy: clean server
	~/src/google_appengine_go/appcfg.py --oauth2 update build
