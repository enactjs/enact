"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDeferChildren = useDeferChildren;
exports["default"] = void 0;

var _util = require("@enact/core/util");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useJob(callback, timeout) {
  var _React$useState = _react["default"].useState({}),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      state = _React$useState2[0];

  state.job = state.job || new _util.Job(callback, timeout);

  _react["default"].useEffect(function () {
    return function () {
      return state.job.stop();
    };
  });

  return state.job;
}

function useDeferChildren(hidden) {
  var _React$useState3 = _react["default"].useState(hidden),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      hideChildren = _React$useState4[0],
      setState = _React$useState4[1];

  var hide = function hide() {
    return setState(false);
  };

  var job = useJob(hide);
  return {
    hideChildren: hideChildren,
    onBlur: function onBlur() {
      return job.stop();
    },
    onFocus: function onFocus() {
      return hideChildren && job.idle();
    }
  };
}

var _default = useDeferChildren;
exports["default"] = _default;