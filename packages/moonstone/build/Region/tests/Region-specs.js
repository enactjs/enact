"use strict";

var _Region = _interopRequireDefault(require("../Region"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Region', function () {
  describe('computed property', function () {
    describe('aria-label', function () {
      var ariaLabel = 'LABEL';
      var title = 'TITLE';
      test('should use aria-label when set', function () {
        var props = {
          'aria-label': ariaLabel,
          title: title
        };
        var expected = ariaLabel;

        var actual = _Region["default"].computed['aria-label'](props);

        expect(actual).toBe(expected);
      });
      test('should use title when aria-label is not set', function () {
        var props = {
          title: title
        };
        var expected = title;

        var actual = _Region["default"].computed['aria-label'](props);

        expect(actual).toBe(expected);
      });
    });
  });
});