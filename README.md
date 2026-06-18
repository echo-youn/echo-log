# Echo Log

개발하면서 정리한 기술 메모와 학습 기록을 모아 둔 VitePress 기반 블로그입니다.

- 사이트: <https://blog.echo-youn.com>
- 저장소: <https://github.com/echo-youn/echo-log>
- 주요 주제: Java, Kotlin, Spring, SQL, Docker, Cloud, AWS, Ansible, Kubernetes, 기타 개발 환경 이슈

## 기술 스택

- [VitePress](https://vitepress.dev/)
- [Vue 3](https://vuejs.org/)
- TypeScript
- GitHub Pages
- VitePress local search

## 프로젝트 구조

```text
.
├── docs/                     # 문서 원본
│   ├── .vitepress/
│   │   ├── config.mts        # VitePress 설정, 사이드바, 검색, 배포 경로
│   │   └── theme/            # 커스텀 테마 컴포넌트
│   ├── index.md              # 홈 화면
│   ├── java/
│   ├── kotlin/
│   ├── spring/
│   ├── sql/
│   ├── docker/
│   ├── cloud/
│   ├── ansible/
│   └── etc/
├── .github/workflows/        # GitHub Pages 배포 워크플로
├── CNAME                     # 커스텀 도메인
├── package.json
└── README.md
```

## 시작하기

Node.js 20.x 환경을 기준으로 합니다. GitHub Actions도 Node.js 20.x로 빌드합니다.

```sh
yarn install --frozen-lockfile
yarn docs:dev
```

개발 서버는 VitePress 기본 포트인 `5173`에서 실행됩니다.

```text
http://localhost:5173
```

`package-lock.json`도 함께 존재하므로 npm을 사용할 수도 있습니다.

```sh
npm install
npm run docs:dev
```

다만 CI/CD는 `yarn.lock` 기준으로 동작하므로 의존성 변경 시에는 `yarn.lock`을 우선 관리합니다.

## 명령어

```sh
yarn docs:dev
```

로컬 개발 서버를 실행합니다.

```sh
yarn docs:build
```

정적 사이트를 빌드합니다. 결과물은 `docs/.vitepress/dist`에 생성됩니다.

```sh
yarn docs:serve
```

빌드 결과물을 로컬에서 미리 확인합니다.

## 문서 작성

문서는 `docs` 하위에 Markdown 파일로 작성합니다.

1. 주제에 맞는 디렉터리에 Markdown 파일을 추가합니다.
   예: `docs/spring/example.md`
2. 사이드바에 노출해야 하는 문서는 `docs/.vitepress/config.mts`의 `themeConfig.sidebar`에 링크를 추가합니다.
3. 문서 간 링크는 VitePress 경로 기준으로 작성합니다.
   예: `/spring/example`
4. 로컬에서 `yarn docs:dev`로 확인합니다.
5. 배포 전 `yarn docs:build`로 빌드 오류를 확인합니다.

## VitePress 설정 메모

- 언어는 `ko-KR`입니다.
- 기본 테마는 dark appearance를 사용합니다.
- 코드 블록 line number와 이미지 lazy loading이 활성화되어 있습니다.
- 검색은 VitePress local search를 사용합니다.
- `cleanUrls: true`가 활성화되어 있어 URL에 `.html` 확장자가 붙지 않습니다.
- `lastUpdated: true`로 문서별 업데이트 시간이 표시됩니다.
- `editLink`는 GitHub의 `main` 브랜치 문서 수정 화면으로 연결됩니다.

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드하고 GitHub Pages에 배포합니다.

배포 흐름은 다음과 같습니다.

1. 저장소 checkout
2. GitHub Pages 설정
3. Node.js 20.x 설정
4. `yarn install --frozen-lockfile`
5. `yarn docs:build`
6. `docs/.vitepress/dist`를 Pages artifact로 업로드
7. GitHub Pages 배포

커스텀 도메인은 `CNAME`의 `blog.echo-youn.com`을 사용합니다.

## 검색

현재 설정은 VitePress 내장 local search입니다.

과거 Algolia DocSearch를 직접 크롤링하던 메모가 필요하면 아래 명령을 참고합니다. 이 방식은 별도의 Algolia 앱 설정, `APP_ID`, `API_KEY`, `docsearch-config.json`이 필요합니다.

```sh
# Linux
apt install jq docker

# macOS
brew install jq docker

touch .env
docker run -it --env-file=.env -e "CONFIG=$(cat docsearch-config.json | jq -r tostring)" algolia/docsearch-scraper
```

관련 문서:

- <https://docsearch.algolia.com/docs/legacy/run-your-own/#running-the-crawler-from-the-code-base>

## 참고

- [VitePress](https://vitepress.dev/)
- [VitePress GitHub](https://github.com/vuejs/vitepress)
- [Vue 3](https://vuejs.org/)
- [GitHub Pages](https://pages.github.com/)
- [Utterances](https://utteranc.es/)
- [Algolia DocSearch](https://docsearch.algolia.com/)
