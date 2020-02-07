"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Button = _interopRequireDefault(require("../Button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Button', function () {
  test('should have \'disabled\' HTML attribute when \'disabled\' prop is provided', function () {
    var button = (0, _enzyme.mount)(_react["default"].createElement(_Button["default"], {
      disabled: true
    }, "I am a disabled Button"));
    var expected = true;
    var actual = button.find('div').at(0).prop('disabled');
    expect(actual).toBe(expected);
  });
  describe('events', function () {
    test('should call onClick when not disabled', function () {
      var handleClick = jest.fn();
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Button["default"], {
        onClick: handleClick
      }, "I am a disabled Button"));
      subject.simulate('click');
      var expected = 1;
      var actual = handleClick.mock.calls.length;
      expect(actual).toBe(expected);
    });
    test('should not call onClick when disabled', function () {
      var handleClick = jest.fn();
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Button["default"], {
        disabled: true,
        onClick: handleClick
      }, "I am a disabled Button"));
      subject.simulate('click');
      var expected = 0;
      var actual = handleClick.mock.calls.length;
      expect(actual).toBe(expected);
    });
    test('should have "Select" voice intent in the node of "role=button"', function () {
      var button = (0, _enzyme.mount)(_react["default"].createElement(_Button["default"], null, "Hello"));
      var expected = 'Select';
      var actual = button.find('[role="button"]').prop('data-webos-voice-intent');
      expect(actual).toBe(expected);
    });
  });
});