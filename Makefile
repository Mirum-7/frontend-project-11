build:
	npm run build:prod

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

fix:
	npx eslint --fix .

commit: fix
	git add .
	git commit -m '${m}'
