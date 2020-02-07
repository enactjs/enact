"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _RadioItem = _interopRequireDefault(require("../RadioItem"));

var _RadioItemModule = _interopRequireDefault(require("../RadioItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('RadioItem Specs', function () {
  test('should render correct icon when not selected', function () {
    var radioItem = (0, _enzyme.mount)(_react["default"].createElement(_RadioItem["default"], null, "Hello RadioItem"));
    var expected = 0;
    var actual = radioItem.find(".".concat(_RadioItemModule["default"].selected)).length;
    expect(actual).toBe(expected);
  });
  test('should render correct icon when selected', function () {
    var radioItem = (0, _enzyme.mount)(_react["default"].createElement(_RadioItem["default"], {
      selected: true
    }, "Hello RadioItem"));
    var expected = 1;
    var actual = radioItem.find(".".concat(_RadioItemModule["default"].selected)).length;
    expect(actual).toBe(expected);
  });
});