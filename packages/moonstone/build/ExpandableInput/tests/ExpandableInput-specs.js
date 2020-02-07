"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ExpandableInput = require("../ExpandableInput");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('ExpandableInputBase', function () {
  var inputHint = ' Input field';
  describe('#aria-label', function () {
    test('should use title, value, and input hint', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item",
        value: "value"
      }));
      var expected = 'Item value' + inputHint;
      var actual = subject.prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should use title, noneText, and input hint when value is not set', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item",
        noneText: "noneText"
      }));
      var expected = 'Item noneText' + inputHint;
      var actual = subject.prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should use title and input hint when value and noneText are not set', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item"
      }));
      var expected = 'Item ' + inputHint; // the extra space is intentional

      var actual = subject.prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should use title, character count, and input hint when type is "password"', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item",
        type: "password",
        value: "long"
      }));
      var expected = 'Item 4 characters' + inputHint;
      var actual = subject.prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should use title, single character count, and input hint when type is "password" and value length is 1', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item",
        type: "password",
        value: "1"
      }));
      var expected = 'Item 1 character' + inputHint;
      var actual = subject.prop('aria-label');
      expect(actual).toBe(expected);
    });
  });
  describe('#label', function () {
    test('should use value', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item",
        value: "value"
      }));
      var expected = 'value';
      var actual = subject.prop('label');
      expect(actual).toBe(expected);
    });
    test('should use noneText when value is not set', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item",
        noneText: "noneText"
      }));
      var expected = 'noneText';
      var actual = subject.prop('label');
      expect(actual).toBe(expected);
    });
    test('should be excluded when type is "password"', function () {
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_ExpandableInput.ExpandableInputBase, {
        title: "Item",
        value: "value",
        type: "password"
      }));
      var expected = null;
      var actual = subject.prop('label');
      expect(actual).toBe(expected);
    });
  });
});
describe('ExpandableInput', function () {
  test('should pass onChange callback to input', function () {
    var handleChange = jest.fn();
    var value = 'input string';
    var evt = {
      target: {
        value: value
      }
    };
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableInput.ExpandableInput, {
      title: "Item",
      open: true,
      onChange: handleChange
    }));
    subject.find('input').simulate('change', evt);
    var expected = value;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
});