"use strict";

var _react = _interopRequireDefault(require("react"));

var _FloatingLayer = require("@enact/ui/FloatingLayer");

var _enzyme = require("enzyme");

var _Popup = require("../Popup");

var _PopupModule = _interopRequireDefault(require("../Popup.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FloatingLayerController = (0, _FloatingLayer.FloatingLayerDecorator)('div');
describe('Popup specs', function () {
  test('should be rendered opened if open is set to true', function () {
    var popup = (0, _enzyme.mount)(_react["default"].createElement(FloatingLayerController, null, _react["default"].createElement(_Popup.Popup, {
      open: true
    }, _react["default"].createElement("div", null, "popup"))));
    var expected = true;
    var actual = popup.find('FloatingLayer').prop('open');
    expect(actual).toBe(expected);
  });
  test('should not be rendered if open is set to false', function () {
    var popup = (0, _enzyme.mount)(_react["default"].createElement(FloatingLayerController, null, _react["default"].createElement(_Popup.Popup, null, _react["default"].createElement("div", null, "popup"))));
    var expected = false;
    var actual = popup.find('FloatingLayer').prop('open');
    expect(actual).toBe(expected);
  });
  test('should set popup close button "aria-label" to closeButtonAriaLabel', function () {
    var label = 'custom close button label';
    var popup = (0, _enzyme.shallow)(_react["default"].createElement(_Popup.PopupBase, {
      showCloseButton: true,
      closeButtonAriaLabel: label
    }, _react["default"].createElement("div", null, "popup")));
    var expected = label;
    var actual = popup.find(".".concat(_PopupModule["default"].closeButton)).prop('aria-label');
    expect(actual).toBe(expected);
  });
  test('should set role to alert by default', function () {
    var popup = (0, _enzyme.shallow)(_react["default"].createElement(_Popup.PopupBase, null, _react["default"].createElement("div", null, "popup")));
    var expected = 'alert';
    var actual = popup.find(".".concat(_PopupModule["default"].popup)).prop('role');
    expect(actual).toBe(expected);
  });
  test('should allow role to be overridden', function () {
    var popup = (0, _enzyme.shallow)(_react["default"].createElement(_Popup.PopupBase, {
      role: "dialog"
    }, _react["default"].createElement("div", null, "popup")));
    var expected = 'dialog';
    var actual = popup.find(".".concat(_PopupModule["default"].popup)).prop('role');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-exclusive" when popup is open', function () {
    var popup = (0, _enzyme.mount)(_react["default"].createElement(FloatingLayerController, null, _react["default"].createElement(_Popup.Popup, {
      open: true
    }, _react["default"].createElement("div", null, "popup"))));
    var expected = true;
    var actual = popup.find(".".concat(_PopupModule["default"].popup)).first().prop('data-webos-voice-exclusive');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" when voice control is disabled', function () {
    var popup = (0, _enzyme.shallow)(_react["default"].createElement(_Popup.PopupBase, {
      open: true,
      "data-webos-voice-disabled": true
    }, _react["default"].createElement("div", null, "popup")));
    var expected = true;
    var actual = popup.find(".".concat(_PopupModule["default"].popup)).prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
});