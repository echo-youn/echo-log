# Echo Log
Hello, World! 

# HOW TO RUN
``` sh
$ yarn docs:dev

#   $ yarn run
#
#   - docs:build
#      vitepress build docs
#   - docs:dev
#      vitepress dev docs
#   - docs:serve
#      vitepress serve docs
#
```

## Docsearch Scrapper Docker
```shell
$ apt install jq docker # docker & jq required on linux
$ brew install jq docker # docker & jq on mac
$ touch .env # env 파일 작성(APP_ID, API_KEY)
$ docker run -it --env-file=.env -e "CONFIG=$(cat docsearch-config.json | jq -r tostring)" algolia/docsearch-scraper # Docsearch-scrapper docker
```

## Docsearch Scrapper code base
https://docsearch.algolia.com/docs/legacy/run-your-own/#running-the-crawler-from-the-code-base

# References
- [Vitepress](https://vitepress.vuejs.org/) - [Github](https://github.com/vuejs/vitepress)
- [Vue3](https://v3.ko.vuejs.org/guide/migration/introduction.html)
- Algoria
- [Doc search scraper](https://github.com/algolia/docsearch-scraper)
- [DocSearch Program](https://docsearch.algolia.com/docs/DocSearch-program)
- Github page
- [Utteranc](https://utteranc.es/)
