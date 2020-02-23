run: node_modules
	@npm run start

deploy:
	@npm run build
	@surge -d https://bitcoin-price-feed.surge.sh -p build

node_modules:
	@npm i

.PHONY: deploy run
