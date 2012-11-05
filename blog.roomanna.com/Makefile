.PHONY : deploy server serve-prod serve clean usage

usage:
	@echo '    serve         Run Jekyll development server'
	@echo '    serve-prod    Run App Engine server on built server'
	@echo '    clean         Clean all'
	@echo '    deploy        Deploy blog'

GW_FLAGS=-src=src -dst=build

clean:
	rm -rf build

build:
	mkdir build
	ghostwriter $(GW_FLAGS)

serve:
	ghostwriter $(GW_FLAGS) -watch -serve=127.0.0.1:9998

serve-prod: server
	dev_appserver.py --port=9998 --address=0.0.0.0 build

deploy: server
	appcfg.py update build

all: serve
