import React from 'react';
import { shallow } from 'enzyme';

import ReactEmoji from '../src/react-emoji';

function match(actual, expected) {
  expect(shallow(actual)).toEqual(shallow(expected));
}

describe('ReactEmoji', () => {
  test('renders emojis', () => {
    match(
      <ReactEmoji>:smile:</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f604.svg"
        />
      </div>
    );
    match(
      <ReactEmoji singleEmoji>:smile:</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f604.svg"
        />
      </div>
    );
  });

  test('renders emoticon', () => {
    match(
      <ReactEmoji>:(</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f61e.svg"
        />
      </div>
    );
    match(
      <ReactEmoji>:/</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f615.svg"
        />
      </div>
    );
    match(
      <ReactEmoji useEmoticon>:(</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f61e.svg"
        />
      </div>
    );
    match(<ReactEmoji useEmoticon={false}>:(</ReactEmoji>, <div>:(</div>);
    // match(<ReactEmoji singleEmoji useEmoticon={false}>:(</ReactEmoji>, <div>:(</div>);
  });

  test('does not convert to emoji', () => {
    match(
      <ReactEmoji>http://example.org</ReactEmoji>,
      <div>http://example.org</div>
    );

    match(<ReactEmoji>:octocat:</ReactEmoji>, <div>:octocat:</div>);

    match(<ReactEmoji singleEmoji>:octocat:</ReactEmoji>, <div>:octocat:</div>);

    expect(() => {
      shallow(<ReactEmoji singleEmoji strict>:octocat:</ReactEmoji>);
    }).toThrow(/:octocat:/);
  });

  test('emojione', () => {
    match(
      <ReactEmoji emojiType="emojione">:smile:</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="http://cdn.jsdelivr.net/emojione/assets/svg/1F604.svg"
        />
      </div>
    );

    expect(() => {
      shallow(<ReactEmoji emojiType="foo">:smile:</ReactEmoji>);
    }).toThrow(/emojiType/);
  });

  test('host', () => {
    match(
      <ReactEmoji host="foo">:smile:</ReactEmoji>,
      <div>
        <img width="20px" height="20px" src="foo/1f604.svg" />
      </div>
    );
  });

  test('path', () => {
    match(
      <ReactEmoji path="svg" host="foo">:smile:</ReactEmoji>,
      <div>
        <img width="20px" height="20px" src="foo/svg/1f604.svg" />
      </div>
    );
  });

  test('ext', () => {
    match(
      <ReactEmoji ext="png">:smile:</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/png/1f604.png"
        />
      </div>
    );
  });

  test('attributes', () => {
    match(
      <ReactEmoji attributes={{ className: 'foo', width: '30px' }}>
        :smile:
      </ReactEmoji>,
      <div>
        <img
          width="30px"
          height="20px"
          className="foo"
          src="https://twemoji.maxcdn.com/svg/1f604.svg"
        />
      </div>
    );
  });

  test('multi', () => {
    match(
      <ReactEmoji>foo :smile: :(</ReactEmoji>,
      <div>
        {'foo '}
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f604.svg"
        />
        {' '}
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f61e.svg"
        />
      </div>
    );
  });

  test('symbols', () => {
    match(
      <ReactEmoji symbolsUrl="/symbols.svg">:smile:</ReactEmoji>,
      <div>
        <svg width="20px" height="20px">
          <use xlinkHref="/symbols.svg#1f604" />
        </svg>
      </div>
    );
  });

  test('invalid children', () => {
    expect(() => {
      shallow(<ReactEmoji><div /></ReactEmoji>);
    }).toThrow(/string/);
  });
});
