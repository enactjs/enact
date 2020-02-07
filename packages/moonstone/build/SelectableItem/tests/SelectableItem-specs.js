"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _SelectableItem = _interopRequireDefault(require("../SelectableItem"));

var _SelectableIconModule = _interopRequireDefault(require("../SelectableIcon.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('SelectableItem Specs', function () {
  test('should render no icon when not selected', function () {
    var selectableItem = (0, _enzyme.mount)(_react["default"].createElement(_SelectableItem["default"], null, "Hello SelectableItem"));
    var expected = 0;
    var actual = selectableItem.find(".".concat(_SelectableIconModule["default"].selected)).length;
    expect(actual).toBe(expected);
  });
  test('should render correct icon when selected', function () {
    var selectableItem = (0, _enzyme.mount)(_react["default"].createElement(_SelectableItem["default"], {
      selected: true
    }, "Hello SelectableItem"));
    var expected = 1;
    var actual = selectableItem.find(".".concat(_SelectableIconModule["default"].selected)).length;
    expect(actual).toBe(expected);
  });
});