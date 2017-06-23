'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _emojiAnnotationToUnicode = require('emoji-annotation-to-unicode');

var _emojiAnnotationToUnicode2 = _interopRequireDefault(_emojiAnnotationToUnicode);

var _emojiEmoticonToUnicode = require('emoji-emoticon-to-unicode');

var _emojiEmoticonToUnicode2 = _interopRequireDefault(_emojiEmoticonToUnicode);

var _escapeStringRegexp = require('escape-string-regexp');

var _escapeStringRegexp2 = _interopRequireDefault(_escapeStringRegexp);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _lodash = require('lodash.compact');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getEscapedKeys(hash) {
  return Object.keys(hash).map(function (x) {
    return (0, _escapeStringRegexp2.default)(x);
  }).join('|');
}

function buildOptions(options) {
  var hash = {
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
  hash.attributes = (0, _objectAssign2.default)({ width: '20px', height: '20px' }, options.attributes);
  return hash;
}

// Use negated lookahead for `:/`, refs: https://github.com/banyan/react-emoji/issues/1
var specialEmoticons = { ':/': '1f615' };
var specialEmoticonsRegex = '\\:\\/(?!\\/)';

var emojiWithEmoticons = {
  delimiter: new RegExp('(:(?:' + getEscapedKeys(_emojiAnnotationToUnicode2.default) + '):|' + getEscapedKeys(_emojiEmoticonToUnicode2.default) + '|' + specialEmoticonsRegex + ')', 'g'),
  dict: (0, _objectAssign2.default)(_emojiAnnotationToUnicode2.default, _emojiEmoticonToUnicode2.default, specialEmoticons)
};

var emojiWithoutEmoticons = {
  delimiter: new RegExp('(:(?:' + getEscapedKeys(_emojiAnnotationToUnicode2.default) + '):)', 'g'),
  dict: _emojiAnnotationToUnicode2.default
};

function buildImageUrl(hex, options) {
  if (options.host) {
    return (0, _lodash2.default)([options.host, options.path, hex + '.' + options.ext]).join('/');
  } else if (options.emojiType === 'twemoji') {
    return 'https://twemoji.maxcdn.com/' + options.ext + '/' + hex + '.' + options.ext;
  } else if (options.emojiType === 'emojione') {
    return 'http://cdn.jsdelivr.net/emojione/assets/' + options.ext + '/' + hex.toUpperCase() + '.' + options.ext;
  } else {
    throw new Error('Invalid emojiType is passed');
  }
}

function createImageTag(hex, options) {
  if (options.symbolsUrl) {
    return (0, _react.createElement)('svg', options.attributes, (0, _react.createElement)('use', { xlinkHref: options.symbolsUrl + '#' + hex }));
  }
  return (0, _react.createElement)('img', (0, _objectAssign2.default)(options.attributes, {
    src: buildImageUrl(hex, options)
  }));
}

function getKey(key) {
  if (key.match(/^:.*:$/)) {
    return key.replace(/^:/, '').replace(/:$/, '');
  } else {
    return key;
  }
}

function emojifyTextToSingleEmoji(text, options) {
  var _ref = options.useEmoticon ? emojiWithEmoticons : emojiWithoutEmoticons,
      dict = _ref.dict;

  var hex = dict[getKey(text)];
  if (!!options.strict && !hex) throw new Error('Could not find emoji: ' + text + '.');
  if (!hex) return text;
  return createImageTag(hex, options);
}

function emojifyText(text, options) {
  var _ref2 = options.useEmoticon ? emojiWithEmoticons : emojiWithoutEmoticons,
      delimiter = _ref2.delimiter,
      dict = _ref2.dict;

  return (0, _lodash2.default)(text.split(delimiter).map(function (word, index) {
    var match = word.match(delimiter);
    if (!!options.strict && word !== '' && match === null) throw new Error('Could not find emoji: ' + word + '.');
    if (match) {
      var hex = dict[getKey(match[0])];
      if (hex === null) return word;
      return createImageTag(hex, options);
    } else {
      return word;
    }
  }));
}

function emojify(text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = buildOptions(options);
  if (options.singleEmoji) {
    return (0, _react.createElement)(options.tag, null, emojifyTextToSingleEmoji(text, options));
  } else {
    return _react.createElement.apply(undefined, [options.tag, null].concat(_toConsumableArray(emojifyText(text, options))));
  }
}

exports.default = function (_ref3) {
  var children = _ref3.children,
      options = _objectWithoutProperties(_ref3, ['children']);

  if (typeof children !== 'string') {
    throw new Error('react-emoji child must be string');
  }
  return emojify(children, options);
};

