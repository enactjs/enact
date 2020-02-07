"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSteppedOnce = exports.validateStepped = exports.validateRangeOnce = exports.validateRange = exports.warn = void 0;

/**
 * Exports various utilities for performing dev-time validations
 *
 * @module moonstone/internal/validators
 * @private
 */

/**
 * Issues a warning to the console
 *
 * @function
 * @param {String} msg				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @returns {undefined}
 * @memberof moonstone/internal/validators
 * @private
 */
var warn = function warn(msg) {
  if (typeof console !== 'undefined') {
    console.warn(msg); // eslint-disable-line no-console
  }
};
/**
 * Issues a warning to the console if `value` is not within the range
 * `min` to `max` or if `min` is less than `max`. In production mode,
 * no action is taken.
 *
 * @function
 * @param {Number} value The value to validate
 * @param {Number} min   The minimum acceptable value to validate
 * @param {Number} max   The maximum acceptable value to validate
 * @param {String} component The name of the invoker, used to decorate warning message
 * @param {String} [valueName='value'] The name of the value property
 * @param {String} [minName='min'] The name of the min property
 * @param {String} [maxName='max'] The name of the max property
 *
 * @returns {undefined}
 * @memberof moonstone/internal/validators
 * @private
 */


exports.warn = warn;

var validateRange = function validateRange(value, min, max, component) {
  var valueName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'value';
  var minName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'min';
  var maxName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'max';

  if (process.env.NODE_ENV !== "production") {
    var warned = false;

    if (value < min) {
      warn("Warning: ".concat(component, " ").concat(valueName, " (").concat(value, ") less than ").concat(minName, " (").concat(min, ")"));
      warned = true;
    } else if (value > max) {
      warn("Warning: ".concat(component, " ").concat(valueName, " (").concat(value, ") greater than ").concat(maxName, " (").concat(max, ")"));
      warned = true;
    }

    if (min > max) {
      warn("Warning: ".concat(component, " ").concat(minName, " (").concat(min, ") greater than ").concat(maxName, " (").concat(max, ")"));
      warned = true;
    }

    return warned;
  }
};

exports.validateRange = validateRange;

var validateRangeOnce = function validateRangeOnce(thing, _ref) {
  var component = _ref.component,
      _ref$valueName = _ref.valueName,
      valueName = _ref$valueName === void 0 ? 'value' : _ref$valueName,
      _ref$minName = _ref.minName,
      minName = _ref$minName === void 0 ? 'min' : _ref$minName,
      _ref$maxName = _ref.maxName,
      maxName = _ref$maxName === void 0 ? 'max' : _ref$maxName;

  if (process.env.NODE_ENV !== "production") {
    var displayed;
    return function (props) {
      if (!displayed) {
        displayed = validateRange(props[valueName], props[minName], props[maxName], component, valueName, minName, maxName);
      }

      return thing(props);
    };
  } else {
    return thing;
  }
};
/**
 * Issues a warning to the console if `value`, adjusted for `min` is not evenly
 * divisible by `step`. In production mode, no action is taken.
 *
 * @function
 * @param {Number} value The value to validate
 * @param {Number} min   The minimum acceptable value to validate
 * @param {Number} step  The step
 * @param {String} component The name of the invoker, used to decorate warning message
 * @param {String} [valueName='value'] The name of the value property
 * @param {String} [stepName='step'] The name of the step property
 *
 * @returns {Boolean} `true` if warned
 * @memberof moonstone/internal/validators
 * @private
 */


exports.validateRangeOnce = validateRangeOnce;

var validateStepped = function validateStepped(value, min, step, component) {
  var valueName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'value';
  var stepName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'step';

  if (process.env.NODE_ENV !== "production") {
    // Ignore fractional steps as floating point math can give inconsistent results (1 % 0.1 != 0)
    if (step && step === Math.floor(step) && (value - min) % step !== 0) {
      warn("Warning: ".concat(component, " ").concat(valueName, " (").concat(value, ") must be evenly divisible by ").concat(stepName, " (").concat(step, ")"));
      return true;
    }
  }

  return false;
};

exports.validateStepped = validateStepped;

var validateSteppedOnce = function validateSteppedOnce(thing, _ref2) {
  var component = _ref2.component,
      _ref2$minName = _ref2.minName,
      minName = _ref2$minName === void 0 ? 'min' : _ref2$minName,
      _ref2$stepName = _ref2.stepName,
      stepName = _ref2$stepName === void 0 ? 'step' : _ref2$stepName,
      _ref2$valueName = _ref2.valueName,
      valueName = _ref2$valueName === void 0 ? 'value' : _ref2$valueName;

  if (process.env.NODE_ENV !== "production") {
    var displayed;
    return function (props) {
      if (!displayed) {
        displayed = validateStepped(props[valueName], props[minName], props[stepName], component, valueName, stepName);
      }

      return thing(props);
    };
  } else {
    return thing;
  }
};

exports.validateSteppedOnce = validateSteppedOnce;