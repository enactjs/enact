"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _TimePicker = _interopRequireDefault(require("../TimePicker"));

var _TimePickerModule = _interopRequireDefault(require("../TimePicker.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('TimePicker', function () {
  // Suite-wide setup
  test('should not generate a label when value is undefined', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      title: "Time"
    }));
    var expected = null;
    var actual = subject.find('ExpandableItem').prop('label');
    expect(actual).toBe(expected);
  });
  test('should emit an onChange event when changing a component picker', function () {
    var handleChange = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      onChange: handleChange,
      open: true,
      title: "Time",
      value: new Date(2000, 6, 15, 3, 30),
      locale: "en-US"
    }));
    var base = subject.find('DateComponentRangePicker').first();
    base.prop('onChange')({
      value: 0
    });
    var expected = 1;
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should omit labels when noLabels is true', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      hour: 1,
      meridiem: 0,
      meridiems: ['am', 'pm'],
      minute: 1,
      noLabels: true,
      open: true,
      order: ['h', 'm', 'a'],
      title: "Time"
    }));
    var expected = 3;
    var actual = subject.find(".".concat(_TimePickerModule["default"].timeComponents)).children().filterWhere(function (c) {
      return !c.prop('label');
    }).length;
    expect(actual).toBe(expected);
  });
  test('should create pickers arranged by order', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      hour: 1,
      meridiem: 0,
      meridiems: ['am', 'pm'],
      minute: 1,
      open: true,
      order: ['h', 'm', 'a'],
      title: "Time"
    }));
    var expected = ['hour', 'minute', 'AM / PM'];
    var actual = subject.find(".".concat(_TimePickerModule["default"].timeComponents)).children().map(function (c) {
      return c.prop('label');
    });
    expect(actual).toEqual(expected);
  });
  test('should accept a JavaScript Date for its value prop', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30),
      locale: "en-US"
    }));
    var minutePicker = subject.find(".".concat(_TimePickerModule["default"].minutesComponents)).at(0);
    var expected = 30;
    var actual = minutePicker.prop('value');
    expect(actual).toBe(expected);
  });
  test('should set "hourAriaLabel" to hour picker', function () {
    var label = 'custom hour aria-label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      hourAriaLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30)
    }));
    var hourPicker = subject.find(".".concat(_TimePickerModule["default"].hourComponents)).at(0);
    var expected = label;
    var actual = hourPicker.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "meridiemAriaLabel" to meridiem picker', function () {
    var label = 'custom meridiem aria-label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      meridiemAriaLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30)
    }));
    var meridiemPicker = subject.find(".".concat(_TimePickerModule["default"].meridiemComponent)).at(0);
    var expected = label;
    var actual = meridiemPicker.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "minuteAriaLabel" to minute picker', function () {
    var label = 'custom minute aria-label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      minuteAriaLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30)
    }));
    var minutePicker = subject.find(".".concat(_TimePickerModule["default"].minutesComponents)).at(0);
    var expected = label;
    var actual = minutePicker.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "hourLabel" to hour picker', function () {
    var label = 'custom hour label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      hourLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30)
    }));
    var hourPicker = subject.find(".".concat(_TimePickerModule["default"].hourComponents)).at(0);
    var expected = label;
    var actual = hourPicker.prop('label');
    expect(actual).toBe(expected);
  });
  test('should set "meridiemLabel" to meridiem picker', function () {
    var label = 'custom meridiem label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      meridiemLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30)
    }));
    var meridiemPicker = subject.find(".".concat(_TimePickerModule["default"].meridiemComponent)).at(0);
    var expected = label;
    var actual = meridiemPicker.prop('label');
    expect(actual).toBe(expected);
  });
  test('should set "minuteLabel" to minute picker', function () {
    var label = 'custom minute label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      minuteLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30)
    }));
    var minutePicker = subject.find(".".concat(_TimePickerModule["default"].minutesComponents)).at(0);
    var expected = label;
    var actual = minutePicker.prop('label');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to hour picker when voice control is disabled', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30),
      "data-webos-voice-disabled": true
    }));
    var hourPicker = subject.find(".".concat(_TimePickerModule["default"].hourComponents)).at(0);
    var expected = true;
    var actual = hourPicker.prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to merdiem picker when voice control is disabled', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30),
      "data-webos-voice-disabled": true
    }));
    var meridiemPicker = subject.find(".".concat(_TimePickerModule["default"].meridiemComponent)).at(0);
    var expected = true;
    var actual = meridiemPicker.prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to minute picker when voice control is disabled', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_TimePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30),
      "data-webos-voice-disabled": true
    }));
    var minutePicker = subject.find(".".concat(_TimePickerModule["default"].minutesComponents)).at(0);
    var expected = true;
    var actual = minutePicker.prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
});