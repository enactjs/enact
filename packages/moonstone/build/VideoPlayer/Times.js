"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimesBase = exports.Times = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("./util");

var _VideoPlayerModule = _interopRequireDefault(require("./VideoPlayer.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Times {@link moonstone/VideoPlayer}.
 *
 * @class Times
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var TimesBase = (0, _kind["default"])({
  name: 'Times',
  propTypes:
  /** @lends moonstone/VideoPlayer.Times.prototype */
  {
    /**
     * An instance of a Duration Formatter from i18n. {@link i18n/ilib/lib/DurationFmt.DurationFmt}
     *
     * @type {Object}
     * @required
     * @public
     */
    formatter: _propTypes["default"].object.isRequired,

    /**
     * The current time in seconds of the video source.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    current: _propTypes["default"].number,

    /**
     * The total time (duration) in seconds of the loaded video source.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    total: _propTypes["default"].number
  },
  defaultProps: {
    current: 0,
    total: 0
  },
  styles: {
    css: _VideoPlayerModule["default"],
    className: 'times'
  },
  computed: {
    currentPeriod: function currentPeriod(_ref) {
      var current = _ref.current;
      return (0, _util.secondsToPeriod)(current);
    },
    currentReadable: function currentReadable(_ref2) {
      var current = _ref2.current,
          formatter = _ref2.formatter;
      return (0, _util.secondsToTime)(current, formatter);
    },
    totalPeriod: function totalPeriod(_ref3) {
      var total = _ref3.total;
      return (0, _util.secondsToPeriod)(total);
    },
    totalReadable: function totalReadable(_ref4) {
      var total = _ref4.total,
          formatter = _ref4.formatter;
      return (0, _util.secondsToTime)(total, formatter);
    }
  },
  render: function render(_ref5) {
    var currentPeriod = _ref5.currentPeriod,
        currentReadable = _ref5.currentReadable,
        totalPeriod = _ref5.totalPeriod,
        totalReadable = _ref5.totalReadable,
        rest = _objectWithoutProperties(_ref5, ["currentPeriod", "currentReadable", "totalPeriod", "totalReadable"]);

    delete rest.current;
    delete rest.formatter;
    delete rest.total;
    return _react["default"].createElement("div", rest, _react["default"].createElement("time", {
      className: _VideoPlayerModule["default"].currentTime,
      dateTime: currentPeriod
    }, currentReadable), _react["default"].createElement("span", {
      className: _VideoPlayerModule["default"].separator
    }, "/"), _react["default"].createElement("time", {
      className: _VideoPlayerModule["default"].totalTime,
      dateTime: totalPeriod
    }, totalReadable));
  }
});
exports.TimesBase = TimesBase;
var Times = (0, _onlyUpdateForKeys["default"])(['current', 'formatter', 'total'])(TimesBase);
exports.Times = Times;
var _default = Times;
exports["default"] = _default;