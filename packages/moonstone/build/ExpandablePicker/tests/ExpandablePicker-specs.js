"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ExpandablePicker = _interopRequireDefault(require("../ExpandablePicker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tap = function tap(node) {
  node.simulate('mousedown');
  node.simulate('mouseup');
};

describe('ExpandablePicker Specs', function () {
  test('should close onChange', function () {
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      defaultOpen: true,
      title: "Options"
    }, ['Option one', 'Option two', 'Option three']));
    var checkButton = expandablePicker.find('IconButton').last();
    tap(checkButton);
    var expected = false;
    var actual = expandablePicker.find('ExpandableItem').props().open;
    expect(actual).toBe(expected);
  });
  test('should include value in onChange when value is specified', function () {
    var value = 2;
    var handleChange = jest.fn();
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      onChange: handleChange,
      open: true,
      title: "Options",
      value: value
    }, ['Option one', 'Option two', 'Option three']));
    var checkButton = expandablePicker.find('IconButton').last();
    tap(checkButton);
    var expected = value;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should include default value in onChange when value is not specified', function () {
    var value = 0;
    var handleChange = jest.fn();
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      onChange: handleChange,
      open: true,
      title: "Options"
    }, ['Option one', 'Option two', 'Option three']));
    var checkButton = expandablePicker.find('IconButton').last();
    tap(checkButton);
    var expected = value;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should set "checkButtonAriaLabel" to check button', function () {
    var label = 'custom check button aria-label';
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      checkButtonAriaLabel: label,
      open: true,
      title: "Options"
    }, ['Option one', 'Option two', 'Option three']));
    var checkButton = expandablePicker.find('IconButton').at(2);
    var expected = label;
    var actual = checkButton.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "decrementAriaLabel" to previous button', function () {
    var label = 'custom previous button aria-label';
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      decrementAriaLabel: label,
      open: true,
      title: "Options"
    }, ['Option one', 'Option two', 'Option three']));
    var checkButton = expandablePicker.find('IconButton').at(1);
    var expected = label;
    var actual = checkButton.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "incrementAriaLabel" to next button', function () {
    var label = 'custom next button aria-label';
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      incrementAriaLabel: label,
      open: true,
      title: "Options"
    }, ['Option one', 'Option two', 'Option three']));
    var checkButton = expandablePicker.find('IconButton').at(0);
    var expected = label;
    var actual = checkButton.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "pickerAriaLabel" to joined picker', function () {
    var label = 'custom joined picker aria-label';
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      joined: true,
      open: true,
      pickerAriaLabel: label,
      title: "Options"
    }, ['Option one', 'Option two', 'Option three']));
    var joinedPicker = expandablePicker.find('Picker').at(1);
    var expected = label;
    var actual = joinedPicker.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to decrement button when voice control is disabled', function () {
    var children = ['option1', 'option2', 'option3'];
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      "data-webos-voice-disabled": true,
      title: "Options",
      open: true
    }, children));
    var expected = true;
    var actual = expandablePicker.find('IconButton').at(0).prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to increment button when voice control is disabled', function () {
    var children = ['option1', 'option2', 'option3'];
    var expandablePicker = (0, _enzyme.mount)(_react["default"].createElement(_ExpandablePicker["default"], {
      "data-webos-voice-disabled": true,
      title: "Options",
      open: true
    }, children));
    var expected = true;
    var actual = expandablePicker.find('IconButton').at(1).prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
});