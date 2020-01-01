.PHONY: create deploy develop clean build components

build: clean
	cd src/javascript && PROD=1 npm run build-grunt
	${GOPATH}/bin/ghostwriter -src=src/site -dst=build/content

create:
	${GOPATH}/bin/ghostwriter -src=src/site -dst=build/content -action=create

deploy: build
	gcloud app deploy --project roomanna-blog-hrd app.yaml

develop:
	./node_modules/.bin/concurrently \
		--kill-others \
		"cd src/javascript && npm run watch-grunt" \
		"${GOPATH}/bin/ghostwriter -src=src/site -dst=build/content -watch" \
		"cd .. && PORT=9998 ROOMANNA_MODE=dev go run blog.roomanna.com/src/server/*.go"

develop-prod: build
	cd .. && PORT=9998 ROOMANNA_MODE=dev go run blog.roomanna.com/src/server/*.go

clean:
	rm -rf build

components:
	cd src/javascript && npm run components
