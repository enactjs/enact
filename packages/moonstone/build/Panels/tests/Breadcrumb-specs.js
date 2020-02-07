"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Breadcrumb = _interopRequireDefault(require("../Breadcrumb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Breadcrumb', function () {
  test('should include {index} in the payload of {onSelect}', function () {
    var handleSelect = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Breadcrumb["default"], {
      index: 3,
      onSelect: handleSelect
    }));
    subject.simulate('click', {});
    var expected = 3;
    var actual = handleSelect.mock.calls[0][0].index;
    expect(actual).toBe(expected);
  });
  test('should include call both the {onClick} and {onSelect} handlers on click', function () {
    var handleSelect = jest.fn();
    var handleClick = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Breadcrumb["default"], {
      index: 3,
      onClick: handleClick,
      onSelect: handleSelect
    }));
    subject.simulate('click', {});
    var expected = true;
    var actual = handleSelect.mock.calls.length === 1 && handleClick.mock.calls.length === 1;
    expect(actual).toBe(expected);
  });
});