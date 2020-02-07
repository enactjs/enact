"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Heading = _interopRequireDefault(require("../Heading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Heading Specs', function () {
  test('should render a Heading with content', function () {
    var content = 'Hello Heading!';
    var heading = (0, _enzyme.mount)(_react["default"].createElement(_Heading["default"], null, content));
    var expected = content;
    var actual = heading.text();
    expect(actual).toBe(expected);
  });
});