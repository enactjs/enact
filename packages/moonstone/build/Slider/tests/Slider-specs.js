"use strict";

var _enzyme = require("enzyme");

var _react = _interopRequireDefault(require("react"));

var _Slider = _interopRequireDefault(require("../Slider"));

var _SliderModule = _interopRequireDefault(require("../Slider.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getNode = function getNode(slider) {
  return slider.find("div.".concat(_SliderModule["default"].slider));
};

var focus = function focus(slider) {
  return getNode(slider).simulate('focus');
};

var blur = function blur(slider) {
  return getNode(slider).simulate('blur');
};

var activate = function activate(slider) {
  return getNode(slider).simulate('keyup', {
    keyCode: 13
  });
};

var keyDown = function keyDown(keyCode) {
  return function (slider) {
    return getNode(slider).simulate('keydown', {
      keyCode: keyCode
    });
  };
};

var leftKeyDown = keyDown(37);
var rightKeyDown = keyDown(39);
var upKeyDown = keyDown(38);
var downKeyDown = keyDown(40);
describe('Slider', function () {
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

  test('should set "aria-valuetext" to hint string when knob is active and vertical is false', function () {
    var slider = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], null));
    slider.find('Slider').prop('onActivate')();
    slider.update();
    var expected = 'change a value with left right button';
    var actual = slider.find('Slider').prop('aria-valuetext');
    expect(actual).toBe(expected);
  });
  test('should set "aria-valuetext" to hint string when knob is active and vertical is true', function () {
    var slider = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      orientation: "vertical"
    }));
    slider.find('Slider').prop('onActivate')();
    slider.update();
    var expected = 'change a value with up down button';
    var actual = slider.find('Slider').prop('aria-valuetext');
    expect(actual).toBe(expected);
  });
  test('should set "aria-valuetext" to value when value is changed', function () {
    var slider = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      value: 10
    }));
    var expected = 10;
    var actual = slider.find('Slider').prop('aria-valuetext');
    expect(actual).toBe(expected);
  });
  test('should activate the slider on enter keyup', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], null));
    activate(subject);
    var expected = 'active';
    var actual = subject.find('Slider').prop('active') ? 'active' : 'not active';
    expect(actual).toBe(expected);
  });
  test('should deactivate the slider on blur', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], null));
    activate(subject);
    blur(subject);
    var expected = 'not active';
    var actual = subject.find('Slider').prop('active') ? 'active' : 'not active';
    expect(actual).toBe(expected);
  });
  test('should not activate the slider on enter when activateOnFocus', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      activateOnFocus: true
    }));
    activate(subject);
    var expected = 'not active';
    var actual = subject.find('Slider').prop('active') ? 'active' : 'not active';
    expect(actual).toBe(expected);
  });
  test('should decrement the value of horizontal slider on key left when active', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50
    }));
    activate(subject);
    leftKeyDown(subject);
    var expected = 49;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should decrement the value of horizontal slider on key left when activateOnFocus is true', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      activateOnFocus: true
    }));
    focus(subject);
    leftKeyDown(subject);
    var expected = 49;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should decrement the value of vertical slider on key down when active', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      orientation: "vertical"
    }));
    activate(subject);
    downKeyDown(subject);
    var expected = 49;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should decrement the value of vertical slider on key down when activateOnFocus is true', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      orientation: "vertical",
      activateOnFocus: true
    }));
    focus(subject);
    downKeyDown(subject);
    var expected = 49;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should increment the value of horizontal slider on key right when active', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50
    }));
    activate(subject);
    rightKeyDown(subject);
    var expected = 51;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should increment the value of horizontal slider on key right when activateOnFocus is true', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      activateOnFocus: true
    }));
    focus(subject);
    rightKeyDown(subject);
    var expected = 51;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should increment the value of vertical slider on key up when active', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      orientation: "vertical"
    }));
    activate(subject);
    upKeyDown(subject);
    var expected = 51;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should increment the value of vertical slider on key up when activateOnFocus is true', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      orientation: "vertical",
      activateOnFocus: true
    }));
    focus(subject);
    upKeyDown(subject);
    var expected = 51;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  }); // these tests validate behavior relating to `value` defaulting to `min`

  test('should not emit onChange when decrementing at the lower bound when value is unset', function () {
    var handleChange = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      min: 0,
      max: 10,
      onChange: handleChange
    }));
    activate(subject);
    leftKeyDown(subject);
    var expected = 'onChange not emitted';
    var actual = handleChange.mock.calls.length > 0 ? 'onChange emitted' : 'onChange not emitted';
    expect(actual).toBe(expected);
  });
  test('should increment from the lower bound when value is unset', function () {
    var handleChange = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      min: 0,
      max: 10,
      onChange: handleChange
    }));
    activate(subject);
    rightKeyDown(subject);
    var expected = 1;
    var actual = subject.find('Slider').prop('value');
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightLeft on horizontal slider at min value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 0,
      onSpotlightLeft: handleSpotlight
    }));
    focus(subject);
    leftKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightLeft on vertical slider at any value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      orientation: "vertical",
      onSpotlightLeft: handleSpotlight
    }));
    focus(subject);
    leftKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should not call onSpotlightLeft on horizontal slider at greater than min value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 1,
      onSpotlightLeft: handleSpotlight
    }));
    focus(subject);
    leftKeyDown(subject);
    var expected = 'not called';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightDown on vertical slider at min value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 0,
      orientation: "vertical",
      onSpotlightDown: handleSpotlight
    }));
    focus(subject);
    downKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightDown on horizontal slider at any value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      onSpotlightDown: handleSpotlight
    }));
    focus(subject);
    downKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should not call onSpotlightDown on vertical slider at greater than min value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 1,
      orientation: "vertical",
      onSpotlightDown: handleSpotlight
    }));
    focus(subject);
    downKeyDown(subject);
    var expected = 'not called';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightRight on horizontal slider at max value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 100,
      onSpotlightRight: handleSpotlight
    }));
    focus(subject);
    rightKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightRight on vertical slider at any value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      orientation: "vertical",
      onSpotlightRight: handleSpotlight
    }));
    focus(subject);
    rightKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should not call onSpotlightRight on horizontal slider at less than max value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 99,
      onSpotlightRight: handleSpotlight
    }));
    focus(subject);
    rightKeyDown(subject);
    var expected = 'not called';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightUp on vertical slider at max value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 100,
      max: 100,
      orientation: "vertical",
      onSpotlightUp: handleSpotlight
    }));
    focus(subject);
    upKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should call onSpotlightUp on horizontal slider at any value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 50,
      onSpotlightUp: handleSpotlight
    }));
    focus(subject);
    upKeyDown(subject);
    var expected = 'called once';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should not call onSpotlightUp on vertical slider at less than max value', function () {
    var handleSpotlight = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      defaultValue: 99,
      orientation: "vertical",
      onSpotlightUp: handleSpotlight
    }));
    focus(subject);
    upKeyDown(subject);
    var expected = 'not called';
    var actual = callCount(handleSpotlight);
    expect(actual).toBe(expected);
  });
  test('should set the tooltip to visible when focused', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      tooltip: true
    }));
    focus(subject);
    var expected = 'visible';
    var actual = subject.find('ProgressBarTooltip').prop('visible') ? 'visible' : 'not visible';
    expect(actual).toBe(expected);
  });
  test('should set the tooltip to not visible when unfocused', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Slider["default"], {
      tooltip: true
    }));
    var expected = 'not visible';
    var actual = subject.find('ProgressBarTooltip').prop('visible') ? 'visible' : 'not visible';
    expect(actual).toBe(expected);
  });
});