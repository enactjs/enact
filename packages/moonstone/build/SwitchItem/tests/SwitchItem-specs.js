"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _SwitchItem = _interopRequireDefault(require("../SwitchItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('SwitchItem Specs', function () {
  test('should contain a Switch', function () {
    var switchItem = (0, _enzyme.mount)(_react["default"].createElement(_SwitchItem["default"], null, "SwitchItem"));
    var expected = 1;
    var actual = switchItem.find('Switch').length;
    expect(actual).toBe(expected);
  });
  test('should pass selected to Switch element', function () {
    var switchItem = (0, _enzyme.mount)(_react["default"].createElement(_SwitchItem["default"], {
      selected: true
    }, "SwitchItem"));
    var SwitchComponent = switchItem.find('Switch');
    var expected = true;
    var actual = SwitchComponent.prop('selected');
    expect(actual).toBe(expected);
  });
  test('should pass disabled to Switch element', function () {
    var switchItem = (0, _enzyme.mount)(_react["default"].createElement(_SwitchItem["default"], {
      disabled: true
    }, "SwitchItem"));
    var SwitchComponent = switchItem.find('Switch');
    var expected = true;
    var actual = SwitchComponent.prop('disabled');
    expect(actual).toBe(expected);
  });
});