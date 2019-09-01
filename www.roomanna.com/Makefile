.PHONY : deploy serve usage test

usage:
	@echo '    serve                 Run App Engine server'
	@echo '    DEVEL=1 serve         Run App Engine server with dev assets'
	@echo '    test                  Run tests'
	@echo '    deploy                Deploy'

serve:
	yarn run watch& cd .. && go run www.roomanna.com/src/server/main.go

test:
	yarn run test

deploy:
	export DEVEL=0
	yarn run build
	gcloud app deploy --project roomanna-www-hrd src/server/app.yaml
