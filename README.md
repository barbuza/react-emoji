# react-emoji-ng

[![Build Status](https://travis-ci.org/barbuza/react-emoji-ng.svg?branch=master)](https://travis-ci.org/barbuza/react-emoji-ng)
[![Coverage Status](https://coveralls.io/repos/github/barbuza/react-emoji-ng/badge.svg?branch=master)](https://coveralls.io/github/barbuza/react-emoji-ng?branch=master)

simple emoji component for react

## exports
```typescript
import * as React from "react";
export declare enum EmojiType {
    TWITTER = 0,
    EMOJIONE = 1,
    SYMBOLS = 2,
}
export interface IReactEmojiProps {
    attrs?: React.HTMLAttributes<HTMLElement>;
    imgAttrs?: React.HTMLAttributes<HTMLImageElement>;
    svgAttrs?: React.SVGAttributes<SVGSVGElement>;
    children: string;
    symbolsUrl?: string;
    type?: EmojiType;
    tag?: string;
}
export declare const ReactEmoji: React.SFC<IReactEmojiProps>;
```

## usage
```typescript
<ReactEmoji>foo :smile: :(</ReactEmoji>
```
renders to
```typescript
<div>
  {"foo "}
  <img
    width="20px"
    height="20px"
    src="https://twemoji.maxcdn.com/svg/1f604.svg"
  />
  {" "}
  <img
    width="20px"
    height="20px"
    src="https://twemoji.maxcdn.com/svg/1f61e.svg"
  />
</div>
```
