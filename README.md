# typescript-imgix-url-params

> TypeScript definitions of imgix's URL parameters.

[![NPM version](http://img.shields.io/npm/v/typescript-imgix-url-params.svg?style=flat-square)](https://www.npmjs.com/package/typescript-imgix-url-params)
[![NPM downloads](http://img.shields.io/npm/dm/typescript-imgix-url-params.svg?style=flat-square)](https://www.npmjs.com/package/typescript-imgix-url-params)
[![Follow JamieMason on GitHub](https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow)](https://github.com/JamieMason)
[![Follow fold_left on Twitter](https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow)](https://twitter.com/fold_left)

## 🌩 Installation

```bash
npm install --save-dev typescript-imgix-url-params
```

## ⚠️ Status

This package was created on 15 Nov 2022, it is new but please give it a try and
[give your feedback](https://github.com/JamieMason/typescript-imgix-url-params/issues/new).

## 🕹 Usage

```ts
import type { ImgixUrl } from 'typescript-imgix-url-params';

const params: Partial<ImgixUrl.Params> = {
  w: 100,
  h: 100,
  fm: 'pjpg',
};
```

## ⚙️ Contributing

To update this package we regenerate the schema based on the latest contents from https://github.com/imgix/imgix-url-params:

1. Bump `imgix-url-params` in package.json.
1. `yarn install`
1. `yarn build`
1. `npm publish .`
