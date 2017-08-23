import * as annotations from "emoji-annotation-to-unicode";
import * as emoticons from "emoji-emoticon-to-unicode";
import * as escapeStringRegexp from "escape-string-regexp";
import * as React from "react";

function getEscapedKeys(hash: { [key: string]: any }): string {
  return Object.keys(hash).map((x) => escapeStringRegexp(x)).join("|");
}

const specialEmoticons = { ":/": "1f615" };
const specialEmoticonsRegex = "\\:\\/(?!\\/)";

const delimiter = new RegExp(
  `(:(?:${getEscapedKeys(annotations)}):|${getEscapedKeys(
    emoticons,
  )}|${specialEmoticonsRegex})`,
  "g",
);

const dict: { [key: string]: string } = { ...annotations, ...emoticons, ...specialEmoticons };

function getKey(key: string): string {
  if (key.match(/^:.*:$/)) {
    return key.replace(/^:/, "").replace(/:$/, "");
  } else {
    return key;
  }
}

const SIZE = "20px";

function createImageTag(hex: string, props: IReactEmojiProps) {
  switch (props.type) {
    case EmojiType.EMOJIONE:
      return (
        <img width={SIZE} height={SIZE} {...props.imgAttrs}
          src={`http://cdn.jsdelivr.net/emojione/assets/svg/${hex.toUpperCase()}.svg`} />
      );
    case EmojiType.SYMBOLS:
      return (
        <svg width={SIZE} height={SIZE} {...props.svgAttrs}>
          <use xlinkHref={`${props.symbolsUrl}#${hex}`} />
        </svg>
      );
    default:
      return (
        <img width={SIZE} height={SIZE} {...props.imgAttrs}
          src={`https://twemoji.maxcdn.com/svg/${hex}.svg`} />
      );
  }
}

function emojifyText(text: string, props: IReactEmojiProps): React.ReactChild[] {
  return text.split(delimiter).map((word) => {
    const match = word.match(delimiter);
    if (match) {
      const hex = dict[getKey(match[0])];
      if (hex === null) {
        return word;
      }
      return createImageTag(hex, props);
    }
    return word;
  }).filter((child) => {
    if (typeof child === "string") {
      if (!child.length) {
        return false;
      }
    }
    return true;
  });
}

export enum EmojiType {
  TWITTER,
  EMOJIONE,
  SYMBOLS,
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

export const ReactEmoji: React.SFC<IReactEmojiProps> = (props) => {
  const children = React.Children.map(props.children, (child) => {
    if (typeof child === "string") {
      return emojifyText(child, props);
    }
    return child;
  });
  return React.createElement(
    props.tag || "div",
    props.attrs,
    ...children,
  );
};
