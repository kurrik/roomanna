.PHONY : deploy serve usage test

usage:
	@echo '    serve                 Run App Engine server'
	@echo '    DEVEL=1 serve         Run App Engine server with dev assets'
	@echo '    test                  Run tests'
	@echo '    deploy                Deploy'

serve:
	npm run watch& dev_appserver.py \
		--port=9997 \
		--admin_port=8001 \
		--skip_sdk_update_check=yes \
		--env_var DEVEL=${DEVEL} \
		src/server

test:
	npm run test

deploy:
	unset DEVEL
	npm run build
	appcfg.py --oauth2 update src/server
