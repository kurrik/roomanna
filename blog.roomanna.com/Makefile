.PHONY: create deploy develop clean build components

build:
	./node_modules/.bin/grunt all

create:
	${GOPATH}/bin/ghostwriter -src=src/site -dst=build/content -action=create

deploy: build
	~/src/go_appengine/appcfg.py --oauth2 update build

develop:
	./node_modules/.bin/grunt develop

develop-prod:
	./node_modules/.bin/grunt develop-prod

clean:
	./node_modules/.bin/grunt clean

components:
	cd src/javascript && npm run components
