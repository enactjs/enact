"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('DateTimeDecorator', function () {
  test('should accept an updated JavaScript Date for its value prop', function () {
    var Picker = (0, _["default"])({}, function PickerBase() {
      return _react["default"].createElement("div", null);
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Picker, {
      title: "Date",
      value: new Date(2000, 0, 1, 12, 30),
      locale: "en-US"
    }));
    subject.setProps({
      value: new Date(2000, 0, 1, 12, 45)
    });
    var expected = 45;
    var actual = subject.find('PickerBase').prop('value').getMinutes();
    expect(actual).toBe(expected);
  });
});