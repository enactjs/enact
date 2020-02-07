"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Spinner = _interopRequireDefault(require("../Spinner"));

var _SpinnerModule = _interopRequireDefault(require("../Spinner.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Spinner Specs', function () {
  test('should not have client node when Spinner has no children', function () {
    var spinner = (0, _enzyme.mount)(_react["default"].createElement(_Spinner["default"], null));
    var expected = false;
    var actual = spinner.find("div.".concat(_SpinnerModule["default"].client)).exists();
    expect(actual).toBe(expected);
  });
  test('should have a client node when Spinner has children', function () {
    var spinner = (0, _enzyme.mount)(_react["default"].createElement(_Spinner["default"], null, "Loading..."));
    var expected = true;
    var actual = spinner.find("div.".concat(_SpinnerModule["default"].client)).exists();
    expect(actual).toBe(expected);
  });
  test('should have content class when Spinner has children', function () {
    var spinner = (0, _enzyme.mount)(_react["default"].createElement(_Spinner["default"], null, "Loading..."));
    var expected = true;
    var actual = spinner.find("div.".concat(_SpinnerModule["default"].spinner)).hasClass(_SpinnerModule["default"].content);
    expect(actual).toBe(expected);
  });
  test('should have transparent class when transparent prop equals true', function () {
    var spinner = (0, _enzyme.mount)(_react["default"].createElement(_Spinner["default"], {
      transparent: true
    }, "Loading..."));
    var expected = true;
    var actual = spinner.find("div.".concat(_SpinnerModule["default"].spinner)).hasClass(_SpinnerModule["default"].transparent);
    expect(actual).toBe(expected);
  });
  test('should set role to alert by default', function () {
    var spinner = (0, _enzyme.mount)(_react["default"].createElement(_Spinner["default"], null));
    var expected = 'alert';
    var actual = spinner.find("div.".concat(_SpinnerModule["default"].spinner)).prop('role');
    expect(actual).toBe(expected);
  });
  test('should set aria-live to off by default', function () {
    var spinner = (0, _enzyme.mount)(_react["default"].createElement(_Spinner["default"], null));
    var expected = 'off';
    var actual = spinner.find("div.".concat(_SpinnerModule["default"].spinner)).prop('aria-live');
    expect(actual).toBe(expected);
  });
});