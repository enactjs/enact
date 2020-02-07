"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _DayPicker = _interopRequireDefault(require("../DayPicker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('DayPicker', function () {
  describe('#aria-label', function () {
    test('should use title, selected long string when day is single selected', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_DayPicker["default"], {
        title: "Day Picker",
        selected: 0
      }));
      var expected = 'Day Picker Sunday';
      var actual = subject.find('DayPicker').prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should use title, selected long string when day is multi selected', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_DayPicker["default"], {
        title: "Day Picker",
        selected: [0, 1]
      }));
      var expected = 'Day Picker Sunday, Monday';
      var actual = subject.find('DayPicker').prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should be null when day is not selected', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_DayPicker["default"], {
        title: "Day Picker"
      }));
      var expected = undefined; // eslint-disable-line no-undefined

      var actual = subject.find('DayPicker').prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should be null when every day is selected', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_DayPicker["default"], {
        title: "Day Picker",
        everyDayText: "every",
        selected: [0, 1, 2, 3, 4, 5, 6]
      }));
      var expected = 'Day Picker every';
      var actual = subject.find('DayPicker').prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should be null when every weekday is selected', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_DayPicker["default"], {
        title: "Day Picker",
        everyWeekdayText: "weekday",
        selected: [1, 2, 3, 4, 5]
      }));
      var expected = 'Day Picker weekday';
      var actual = subject.find('DayPicker').prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should be null when every weekend is selected', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_DayPicker["default"], {
        title: "Day Picker",
        everyWeekendText: "weekend",
        selected: [0, 6]
      }));
      var expected = 'Day Picker weekend';
      var actual = subject.find('DayPicker').prop('aria-label');
      expect(actual).toBe(expected);
    });
  });
});