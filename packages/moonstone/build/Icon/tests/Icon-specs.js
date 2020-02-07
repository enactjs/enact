"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Icon = require("../Icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Icon Specs', function () {
  test('should return the correct Unicode value for named icon \'star\'', function () {
    var icon = (0, _enzyme.mount)(_react["default"].createElement(_Icon.IconBase, null, "star"));
    var expected = 983080; // decimal converted charCode of Unicode 'star' character

    var actual = icon.text().codePointAt();
    expect(actual).toBe(expected);
  });
  test('should return the correct Unicode value when provided \'star\' hex value', function () {
    var icon = (0, _enzyme.mount)(_react["default"].createElement(_Icon.IconBase, null, "0x0F0028"));
    var expected = 983080; // decimal converted charCode of character

    var actual = icon.text().codePointAt();
    expect(actual).toBe(expected);
  });
  test('should return the correct Unicode value when provided HTML entity as hex value', function () {
    var icon = (0, _enzyme.mount)(_react["default"].createElement(_Icon.IconBase, null, "\u2605"));
    var expected = 9733; // decimal converted charCode of character

    var actual = icon.text().codePointAt();
    expect(actual).toBe(expected);
  });
  test('should return the correct Unicode value when provided Unicode reference', function () {
    var icon = (0, _enzyme.mount)(_react["default"].createElement(_Icon.IconBase, null, "\\u0F0028"));
    var expected = 983080; // decimal converted charCode of Unicode 'star' character

    var actual = icon.text().codePointAt();
    expect(actual).toBe(expected);
  });
  test('should support high code point Unicode values', function () {
    var icon = (0, _enzyme.mount)(_react["default"].createElement(_Icon.IconBase, null, String.fromCodePoint(0x0F0028)));
    var expected = 983080; // decimal converted charCode of Unicode 'star' character

    var actual = icon.text().codePointAt();
    expect(actual).toBe(expected);
  });
});