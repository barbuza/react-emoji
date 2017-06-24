import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EmojiType, ReactEmoji } from "./react-emoji";

function match(actual: JSX.Element, expected: JSX.Element) {
  expect(renderToStaticMarkup(actual))
    .toBe(renderToStaticMarkup(expected));
}

describe("ReactEmoji", () => {
  test("renders emojis", () => {
    match(
      <ReactEmoji>:smile:</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f604.svg"
        />
      </div>,
    );
  });

  test("renders emoticon", () => {
    match(
      <ReactEmoji>:(</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f61e.svg"
        />
      </div>,
    );
    match(
      <ReactEmoji>:/</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="https://twemoji.maxcdn.com/svg/1f615.svg"
        />
      </div>,
    );
  });

  test("does not convert to emoji", () => {
    match(
      <ReactEmoji>http://example.org</ReactEmoji>,
      <div>http://example.org</div>,
    );

    match(<ReactEmoji>:octocat:</ReactEmoji>, <div>:octocat:</div>);
  });

  test("emojione", () => {
    match(
      <ReactEmoji type={EmojiType.EMOJIONE}>:smile:</ReactEmoji>,
      <div>
        <img
          width="20px"
          height="20px"
          src="http://cdn.jsdelivr.net/emojione/assets/svg/1F604.svg"
        />
      </div>,
    );
  });

  test("attributes", () => {
    match(
      <ReactEmoji imgAttrs={{ className: "foo", width: "30px" }}>
        :smile:
      </ReactEmoji>,
      <div>
        <img
          width="30px"
          height="20px"
          className="foo"
          src="https://twemoji.maxcdn.com/svg/1f604.svg"
        />
      </div>,
    );
  });

  test("multi", () => {
    match(
      <ReactEmoji>foo :smile: :(</ReactEmoji>,
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
      </div>,
    );
  });

  test("symbols", () => {
    match(
      <ReactEmoji type={EmojiType.SYMBOLS} symbolsUrl="/symbols.svg">:smile:</ReactEmoji>,
      <div>
        <svg width="20px" height="20px">
          <use xlinkHref="/symbols.svg#1f604" />
        </svg>
      </div>,
    );
  });
});
