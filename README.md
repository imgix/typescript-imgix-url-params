# typescript-imgix-url-params

> TypeScript definitions of imgix's URL parameters.

![NPM version](http://img.shields.io/npm/v/typescript-imgix-url-params.svg?style=flat-square)](https://www.npmjs.com/package/typescript-imgix-url-params)
[![NPM downloads](http://img.shields.io/npm/dm/typescript-imgix-url-params.svg?style=flat-square)](https://www.npmjs.com/package/typescript-imgix-url-params)
[![Build Status](https://img.shields.io/github/workflow/status/JamieMason/typescript-imgix-url-params/ci)](https://github.com/JamieMason/typescript-imgix-url-params/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/516439365fdd0e3c6526/maintainability)](https://codeclimate.com/github/JamieMason/typescript-imgix-url-params/maintainability)

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
