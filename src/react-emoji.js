import { createElement } from 'react';
import annotations from 'emoji-annotation-to-unicode';
import emoticons from 'emoji-emoticon-to-unicode';
import escapeStringRegexp from 'escape-string-regexp';
import assign from 'object-assign';
import compact from 'lodash.compact';

function getEscapedKeys(hash) {
  return Object.keys(hash).map(x => escapeStringRegexp(x)).join('|');
}

function buildOptions(options) {
  const hash = {
    useEmoticon: options.useEmoticon === false ? false : true,
    emojiType: options.emojiType || 'twemoji',
    host: options.host || '',
    path: options.path || '',
    ext: options.ext || 'svg',
    symbolsUrl: options.symbolsUrl || null,
    singleEmoji: options.singleEmoji || false,
    strict: options.strict || false,
    tag: options.tag || 'div'
  };
  hash.attributes = assign(
    { width: '20px', height: '20px' },
    options.attributes
  );
  return hash;
}

// Use negated lookahead for `:/`, refs: https://github.com/banyan/react-emoji/issues/1
const specialEmoticons = { ':/': '1f615' };
const specialEmoticonsRegex = '\\:\\/(?!\\/)';

const emojiWithEmoticons = {
  delimiter: new RegExp(
    `(:(?:${getEscapedKeys(annotations)}):|${getEscapedKeys(
      emoticons
    )}|${specialEmoticonsRegex})`,
    'g'
  ),
  dict: assign(annotations, emoticons, specialEmoticons)
};

const emojiWithoutEmoticons = {
  delimiter: new RegExp(`(:(?:${getEscapedKeys(annotations)}):)`, 'g'),
  dict: annotations
};

function buildImageUrl(hex, options) {
  if (options.host) {
    return compact([options.host, options.path, `${hex}.${options.ext}`]).join(
      '/'
    );
  } else if (options.emojiType === 'twemoji') {
    return `https://twemoji.maxcdn.com/${options.ext}/${hex}.${options.ext}`;
  } else if (options.emojiType === 'emojione') {
    return `http://cdn.jsdelivr.net/emojione/assets/${options.ext}/${hex.toUpperCase()}.${options.ext}`;
  } else {
    throw new Error('Invalid emojiType is passed');
  }
}

function createImageTag(hex, options) {
  if (options.symbolsUrl) {
    return createElement(
      'svg',
      options.attributes,
      createElement('use', { xlinkHref: `${options.symbolsUrl}#${hex}` })
    );
  }
  return createElement(
    'img',
    assign(options.attributes, {
      src: buildImageUrl(hex, options)
    })
  );
}

function getKey(key) {
  if (key.match(/^:.*:$/)) {
    return key.replace(/^:/, '').replace(/:$/, '');
  } else {
    return key;
  }
}

function emojifyTextToSingleEmoji(text, options) {
  let { dict } = options.useEmoticon
    ? emojiWithEmoticons
    : emojiWithoutEmoticons;
  let hex = dict[getKey(text)];
  if (!!options.strict && !hex)
    throw new Error(`Could not find emoji: ${text}.`);
  if (!hex) return text;
  return createImageTag(hex, options);
}

function emojifyText(text, options) {
  let { delimiter, dict } = options.useEmoticon
    ? emojiWithEmoticons
    : emojiWithoutEmoticons;
  return compact(
    text.split(delimiter).map(function(word, index) {
      let match = word.match(delimiter);
      if (!!options.strict && word !== '' && match === null)
        throw new Error(`Could not find emoji: ${word}.`);
      if (match) {
        let hex = dict[getKey(match[0])];
        if (hex === null) return word;
        return createImageTag(hex, options);
      } else {
        return word;
      }
    })
  );
}

function emojify(text, options = {}) {
  options = buildOptions(options);
  if (options.singleEmoji) {
    return createElement(
      options.tag,
      null,
      emojifyTextToSingleEmoji(text, options)
    );
  } else {
    return createElement(options.tag, null, ...emojifyText(text, options));
  }
}

export default ({ children, ...options }) => {
  if (typeof children !== 'string') {
    throw new Error('react-emoji child must be string');
  }
  return emojify(children, options);
};
