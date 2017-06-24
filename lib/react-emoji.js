"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var annotations = require("emoji-annotation-to-unicode");
var emoticons = require("emoji-emoticon-to-unicode");
var escapeStringRegexp = require("escape-string-regexp");
function getEscapedKeys(hash) {
    return Object.keys(hash).map(function (x) { return escapeStringRegexp(x); }).join('|');
}
var specialEmoticons = { ':/': '1f615' };
var specialEmoticonsRegex = '\\:\\/(?!\\/)';
var delimiter = new RegExp("(:(?:" + getEscapedKeys(annotations) + "):|" + getEscapedKeys(emoticons) + "|" + specialEmoticonsRegex + ")", 'g');
var dict = __assign({}, annotations, emoticons, specialEmoticons);
function getKey(key) {
    if (key.match(/^:.*:$/)) {
        return key.replace(/^:/, '').replace(/:$/, '');
    }
    else {
        return key;
    }
}
var SIZE = "20px";
function createImageTag(hex, props) {
    switch (props.type) {
        case EmojiType.EMOJIONE:
            return React.createElement("img", __assign({ width: SIZE, height: SIZE }, props.imgAttrs, { src: "http://cdn.jsdelivr.net/emojione/assets/svg/" + hex.toUpperCase() + ".svg" }));
        case EmojiType.SYMBOLS:
            return (React.createElement("svg", __assign({ width: SIZE, height: SIZE }, props.svgAttrs),
                React.createElement("use", { xlinkHref: props.symbolsUrl + "#" + hex })));
        default:
            return React.createElement("img", __assign({ width: SIZE, height: SIZE }, props.imgAttrs, { src: "https://twemoji.maxcdn.com/svg/" + hex + ".svg" }));
    }
}
function emojifyText(text, props) {
    return text.split(delimiter).map(function (word) {
        var match = word.match(delimiter);
        if (match) {
            var hex = dict[getKey(match[0])];
            if (hex === null)
                return word;
            return createImageTag(hex, props);
        }
        return word;
    });
}
var EmojiType;
(function (EmojiType) {
    EmojiType[EmojiType["TWITTER"] = 0] = "TWITTER";
    EmojiType[EmojiType["EMOJIONE"] = 1] = "EMOJIONE";
    EmojiType[EmojiType["SYMBOLS"] = 2] = "SYMBOLS";
})(EmojiType = exports.EmojiType || (exports.EmojiType = {}));
exports.ReactEmoji = function (props) { return React.createElement.apply(React, [props.tag || 'div',
    props.attrs].concat(emojifyText(props.children, props))); };
//# sourceMappingURL=react-emoji.js.map