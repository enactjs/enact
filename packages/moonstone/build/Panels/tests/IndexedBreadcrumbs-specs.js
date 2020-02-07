"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _IndexedBreadcrumbs = _interopRequireDefault(require("../IndexedBreadcrumbs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('IndexedBreadcrumbs', function () {
  // Suite-wide setup
  test('should generate {index} breadcrumbs when {index} <= {max}', function () {
    var index = 3;
    var max = 5;
    var breadcrumbs = (0, _IndexedBreadcrumbs["default"])('id', index, max);
    var expected = index;
    var actual = breadcrumbs.length;
    expect(actual).toBe(expected);
  });
  test('should generate {max} breadcrumbs when {index} > {max}', function () {
    var index = 6;
    var max = 1;
    var breadcrumbs = (0, _IndexedBreadcrumbs["default"])('id', index, max);
    var expected = max;
    var actual = breadcrumbs.length;
    expect(actual).toBe(expected);
  });
  test('should pad indices less than 10 with 0', function () {
    var breadcrumbs = (0, _IndexedBreadcrumbs["default"])('id', 1, 5);
    var expected = '01'; // React creates two children, one for '<' and one for the index label

    var actual = breadcrumbs[0].props.children[1];
    expect(actual).toBe(expected);
  });
  test('should call {onBreadcrumbClick} once when breadcrumb is clicked', function () {
    var handleClick = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement("nav", null, (0, _IndexedBreadcrumbs["default"])('id', 1, 1, handleClick)));
    subject.find('Breadcrumb').simulate('click', {});
    var expected = 1;
    var actual = handleClick.mock.calls.length;
    expect(actual).toBe(expected);
  });
});