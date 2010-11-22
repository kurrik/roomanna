.PHONY : deploy serve usage

usage:
	@echo '    serve         Run App Engine server'
	@echo '    deploy        Deploy'

serve:
	dev_appserver.py --port=9997 --address=0.0.0.0 appengine

deploy:
	appcfg.py update appengine
