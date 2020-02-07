"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _LabeledItem = _interopRequireDefault(require("../LabeledItem"));

var _LabeledItemModule = _interopRequireDefault(require("../LabeledItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('LabeledItem Specs', function () {
  var labelClass = 'div.' + _LabeledItemModule["default"].label;
  test('should render a label (<div>) by default', function () {
    var item = (0, _enzyme.mount)(_react["default"].createElement(_LabeledItem["default"], {
      label: "The Label"
    }, "I am a labeledItem"));
    var divTag = item.find(labelClass);
    var expected = 1;
    var actual = divTag.length;
    expect(actual).toBe(expected);
  });
  test('should not render a label if there is no \'label\' prop', function () {
    var item = (0, _enzyme.mount)(_react["default"].createElement(_LabeledItem["default"], null, "I am a labeledItem"));
    var divTag = item.find(labelClass);
    var expected = 0;
    var actual = divTag.length;
    expect(actual).toBe(expected);
  });
  test('should create a LabeledItem that is enabled by default', function () {
    var item = (0, _enzyme.mount)(_react["default"].createElement(_LabeledItem["default"], null, "I am a labeledItem"));
    var expected = 0;
    var actual = item.find({
      disabled: true
    }).length;
    expect(actual).toBe(expected);
  });
  test('should have \'disabled\' HTML attribute when \'disabled=true\'', function () {
    var item = (0, _enzyme.shallow)(_react["default"].createElement(_LabeledItem["default"], {
      disabled: true
    }, "I am a disabled labeledItem"));
    var expected = 1;
    var actual = item.find({
      disabled: true
    }).length;
    expect(actual).toBe(expected);
  });
});