"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _RangePicker = require("../RangePicker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tap = function tap(node) {
  node.simulate('mousedown');
  node.simulate('mouseup');
};

var decrement = function decrement(slider) {
  return tap(slider.find('IconButton').last());
};

var increment = function increment(slider) {
  return tap(slider.find('IconButton').first());
};

describe('RangePicker Specs', function () {
  test('should render a single child with the current value', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_RangePicker.RangePicker, {
      min: -10,
      max: 20,
      value: 10
    }));
    var expected = '10';
    var actual = picker.find('PickerItem').text();
    expect(actual).toBe(expected);
  });
  test('should increase by step amount on increment press', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_RangePicker.RangePicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1,
      noAnimation: true
    }));
    increment(picker);
    var expected = '11';
    var actual = picker.find('PickerItem').first().text();
    expect(actual).toBe(expected);
  });
  test('should decrease by step amount on decrement press', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_RangePicker.RangePicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1,
      noAnimation: true
    }));
    decrement(picker);
    var expected = '9';
    var actual = picker.find('PickerItem').first().text();
    expect(actual).toBe(expected);
  });
  test('should pad the value', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_RangePicker.RangePicker, {
      min: 0,
      max: 100,
      value: 10,
      step: 1,
      padded: true
    }));
    var expected = '010';
    var actual = picker.find('PickerItem').text();
    expect(actual).toBe(expected);
  });
  test('should pad the value when min has more digits than max', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_RangePicker.RangePicker, {
      min: -1000,
      max: 100,
      value: 10,
      step: 1,
      padded: true
    }));
    var expected = '0010';
    var actual = picker.find('PickerItem').text();
    expect(actual).toBe(expected);
  });
  test('should be disabled when limited to a single value', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_RangePicker.RangePickerBase, {
      min: 0,
      max: 0,
      value: 0
    }));
    var actual = picker.find('Picker').last().prop('disabled');
    expect(actual).toBe(true);
  });
});