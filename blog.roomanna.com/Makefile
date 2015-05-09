.PHONY: create deploy develop clean

create:
	${GOPATH}/bin/ghostwriter -src=src/site -dst=build/content -action=create

deploy:
	~/src/go_appengine/appcfg.py --oauth2 update build

develop:
	./node_modules/.bin/grunt develop

clean:
	./node_modules/.bin/grunt clean
