"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Input = _interopRequireDefault(require("../Input"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isPaused = function isPaused() {
  return _spotlight["default"].isPaused() ? 'paused' : 'not paused';
};

describe('Input Specs', function () {
  test('should have an input element', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], null));
    expect(subject.find('input')).toHaveLength(1);
  });
  test('should include a placeholder if specified', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      placeholder: "hello"
    }));
    expect(subject.find('input').prop('placeholder')).toBe('hello');
  });
  test('should callback onChange when the text changes', function () {
    var handleChange = jest.fn();
    var value = 'blah';
    var evt = {
      target: {
        value: value
      }
    };
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      onChange: handleChange
    }));
    subject.find('input').simulate('change', evt);
    var expected = value;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should blur input on enter if dismissOnEnter', function () {
    var node = document.body.appendChild(document.createElement('div'));
    var handleChange = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      onBlur: handleChange,
      dismissOnEnter: true
    }), {
      attachTo: node
    });
    var input = subject.find('input');
    input.simulate('mouseDown');
    input.simulate('keyUp', {
      which: 13,
      keyCode: 13,
      code: 13
    });
    node.remove();
    var expected = 1;
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should be able to be disabled', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      disabled: true
    }));
    expect(subject.find('input').prop('disabled')).toBe(true);
  });
  test('should reflect the value if specified', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      value: "hello"
    }));
    expect(subject.find('input').prop('value')).toBe('hello');
  });
  test('should have dir equal to rtl when there is rtl text', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      value: "\u05E9\u05D5\u05E2\u05DC \u05D4\u05D7\u05D5\u05DD \u05D4\u05D6\u05E8\u05D9\u05D6 \u05E7\u05E4\u05E5 \u05DE\u05E2\u05DC \u05D4\u05DB\u05DC\u05D1 \u05D4\u05E2\u05E6\u05DC\u05DF.\u05E6\u05D9\u05E4\u05D5\u05E8 \u05E2\u05E4\u05D4 \u05D4\u05E9\u05E2\u05D5\u05E2\u05D9\u05EA \u05E2\u05DD \u05E9\u05E7\u05D9"
    }));
    var expected = 'rtl';
    var actual = subject.find('input').prop('dir');
    expect(actual).toBe(expected);
  });
  test('should have dir equal to ltr when there is ltr text', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      value: "content"
    }));
    var expected = 'ltr';
    var actual = subject.find('input').prop('dir');
    expect(actual).toBe(expected);
  });
  test('should have dir equal to rtl when there is rtl text in the placeholder', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      value: "\u05E9\u05D5\u05E2\u05DC \u05D4\u05D7\u05D5\u05DD \u05D4\u05D6\u05E8\u05D9\u05D6 \u05E7\u05E4\u05E5 \u05DE\u05E2\u05DC \u05D4\u05DB\u05DC\u05D1 \u05D4\u05E2\u05E6\u05DC\u05DF.\u05E6\u05D9\u05E4\u05D5\u05E8 \u05E2\u05E4\u05D4 \u05D4\u05E9\u05E2\u05D5\u05E2\u05D9\u05EA \u05E2\u05DD \u05E9\u05E7\u05D9"
    }));
    var expected = 'rtl';
    var actual = subject.find('input').prop('dir');
    expect(actual).toBe(expected);
  });
  test('should have dir equal to ltr when there is ltr text in the placeholder', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      placeholder: "content"
    }));
    var expected = 'ltr';
    var actual = subject.find('input').prop('dir');
    expect(actual).toBe(expected);
  });
  test('should have dir equal to rtl when there is ltr text in the placeholder, but rtl text in value', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      placeholder: "content",
      value: "\u05E9\u05D5\u05E2\u05DC \u05D4\u05D7\u05D5\u05DD \u05D4\u05D6\u05E8\u05D9\u05D6 \u05E7\u05E4\u05E5 \u05DE\u05E2\u05DC \u05D4\u05DB\u05DC\u05D1 \u05D4\u05E2\u05E6\u05DC\u05DF.\u05E6\u05D9\u05E4\u05D5\u05E8 \u05E2\u05E4\u05D4 \u05D4\u05E9\u05E2\u05D5\u05E2\u05D9\u05EA \u05E2\u05DD \u05E9\u05E7\u05D9"
    }));
    var expected = 'rtl';
    var actual = subject.find('input').prop('dir');
    expect(actual).toBe(expected);
  });
  test('should have dir equal to ltr when there is rtl text in the placeholder, but ltr text in value', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      placeholder: "\u05E9\u05D5\u05E2\u05DC \u05D4\u05D7\u05D5\u05DD \u05D4\u05D6\u05E8\u05D9\u05D6 \u05E7\u05E4\u05E5 \u05DE\u05E2\u05DC \u05D4\u05DB\u05DC\u05D1 \u05D4\u05E2\u05E6\u05DC\u05DF.\u05E6\u05D9\u05E4\u05D5\u05E8 \u05E2\u05E4\u05D4 \u05D4\u05E9\u05E2\u05D5\u05E2\u05D9\u05EA \u05E2\u05DD \u05E9\u05E7\u05D9",
      value: "content"
    }));
    var expected = 'ltr';
    var actual = subject.find('input').prop('dir');
    expect(actual).toBe(expected);
  });
  test('should pause spotlight when input has focus', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], null));
    subject.simulate('mouseDown');
    var expected = 'paused';
    var actual = isPaused();

    _spotlight["default"].resume();

    expect(actual).toBe(expected);
  });
  test('should resume spotlight on unmount', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], null));
    subject.simulate('mouseDown');
    subject.unmount();
    var expected = 'not paused';
    var actual = isPaused();

    _spotlight["default"].resume();

    expect(actual).toBe(expected);
  });
  test('should display invalid message if it invalid and invalid message exists', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      invalid: true,
      invalidMessage: "invalid message"
    }));
    expect(subject.find('Tooltip').prop('children')).toBe('invalid message');
  });
  test('should not display invalid message if it is valid', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      invalidMessage: "invalid message"
    }));
    expect(subject.find('Tooltip')).toHaveLength(0);
  });
  test('should set voice intent if specified', function () {
    var input = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      "data-webos-voice-intent": "Select"
    }));
    var expected = 'Select';
    var actual = input.find('input').prop('data-webos-voice-intent');
    expect(actual).toBe(expected);
  });
  test('should set voice label if specified', function () {
    var label = 'input label';
    var input = (0, _enzyme.mount)(_react["default"].createElement(_Input["default"], {
      "data-webos-voice-label": label
    }));
    var expected = label;
    var actual = input.find('input').prop('data-webos-voice-label');
    expect(actual).toBe(expected);
  });
});