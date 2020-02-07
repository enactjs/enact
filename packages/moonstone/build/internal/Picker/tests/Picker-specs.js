"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Picker = _interopRequireDefault(require("../Picker"));

var _PickerItem = _interopRequireDefault(require("../PickerItem"));

var _PickerModule = _interopRequireDefault(require("../Picker.module.css"));

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

describe('Picker Specs', function () {
  test('should have a default \'value\' of 0', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 0,
      min: 0
    }));
    var expected = 0;
    var actual = picker.find('Picker').prop('value');
    expect(actual).toBe(expected);
  });
  test('should return an object {value: Number} that represents the next value of the Picker component when pressing the increment <span>', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 1,
      min: -1,
      onChange: handleChange,
      value: 0
    }));
    increment(picker);
    var expected = 1;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should return an object {value: Number} that represents the next value of the Picker component when pressing the decrement <span>', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 1,
      min: -1,
      onChange: handleChange,
      value: 0
    }));
    decrement(picker);
    var expected = -1;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should not run the onChange handler when disabled', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      disabled: true,
      index: 0,
      max: 0,
      min: 0,
      onChange: handleChange,
      value: 0
    }));
    increment(picker);
    var expected = 0;
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should wrap to the beginning of the value range if \'wrap\' is true', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 0,
      min: -1,
      onChange: handleChange,
      value: 0,
      wrap: true
    }));
    increment(picker);
    var expected = -1;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should wrap to the end of the value range if \'wrap\' is true', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 1,
      min: 0,
      onChange: handleChange,
      value: 0,
      wrap: true
    }));
    decrement(picker);
    var expected = 1;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should increment by \'step\' value', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 6,
      min: 0,
      onChange: handleChange,
      step: 3,
      value: 0
    }));
    increment(picker);
    var expected = 3;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should decrement by \'step\' value', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 3,
      min: 0,
      onChange: handleChange,
      step: 3,
      value: 3
    }));
    decrement(picker);
    var expected = 0;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should increment by \'step\' value and wrap successfully', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 3,
      min: 0,
      onChange: handleChange,
      step: 3,
      value: 3,
      wrap: true
    }));
    increment(picker);
    var expected = 0;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should decrement by \'step\' value and wrap successfully', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 9,
      min: 0,
      onChange: handleChange,
      step: 3,
      value: 0,
      wrap: true
    }));
    decrement(picker);
    var expected = 9;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should enable the increment button when there is a wrapped value to increment', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 2,
      min: 0,
      value: 2,
      wrap: true
    }));
    var expected = false;
    var actual = picker.find("PickerButton.".concat(_PickerModule["default"].incrementer)).prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should enable the decrement button when there is a wrapped value to decrement', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 2,
      min: 0,
      value: 2,
      wrap: true
    }));
    var expected = false;
    var actual = picker.find("PickerButton.".concat(_PickerModule["default"].incrementer)).prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should disable the increment button when there is no value to increment', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 2,
      min: 0,
      value: 2
    }));
    var expected = true;
    var actual = picker.find("PickerButton.".concat(_PickerModule["default"].incrementer)).prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should disable the decrement button when there is no value to decrement', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 2,
      min: 0,
      value: 0
    }));
    var expected = true;
    var actual = picker.find("PickerButton.".concat(_PickerModule["default"].decrementer)).prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should disable the increment and decrement buttons when wrapped and there is a single value', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      max: 0,
      min: 0,
      value: 0,
      wrap: true
    }));
    var expected = true;
    var actual = picker.find("PickerButton.".concat(_PickerModule["default"].decrementer)).prop('disabled') && picker.find("PickerButton.".concat(_PickerModule["default"].incrementer)).prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should allow keyboard decrement via left arrow keys when \'joined\' and \'horizontal\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      value: 0
    }));
    var expected = -1;
    picker.simulate('keyDown', {
      keyCode: 37
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should allow keyboard increment via right arrow keys when \'joined\' and \'horizontal\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      value: 0
    }));
    var expected = 1;
    picker.simulate('keyDown', {
      keyCode: 39
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should allow keyboard decrement via down arrow keys when \'joined\' and \'vertical\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      orientation: "vertical",
      value: 0
    }));
    var expected = -1;
    picker.simulate('keyDown', {
      keyCode: 40
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should allow keyboard decrement via up arrow keys when \'joined\' and \'vertical\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      orientation: "vertical",
      value: 0
    }));
    var expected = 1;
    picker.simulate('keyDown', {
      keyCode: 38
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should not allow keyboard decrement via left arrow keys when \'joined\' and \'vertical\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      orientation: "vertical",
      value: 0
    }));
    var expected = 0;
    picker.simulate('keyDown', {
      keyCode: 37
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should not allow keyboard increment via right arrow keys when \'joined\' and \'vertical\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      orientation: "vertical",
      value: 0
    }));
    var expected = 0;
    picker.simulate('keyDown', {
      keyCode: 39
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should not allow keyboard decrement via down arrow keys when \'joined\' and \'horizontal\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      orientation: "horizontal",
      value: 0
    }));
    var expected = 0;
    picker.simulate('keyDown', {
      keyCode: 40
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should not allow keyboard increment via up arrow keys when \'joined\' and \'horizontal\'', function () {
    var handleChange = jest.fn();
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
      index: 0,
      joined: true,
      max: 1,
      min: -1,
      onChange: handleChange,
      orientation: "horizontal",
      value: 0
    }));
    var expected = 0;
    picker.simulate('keyDown', {
      keyCode: 38
    });
    picker.simulate('mousedown');
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  describe('accessibility', function () {
    test('should set the aria-label attribute properly in the next icon button', function () {
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        index: 1,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      var expected = '2 next item';
      var actual = picker.find("PickerButton.".concat(_PickerModule["default"].incrementer)).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set the aria-label attribute properly in the previous icon button', function () {
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        index: 1,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      var expected = '2 previous item';
      var actual = picker.find("PickerButton.".concat(_PickerModule["default"].decrementer)).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set the aria-valuetext attribute properly to read it when changing the value', function () {
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        index: 1,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      var expected = '2';
      var actual = picker.find(".".concat(_PickerModule["default"].valueWrapper)).prop('aria-valuetext');
      expect(actual).toBe(expected);
    });
    test('should have aria-hidden=true when \'joined\' and not active', function () {
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        index: 1,
        joined: true,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      var expected = true;
      var actual = picker.find(".".concat(_PickerModule["default"].valueWrapper)).prop('aria-hidden');
      expect(actual).toBe(expected);
    });
    test('should be aria-hidden=false when \'joined\' and active', function () {
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        index: 1,
        joined: true,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      picker.simulate('focus');
      var expected = false;
      var actual = picker.find(".".concat(_PickerModule["default"].valueWrapper)).prop('aria-hidden');
      expect(actual).toBe(expected);
    });
    test('should set picker "decrementAriaLabel" to decrement button', function () {
      var label = 'custom decrement aria-label';
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        decrementAriaLabel: label,
        index: 1,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      var expected = label;
      var actual = picker.find("PickerButton.".concat(_PickerModule["default"].decrementer)).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set picker "incrementAriaLabel" to decrement button', function () {
      var label = 'custom increment aria-label';
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        incrementAriaLabel: label,
        index: 1,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      var expected = label;
      var actual = picker.find("PickerButton.".concat(_PickerModule["default"].incrementer)).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set "aria-label" to joined picker', function () {
      var label = 'custom joined picker aria-label';
      var picker = (0, _enzyme.mount)(_react["default"].createElement(_Picker["default"], {
        "aria-label": label,
        index: 1,
        joined: true,
        max: 3,
        min: 0,
        value: 1
      }, _react["default"].createElement(_PickerItem["default"], null, "1"), _react["default"].createElement(_PickerItem["default"], null, "2"), _react["default"].createElement(_PickerItem["default"], null, "3"), _react["default"].createElement(_PickerItem["default"], null, "4")));
      var expected = label;
      var actual = picker.find(".".concat(_PickerModule["default"].valueWrapper)).parent().prop('aria-label');
      expect(actual).toBe(expected);
    });
  });
});