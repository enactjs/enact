"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Header = _interopRequireDefault(require("../Header"));

var _HeaderModule = _interopRequireDefault(require("../Header.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Header Specs', function () {
  test('should render with title text without changing case', function () {
    var msg = 'cRaZy-cased super Header';
    var header = (0, _enzyme.mount)(_react["default"].createElement(_Header["default"], null, _react["default"].createElement("title", null, msg)));
    var expected = msg;
    var actual = header.find('h1').text();
    expect(actual).toBe(expected);
  });
  test('should have fullBleed class applied', function () {
    var header = (0, _enzyme.mount)(_react["default"].createElement(_Header["default"], {
      fullBleed: true
    }, _react["default"].createElement("title", null, "Header")));
    var expected = true;
    var actual = header.find('header').hasClass(_HeaderModule["default"].fullBleed);
    expect(actual).toBe(expected);
  });
  test('should inject a custom component when headerInput is used', function () {
    var Input = function Input() {
      return _react["default"].createElement("input", null);
    }; // This just uses an <input> tag for easy discoverability. It should behave the same way
    // as a moonstone/Input, the standard here, but that would require importing a diffenent
    // component than what we're testing here.


    var header = (0, _enzyme.mount)(_react["default"].createElement(_Header["default"], null, _react["default"].createElement("title", null, "Header"), _react["default"].createElement("headerInput", null, _react["default"].createElement(Input, null))));
    var expected = 1;
    var actual = header.find('input');
    expect(actual).toHaveLength(expected);
  });
});