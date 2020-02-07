"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractVoiceProps = void 0;

/**
 * Removes voice control related props from `props` and returns them in a new object.
 *
 * @function
 * @param   {Object}    props    Props object
 *
 * @returns {Object}             voice control related props
 * @memberof moonstone/internal/util
 * @private
 */
var extractVoiceProps = function extractVoiceProps(props) {
  var obj = {};
  Object.keys(props).forEach(function (key) {
    if (key.indexOf('data-webos-voice-') === 0) {
      obj[key] = props[key];
      delete props[key];
    }
  });
  return obj;
};

exports.extractVoiceProps = extractVoiceProps;