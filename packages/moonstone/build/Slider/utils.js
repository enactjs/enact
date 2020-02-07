"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleIncrement = exports.handleDecrement = exports.emitChange = exports.forwardSpotlightEvents = void 0;

var _handle = require("@enact/core/handle");

var _keymap = require("@enact/core/keymap");

var _util = require("@enact/core/util");

var _utils = require("@enact/ui/Slider/utils");

var calcStep = function calcStep(knobStep, step) {
  var s;

  if (knobStep != null) {
    s = knobStep;
  } else if (step != null) {
    s = step;
  } // default to a step of 1 if neither are set or are set to 0
  // otherwise, increment/decrement would be no-ops


  return s || 1;
};

var isIncrement = function isIncrement(_ref, _ref2) {
  var keyCode = _ref.keyCode;
  var orientation = _ref2.orientation;
  return orientation === 'vertical' ? (0, _keymap.is)('up', keyCode) : (0, _keymap.is)('right', keyCode);
};

var isDecrement = function isDecrement(_ref3, _ref4) {
  var keyCode = _ref3.keyCode;
  var orientation = _ref4.orientation;
  return orientation === 'vertical' ? (0, _keymap.is)('down', keyCode) : (0, _keymap.is)('left', keyCode);
};

var isNotMax = function isNotMax(ev, _ref5) {
  var value = _ref5.value,
      max = _ref5.max;
  return value !== max;
};

var isNotMin = function isNotMin(ev, _ref6) {
  var min = _ref6.min,
      _ref6$value = _ref6.value,
      value = _ref6$value === void 0 ? min : _ref6$value;
  return value !== min;
};

var emitChange = function emitChange(direction) {
  return (0, _handle.adaptEvent)(function (ev, _ref7) {
    var knobStep = _ref7.knobStep,
        max = _ref7.max,
        min = _ref7.min,
        step = _ref7.step,
        _ref7$value = _ref7.value,
        value = _ref7$value === void 0 ? min : _ref7$value;
    var newValue = (0, _util.clamp)(min, max, value + calcStep(knobStep, step) * direction);
    return {
      value: newValue,
      proportion: (0, _utils.calcProportion)(min, max, newValue),
      type: 'onChange'
    };
  }, (0, _handle.forward)('onChange'));
};

exports.emitChange = emitChange;

var isActive = function isActive(ev, props) {
  return props.active || props.activateOnFocus;
};

var handleIncrement = (0, _handle.handle)(isActive, isIncrement, _handle.preventDefault, _handle.stop, isNotMax, emitChange(1));
exports.handleIncrement = handleIncrement;
var handleDecrement = (0, _handle.handle)(isActive, isDecrement, _handle.preventDefault, _handle.stop, isNotMin, emitChange(-1));
exports.handleDecrement = handleDecrement;

var either = function either(a, b) {
  return function () {
    return a.apply(void 0, arguments) || b.apply(void 0, arguments);
  };
};

var atMinimum = function atMinimum(ev, _ref8) {
  var min = _ref8.min,
      _ref8$value = _ref8.value,
      value = _ref8$value === void 0 ? min : _ref8$value;
  return value <= min;
};

var atMaximum = function atMaximum(ev, _ref9) {
  var max = _ref9.max,
      min = _ref9.min,
      _ref9$value = _ref9.value,
      value = _ref9$value === void 0 ? min : _ref9$value;
  return value >= max;
};

var forwardOnlyType = function forwardOnlyType(type) {
  return (0, _handle.adaptEvent)(function () {
    return {
      type: type
    };
  }, (0, _handle.forward)(type));
};

var forwardSpotlightEvents = (0, _handle.oneOf)([(0, _handle.forKey)('left'), (0, _handle.handle)(either((0, _handle.forProp)('orientation', 'vertical'), atMinimum), forwardOnlyType('onSpotlightLeft'))], [(0, _handle.forKey)('right'), (0, _handle.handle)(either((0, _handle.forProp)('orientation', 'vertical'), atMaximum), forwardOnlyType('onSpotlightRight'))], [(0, _handle.forKey)('down'), (0, _handle.handle)(either((0, _handle.forProp)('orientation', 'horizontal'), atMinimum), forwardOnlyType('onSpotlightDown'))], [(0, _handle.forKey)('up'), (0, _handle.handle)(either((0, _handle.forProp)('orientation', 'horizontal'), atMaximum), forwardOnlyType('onSpotlightUp'))]);
exports.forwardSpotlightEvents = forwardSpotlightEvents;