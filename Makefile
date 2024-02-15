install:
	npm i

build:
	npm run build:prod

lint:
	npx eslint .

fix:
	npx eslint --fix .

commit: fix
	git add .
	git commit -m '${m}'

deploy: commit
	git push