"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Picker = require("../Picker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Picker Specs', function () {
  test('should render selected child wrapped with <PickerItem/>', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker.Picker, {
      value: 1
    }, [1, 2, 3, 4]));
    var expected = '2';
    var actual = picker.find('PickerItem').text();
    expect(actual).toBe(expected);
  });
  test('should set the max of <Picker> to be one less than the number of children', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker.Picker, {
      value: 1
    }, [1, 2, 3, 4]));
    var expected = 3;
    var actual = picker.find('Picker').last().prop('max');
    expect(actual).toBe(expected);
  });
  test('should be disabled when empty', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker.PickerBase, null, []));
    var actual = picker.find('Picker').last().prop('disabled');
    expect(actual).toBe(true);
  });
  test('should set "data-webos-voice-disabled" to decrement button when voice control is disabled', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker.PickerBase, {
      "data-webos-voice-disabled": true
    }, [1, 2, 3, 4]));
    var expected = true;
    var actual = picker.find('PickerButton').at(0).prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to increment button when voice control is disabled', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker.PickerBase, {
      "data-webos-voice-disabled": true
    }, [1, 2, 3, 4]));
    var expected = true;
    var actual = picker.find('PickerButton').at(1).prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
});