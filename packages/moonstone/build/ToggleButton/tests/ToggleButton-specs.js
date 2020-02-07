"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ToggleButton = _interopRequireDefault(require("../ToggleButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('ToggleButton', function () {
  var toggleOnLabel = 'It\'s on!';
  var toggleOffLabel = 'It\'s off!';
  var textChild = 'Toggle Me';
  test('should use \'toggleOffLabel\' if toggled off and label provided', function () {
    var toggleButton = (0, _enzyme.mount)(_react["default"].createElement(_ToggleButton["default"], {
      toggleOffLabel: toggleOffLabel
    }, textChild));
    var button = toggleButton.find('Button');
    var expected = toggleOffLabel;
    var actual = button.text();
    expect(actual).toBe(expected);
  });
  test('should use \'toggleOnLabel\' if toggled on and label provided', function () {
    var toggleButton = (0, _enzyme.mount)(_react["default"].createElement(_ToggleButton["default"], {
      toggleOnLabel: toggleOnLabel,
      selected: true
    }, textChild));
    var button = toggleButton.find('Button');
    var expected = toggleOnLabel;
    var actual = button.text();
    expect(actual).toBe(expected);
  });
  test('should use child node for label when \'toggleOffLabel\' is missing', function () {
    var toggleButton = (0, _enzyme.mount)(_react["default"].createElement(_ToggleButton["default"], {
      toggleOnLabel: toggleOnLabel
    }, textChild));
    var button = toggleButton.find('Button');
    var expected = textChild;
    var actual = button.text();
    expect(actual).toBe(expected);
  });
  test('should use child node for label when \'toggleOnLabel\' is missing', function () {
    var toggleButton = (0, _enzyme.mount)(_react["default"].createElement(_ToggleButton["default"], {
      toggleOffLabel: toggleOffLabel,
      selected: true
    }, textChild));
    var button = toggleButton.find('Button');
    var expected = textChild;
    var actual = button.text();
    expect(actual).toBe(expected);
  });
  test('should set "aria-pressed" to the value of "selected"', function () {
    var toggleButton = (0, _enzyme.mount)(_react["default"].createElement(_ToggleButton["default"], {
      toggleOffLabel: toggleOffLabel,
      selected: false
    }, textChild));
    var expected = false;
    var actual = toggleButton.find({
      role: 'button'
    }).prop('aria-pressed');
    expect(actual).toBe(expected);
  });
});