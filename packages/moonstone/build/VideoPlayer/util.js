"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.secondsToTime = exports.secondsToPeriod = exports.parseTime = exports.countReactChildren = exports.calcNumberValueOfPlaybackRate = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// VideoPlayer utils.js
//

/**
 * Create a time object (hour, minute, second) from an amount of seconds
 *
 * @param  {Number|String} value A duration of time represented in seconds
 *
 * @returns {Object}       An object with keys {hour, minute, second} representing the duration
 *                        seconds provided as an argument.
 * @private
 */
var parseTime = function parseTime(value) {
  value = parseFloat(value);
  var time = {};
  var hour = Math.floor(value / (60 * 60));
  time.minute = Math.floor(value / 60 % 60);
  time.second = Math.floor(value % 60);

  if (hour) {
    time.hour = hour;
  }

  return time;
};
/**
 * Generate a time usable by <time datetime />
 *
 * @param  {Number|String} seconds A duration of time represented in seconds
 *
 * @returns {String}      String formatted for use in a `datetime` field of a `<time>` tag.
 * @private
 */


exports.parseTime = parseTime;

var secondsToPeriod = function secondsToPeriod(seconds) {
  return 'P' + seconds + 'S';
};
/**
 * Make a human-readable time
 *
 * @param  {Number|String} seconds A duration of time represented in seconds
 * @param {DurationFmt} durfmt An instance of a {@link i18n/ilib/lib/DurationFmt.DurationFmt} object
 *                             from iLib confugured to display time used by the {@Link VideoPlayer}
 *                             component.
 * @param  {Object} config Additional configuration object that includes `includeHour`.
 *
 * @returns {String}      Formatted duration string
 * @private
 */


exports.secondsToPeriod = secondsToPeriod;

var secondsToTime = function secondsToTime(seconds, durfmt, config) {
  var includeHour = config && config.includeHour;

  if (durfmt) {
    var parsedTime = parseTime(seconds);
    var timeString = durfmt.format(parsedTime).toString();

    if (includeHour && !parsedTime.hour) {
      return '00:' + timeString;
    } else {
      return timeString;
    }
  }

  return includeHour ? '00:00:00' : '00:00';
};
/**
 * Calculates numeric value of playback rate (with support for fractions).
 *
 * @private
 */


exports.secondsToTime = secondsToTime;

var calcNumberValueOfPlaybackRate = function calcNumberValueOfPlaybackRate(rate) {
  var pbArray = String(rate).split('/');
  return pbArray.length > 1 ? parseInt(pbArray[0]) / parseInt(pbArray[1]) : parseInt(rate);
};
/**
 * Safely count the children nodes and exclude null & undefined values for an accurate count of
 * real children
 *
 * @param {component} children React.Component or React.PureComponent
 * @returns {Number} Number of children nodes
 * @private
 */


exports.calcNumberValueOfPlaybackRate = calcNumberValueOfPlaybackRate;

var countReactChildren = function countReactChildren(children) {
  return _react["default"].Children.toArray(children).filter(function (n) {
    return n != null;
  }).length;
};

exports.countReactChildren = countReactChildren;