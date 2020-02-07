"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _IconButton = _interopRequireDefault(require("../IconButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('IconButton Specs', function () {
  test('should apply same \'size\' prop to both <Icon> and <Button> children', function () {
    var iconButton = (0, _enzyme.mount)(_react["default"].createElement(_IconButton["default"], {
      size: "small"
    }, "star"));
    var icon = iconButton.find('Icon');
    var button = iconButton.find('Button');
    var expected = true;
    var actual = icon.prop('size') === button.prop('size');
    expect(actual).toBe(expected);
  });
  test('should always maintain minWidth=false for its <Button> child', function () {
    var iconButton = (0, _enzyme.mount)(_react["default"].createElement(_IconButton["default"], {
      minWidth: true
    }, "star"));
    var button = iconButton.find('Button');
    var expected = false;
    var actual = button.prop('minWidth');
    expect(actual).toBe(expected);
  });
});