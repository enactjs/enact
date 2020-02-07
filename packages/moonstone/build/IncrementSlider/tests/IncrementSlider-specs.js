"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _IncrementSlider = _interopRequireDefault(require("../IncrementSlider"));

var _IncrementSliderModule = _interopRequireDefault(require("../IncrementSlider.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tap = function tap(node) {
  node.simulate('mousedown');
  node.simulate('mouseup');
};

var decrement = function decrement(slider) {
  return tap(slider.find('IconButton').first());
};

var increment = function increment(slider) {
  return tap(slider.find('IconButton').last());
};

var keyDown = function keyDown(keyCode) {
  return function (node) {
    return node.simulate('keydown', {
      keyCode: keyCode
    });
  };
};

var leftKeyDown = keyDown(37);
var rightKeyDown = keyDown(39);
var upKeyDown = keyDown(38);
var downKeyDown = keyDown(40);

var callCount = function callCount(spy) {
  switch (spy.mock.calls.length) {
    case 0:
      return 'not called';

    case 1:
      return 'called once';

    default:
      return "called ".concat(spy.mock.calls.length, " times");
  }
};

describe('IncrementSlider Specs', function () {
  test('should decrement value', function () {
    var handleChange = jest.fn();
    var value = 50;
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onChange: handleChange,
      value: value
    }));
    decrement(incrementSlider);
    var expected = value - 1;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should increment value', function () {
    var handleChange = jest.fn();
    var value = 50;
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onChange: handleChange,
      value: value
    }));
    increment(incrementSlider);
    var expected = value + 1;
    var actual = handleChange.mock.calls[0][0].value;
    expect(actual).toBe(expected);
  });
  test('should only call onChange once', function () {
    var handleChange = jest.fn();
    var value = 50;
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onChange: handleChange,
      value: value
    }));
    increment(incrementSlider);
    var expected = 1;
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should not call onChange on prop change', function () {
    var handleChange = jest.fn();
    var value = 50;
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onChange: handleChange,
      value: value
    }));
    incrementSlider.setProps({
      onChange: handleChange,
      value: value + 1
    });
    var expected = 0;
    var actual = handleChange.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should disable decrement button when value === min', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      value: 0,
      min: 0
    }));
    var expected = true;
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)).prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should disable increment button when value === max', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      value: 10,
      max: 10
    }));
    var expected = true;
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)).prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should use custom incrementIcon', function () {
    var icon = 'plus';
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      incrementIcon: icon
    }));
    var expected = icon;
    var actual = incrementSlider.find(".".concat(_IncrementSliderModule["default"].incrementButton, " Icon")).prop('children');
    expect(actual).toBe(expected);
  });
  test('should use custom decrementIcon', function () {
    var icon = 'minus';
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      decrementIcon: icon
    }));
    var expected = icon;
    var actual = incrementSlider.find(".".concat(_IncrementSliderModule["default"].decrementButton, " Icon")).prop('children');
    expect(actual).toBe(expected);
  });
  test('should set decrementButton "aria-label" to value and hint string', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      value: 10
    }));
    var expected = '10 press ok button to decrease the value';
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)).prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set decrementButton "aria-label" to decrementAriaLabel', function () {
    var label = 'decrement aria label';
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      value: 10,
      decrementAriaLabel: label
    }));
    var expected = "10 ".concat(label);
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)).prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set decrementButton "aria-label" when decrementButton is disabled', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      disabled: true,
      value: 10
    }));
    var expected = '10 press ok button to decrease the value';
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)).prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set incrementButton "aria-label" to value and hint string', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      value: 10
    }));
    var expected = '10 press ok button to increase the value';
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)).prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set incrementButton "aria-label" to incrementAriaLabel', function () {
    var label = 'increment aria label';
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      value: 10,
      incrementAriaLabel: label
    }));
    var expected = "10 ".concat(label);
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)).prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set incrementButton "aria-label" when incrementButton is disabled', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      disabled: true,
      value: 10
    }));
    var expected = '10 press ok button to increase the value';
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)).prop('aria-label');
    expect(actual).toBe(expected);
  }); // test directional events from IncrementSliderButtons

  test('should call onSpotlightLeft from the decrement button of horizontal IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onSpotlightLeft: handleSpotlight
    }));
    leftKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightLeft from the decrement button of vertical IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      orientation: "vertical",
      onSpotlightLeft: handleSpotlight
    }));
    leftKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightLeft from the increment button of vertical IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      orientation: "vertical",
      onSpotlightLeft: handleSpotlight
    }));
    leftKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightRight from the increment button of horizontal IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onSpotlightRight: handleSpotlight
    }));
    rightKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightRight from the increment button of vertical IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      orientation: "vertical",
      onSpotlightRight: handleSpotlight
    }));
    rightKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightRight from the decrement button of vertical IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      orientation: "vertical",
      onSpotlightRight: handleSpotlight
    }));
    rightKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightUp from the decrement button of horizontal IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onSpotlightUp: handleSpotlight
    }));
    upKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightUp from the increment button of horizontal IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onSpotlightUp: handleSpotlight
    }));
    upKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightUp from the increment button of vertical IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      orientation: "vertical",
      onSpotlightUp: handleSpotlight
    }));
    upKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightDown from the increment button of horizontal IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      onSpotlightDown: handleSpotlight
    }));
    downKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightDown from the decrement button of horizontal IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      orientation: "vertical",
      onSpotlightDown: handleSpotlight
    }));
    downKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightDown from the decrement button of vertical IncrementSlider', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      orientation: "vertical",
      onSpotlightDown: handleSpotlight
    }));
    downKeyDown(incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  }); // test directional events at bounds of slider

  test('should call onSpotlightLeft from slider of horizontal IncrementSlider when value is at min', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      min: 0,
      value: 0,
      onSpotlightLeft: handleSpotlight
    }));
    leftKeyDown(incrementSlider.find("Slider.".concat(_IncrementSliderModule["default"].slider)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightRight from slider of horizontal IncrementSlider when value is at max', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      max: 100,
      value: 100,
      onSpotlightRight: handleSpotlight
    }));
    rightKeyDown(incrementSlider.find("Slider.".concat(_IncrementSliderModule["default"].slider)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightDown from slider of vertical IncrementSlider when value is at min', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      min: 0,
      value: 0,
      orientation: "vertical",
      onSpotlightDown: handleSpotlight
    }));
    downKeyDown(incrementSlider.find("Slider.".concat(_IncrementSliderModule["default"].slider)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightUp from slider of horizontal IncrementSlider when value is at max', function () {
    var handleSpotlight = jest.fn();
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      max: 100,
      value: 100,
      orientation: "vertical",
      onSpotlightUp: handleSpotlight
    }));
    upKeyDown(incrementSlider.find("Slider.".concat(_IncrementSliderModule["default"].slider)));
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to increment button when voice control is disabled', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      "data-webos-voice-disabled": true,
      value: 10
    }));
    var expected = true;
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)).prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to decrement button when voice control is disabled', function () {
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      "data-webos-voice-disabled": true,
      value: 10
    }));
    var expected = true;
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)).prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-group-label" to increment button when voice group label is set', function () {
    var label = 'voice control group label';
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      "data-webos-voice-group-label": label,
      value: 10
    }));
    var expected = label;
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].incrementButton)).prop('data-webos-voice-group-label');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-group-label" to decrement button when voice group label is set', function () {
    var label = 'voice control group label';
    var incrementSlider = (0, _enzyme.mount)(_react["default"].createElement(_IncrementSlider["default"], {
      "data-webos-voice-group-label": label,
      value: 10
    }));
    var expected = label;
    var actual = incrementSlider.find("IconButton.".concat(_IncrementSliderModule["default"].decrementButton)).prop('data-webos-voice-group-label');
    expect(actual).toBe(expected);
  });
});