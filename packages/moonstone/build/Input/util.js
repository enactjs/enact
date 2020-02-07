"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractInputProps = exports.calcAriaLabel = void 0;

var _$L = _interopRequireDefault(require("../internal/$L"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Determines the `aria-label` for an Input
 *
 * @method
 * @memberof moonstone/Input
 * @param   {String}  prefix   Text to precede the value in the aria-label
 * @param   {String}  type     `type` of the Input
 * @param   {String}  [value]  Current value of the input
 * @returns {String}           `aria-label` value
 * @private
 */
var calcAriaLabel = function calcAriaLabel(prefix, type) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var hint = (0, _$L["default"])('Input field');

  if (type === 'password' && value) {
    var character = value.length > 1 ? (0, _$L["default"])('characters') : (0, _$L["default"])('character');
    value = "".concat(value.length, " ").concat(character);
  }

  return "".concat(prefix, " ").concat(value, " ").concat(hint);
};
/**
 * Removes `<input>` related props from `props` and returns them in a new object.
 *
 * Useful when redirecting `<input>` related props from a non-input root element to the `<input>`
 * element.
 *
 * @method
 * @memberof moonstone/Input
 * @param   {Object} props  Props object
 * @returns {Object}        input related props
 * @private
 */


exports.calcAriaLabel = calcAriaLabel;

var extractInputProps = function extractInputProps(props) {
  var inputProps = {};
  Object.keys(props).forEach(function (key) {
    switch (key) {
      case 'autoComplete':
      case 'list':
      case 'maxLength':
      case 'minLength':
      case 'pattern':
      case 'required':
      case 'size':
        inputProps[key] = props[key];
        delete props[key];
    }
  });
  return inputProps;
};

exports.extractInputProps = extractInputProps;