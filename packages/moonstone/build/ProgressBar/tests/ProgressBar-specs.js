"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ProgressBar = _interopRequireDefault(require("../ProgressBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('ProgressBar Specs', function () {
  test('should only show tooltip when tooltip is true', function () {
    var progressBar = (0, _enzyme.mount)(_react["default"].createElement(_ProgressBar["default"], {
      tooltip: true
    }));
    var expected = 1;
    var actual = progressBar.find('ProgressBarTooltip').length;
    expect(actual).toBe(expected);
  });
  test('should have tooltip show progress as percentage', function () {
    var progressBar = (0, _enzyme.mount)(_react["default"].createElement(_ProgressBar["default"], {
      tooltip: true,
      progress: 0.6
    }));
    var expected = '60%';
    var actual = progressBar.find('ProgressBarTooltip').text();
    expect(actual).toBe(expected);
  });
});