"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _BodyText = _interopRequireDefault(require("../BodyText"));

var _BodyTextModule = _interopRequireDefault(require("../BodyText.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('BodyText Specs', function () {
  test('should support multi-line content', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_BodyText["default"], null));
    var expected = 1;
    var actual = subject.find('p').length;
    expect(actual).toBe(expected);
  });
  test('should support single-line marqueeing content when `noWrap` is true', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_BodyText["default"], {
      noWrap: true
    }));
    var expected = true;
    var actual = subject.findWhere(function (c) {
      return c.name() === 'ui:Marquee';
    }).exists();
    expect(actual).toBe(expected);
  });
  test('should include the noWrap class if `noWrap` is true', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_BodyText["default"], {
      noWrap: true
    }));
    var expected = 'noWrap';
    var actual = subject.find(".".concat(_BodyTextModule["default"].bodyText)).prop('className');
    expect(actual).toContain(expected);
  });
});