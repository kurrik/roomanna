.PHONY : deploy serve usage

usage:
	@echo '    serve         Run App Engine server'
	@echo '    deploy        Deploy'

serve:
	npm run watch& dev_appserver.py --port=9997 --admin_port=8001 --skip_sdk_update_check=yes src/server

deploy:
	appcfg.py --oauth2 update appengine
