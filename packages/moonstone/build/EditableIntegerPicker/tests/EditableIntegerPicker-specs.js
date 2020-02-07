"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _EditableIntegerPicker = require("../EditableIntegerPicker");

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isPaused = function isPaused() {
  return _spotlight["default"].isPaused() ? 'paused' : 'not paused';
};

var tap = function tap(node) {
  node.simulate('mousedown');
  node.simulate('mouseup');
};

var decrement = function decrement(slider) {
  return tap(slider.find('Icon').last());
};

var increment = function increment(slider) {
  return tap(slider.find('Icon').first());
};

describe('EditableIntegerPicker', function () {
  test('should render a single child with the current value', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1
    }));
    var expected = 10;
    var actual = parseInt(picker.find('PickerItem').text());
    expect(actual).toBe(expected);
  });
  test('should increase by step amount on increment press', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 10,
      noAnimation: true
    }));
    increment(picker);
    var expected = 20;
    var actual = parseInt(picker.find('PickerItem').first().text());
    expect(actual).toBe(expected);
  });
  test('should decrease by step amount on decrement press', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 10,
      noAnimation: true
    }));
    decrement(picker);
    var expected = 0;
    var actual = parseInt(picker.find('PickerItem').first().text());
    expect(actual).toBe(expected);
  });
  test('should enable input field on click', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1
    }));
    picker.find('PickerItem').simulate('click', {
      target: {
        type: 'click'
      }
    });
    var expected = 1;
    var actual = picker.find('input').length;
    expect(actual).toBe(expected);
  });
  test('should disable input when blurred', function () {
    var node = document.body.appendChild(document.createElement('div'));
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1
    }), {
      attachTo: node
    });
    picker.find('PickerItem').simulate('click', {
      target: {
        type: 'click'
      }
    });
    var input = node.querySelector('input');
    input.focus();
    input.blur();
    picker.update();
    var expected = 0;
    var actual = picker.find('input').length;
    node.parentNode.removeChild(node);
    expect(actual).toBe(expected);
  });
  test('should take value inputted and navigate to the value on blur', function () {
    var node = document.body.appendChild(document.createElement('div'));
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1,
      noAnimation: true
    }), {
      attachTo: node
    });
    picker.find('PickerItem').simulate('click', {
      target: {
        type: 'click'
      }
    });
    var input = node.querySelector('input');
    picker.find('input').simulate('focus');
    input.value = 38;
    input.blur();
    picker.update();
    var expected = 38;
    var actual = parseInt(picker.find('PickerItem').first().text());
    node.parentNode.removeChild(node);
    expect(actual).toBe(expected);
  });
  test('should enable input field when some number is typed on the picker', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1
    }));
    picker.simulate('keyDown', {
      keyCode: 50
    });
    var expected = 1;
    var actual = picker.find('input').length;
    expect(actual).toBe(expected);
  });
  test('should pause the spotlight when input is focused', function () {
    var node = document.body.appendChild(document.createElement('div'));
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1
    }), {
      attachTo: node
    });
    picker.simulate('keyDown', {
      keyCode: 50
    });
    var input = node.querySelector('input');
    input.focus();
    var expected = 'paused';
    var actual = isPaused();

    _spotlight["default"].resume();

    node.parentNode.removeChild(node);
    expect(actual).toBe(expected);
  });
  test('should resume the spotlight when input is blurred', function () {
    var node = document.body.appendChild(document.createElement('div'));
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPicker, {
      min: 0,
      max: 100,
      defaultValue: 10,
      step: 1
    }), {
      attachTo: node
    });
    picker.find('PickerItem').simulate('click', {
      target: {
        type: 'click'
      }
    });
    var input = node.querySelector('input');
    input.focus();
    input.blur();
    var expected = 'not paused';
    var actual = isPaused();
    node.parentNode.removeChild(node);
    expect(actual).toBe(expected);
  });
  test('should be disabled when limited to a single value', function () {
    var picker = (0, _enzyme.mount)(_react["default"].createElement(_EditableIntegerPicker.EditableIntegerPickerBase, {
      min: 0,
      max: 0,
      value: 0
    }));
    var actual = picker.find('Picker').last().prop('disabled');
    expect(actual).toBe(true);
  });
});