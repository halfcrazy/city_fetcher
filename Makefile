# NPM_REGISTRY = "--registry=http://registry.npm.taobao.org"
NPM_REGISTRY = ""


install:
	@npm install $(NPM_REGISTRY)

start: install
	@nohup ./node_modules/.bin/pm2 start app.js -i 0 --name "city_fetcher" --max-memory-restart 400M >> city_fetcher.log 2>&1 &

restart: install
	@nohup ./node_modules/.bin/pm2 restart "city_fetcher" >> city_fetcher.log 2>&1 &

.PHONY: install start restart
