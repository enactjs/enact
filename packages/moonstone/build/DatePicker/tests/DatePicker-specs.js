"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _DatePicker = _interopRequireDefault(require("../DatePicker"));

var _DatePickerModule = _interopRequireDefault(require("../DatePicker.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('DatePicker', function () {
  // Suite-wide setup
  test('should not generate a label when value is undefined', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      title: "Date"
    }));
    var expected = null;
    var actual = subject.find('ExpandableItem').prop('label');
    expect(actual).toBe(expected);
  });
  test('should emit an onChange event when changing a component picker', function () {
    var handleChange = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      onChange: handleChange,
      open: true,
      title: "Date",
      value: new Date(2000, 6, 15),
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
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      day: 1,
      maxDays: 31,
      maxMonths: 12,
      month: 1,
      noLabels: true,
      open: true,
      order: ['m', 'd', 'y'],
      title: "Date",
      year: 2000
    }));
    var expected = 3;
    var actual = subject.find('DateComponentRangePicker').filterWhere(function (c) {
      return !c.prop('label');
    }).length;
    expect(actual).toBe(expected);
  });
  test('should create pickers arranged by order', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      title: "Date",
      day: 1,
      maxDays: 31,
      month: 1,
      maxMonths: 12,
      year: 2000,
      order: ['m', 'd', 'y'],
      open: true
    }));
    var expected = ['month', 'day', 'year'];
    var actual = subject.find('DateComponentRangePicker').map(function (c) {
      return c.prop('label');
    });
    expect(actual).toEqual(expected);
  });
  test('should accept a JavaScript Date for its value prop', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1),
      locale: "en-US"
    }));
    var yearPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].year));
    var expected = 2000;
    var actual = yearPicker.prop('value');
    expect(actual).toBe(expected);
  });
  test('should set "dayAriaLabel" to day picker', function () {
    var label = 'custom day aria-label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      dayAriaLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1)
    }));
    var dayPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].day));
    var expected = label;
    var actual = dayPicker.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "monthAriaLabel" to month picker', function () {
    var label = 'custom month aria-label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      monthAriaLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1)
    }));
    var monthPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].month));
    var expected = label;
    var actual = monthPicker.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "yearAriaLabel" to year picker', function () {
    var label = 'custom year aria-label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1),
      yearAriaLabel: label
    }));
    var yearPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].year));
    var expected = label;
    var actual = yearPicker.prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set "dayLabel" to day label', function () {
    var label = 'custom day label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      dayLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1)
    }));
    var dayPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].day));
    var expected = label;
    var actual = dayPicker.prop('label');
    expect(actual).toBe(expected);
  });
  test('should set "monthAriaLabel" to month picker', function () {
    var label = 'custom month label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      monthLabel: label,
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1)
    }));
    var monthPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].month));
    var expected = label;
    var actual = monthPicker.prop('label');
    expect(actual).toBe(expected);
  });
  test('should set "yearAriaLabel" to year picker', function () {
    var label = 'custom year label';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1),
      yearLabel: label
    }));
    var yearPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].year));
    var expected = label;
    var actual = yearPicker.prop('label');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to day picker when voice control is disabled', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1),
      "data-webos-voice-disabled": true
    }));
    var dayPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].day));
    var expected = true;
    var actual = dayPicker.prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to month picker when voice control is disabled', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1),
      "data-webos-voice-disabled": true
    }));
    var monthPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].month));
    var expected = true;
    var actual = monthPicker.prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to year picker when voice control is disabled', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DatePicker["default"], {
      open: true,
      title: "Date",
      value: new Date(2000, 0, 1),
      "data-webos-voice-disabled": true
    }));
    var yearPicker = subject.find("DateComponentRangePicker.".concat(_DatePickerModule["default"].year));
    var expected = true;
    var actual = yearPicker.prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
});