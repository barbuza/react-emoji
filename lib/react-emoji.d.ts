/// <reference types="react" />
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
