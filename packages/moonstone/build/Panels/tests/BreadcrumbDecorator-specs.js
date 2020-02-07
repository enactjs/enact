"use strict";

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _enzyme = require("enzyme");

var _BreadcrumbDecorator = _interopRequireDefault(require("../BreadcrumbDecorator"));

var _Panels = _interopRequireDefault(require("../Panels"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/jsx-no-bind */
// 2019-04-11 - Skipped tests here are avoiding a Hooks testing issue. At this time, enzyme does not
// properly test hooks, specifically the useCallback method.
describe('BreadcrumbDecorator', function () {
  var CustomBreadcrumb = (0, _kind["default"])({
    name: 'CustomBreadcrumb',
    propsTypes: {
      index: _propTypes["default"].number,
      onSelect: _propTypes["default"].func
    },
    render: function render(_ref) {
      var index = _ref.index,
          onSelect = _ref.onSelect;

      // eslint-disable-line enact/prop-types
      var handleSelect = function handleSelect() {
        return onSelect({
          index: index
        });
      };

      return _react["default"].createElement("span", {
        onClick: handleSelect
      }, index);
    }
  });

  var Panel = function Panel() {
    return _react["default"].createElement("div", null);
  };

  test.skip('should wrap primitive breadcrumbs with Breadcrumb', function () {
    var SingleBreadcrumbPanels = (0, _BreadcrumbDecorator["default"])({
      max: 1
    }, _Panels["default"]);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(SingleBreadcrumbPanels, {
      index: 2,
      breadcrumbs: ['1st', '2nd', '3rd']
    }, _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null)));
    var expected = '2nd';
    var actual = subject.find('Breadcrumb').text();
    expect(actual).toBe(expected);
  });
  test.skip('should support custom breadcrumbs', function () {
    var SingleBreadcrumbPanels = (0, _BreadcrumbDecorator["default"])({
      max: 1
    }, _Panels["default"]);
    var breadcrumbs = [0, 1, 2].map(function (i) {
      return _react["default"].createElement(CustomBreadcrumb, {
        index: i
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(SingleBreadcrumbPanels, {
      index: 2,
      breadcrumbs: breadcrumbs
    }, _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null)));
    var expected = 1;
    var actual = subject.find('CustomBreadcrumb').length;
    expect(actual).toBe(expected);
  });
  test.skip('should generate {config.max} breadcrumbs', function () {
    var ThreeBreadcrumbPanels = (0, _BreadcrumbDecorator["default"])({
      max: 3
    }, _Panels["default"]);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(ThreeBreadcrumbPanels, {
      index: 3
    }, _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null)));
    var expected = 3;
    var actual = subject.find('Breadcrumb').length;
    expect(actual).toBe(expected);
  });
  test.skip('should add {config.className} to the root node', function () {
    var className = 'root-node';
    var StyledBreadcrumbPanels = (0, _BreadcrumbDecorator["default"])({
      className: className
    }, _Panels["default"]);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(StyledBreadcrumbPanels, null, _react["default"].createElement(Panel, null)));
    var expected = true;
    var actual = subject.find('div').first().hasClass(className);
    expect(actual).toBe(expected);
  });
  test.skip('should not set aria-owns when no breadcrumbs are needed', function () {
    var ThreeBreadcrumbPanels = (0, _BreadcrumbDecorator["default"])({
      max: 3
    }, _Panels["default"]);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(ThreeBreadcrumbPanels, {
      id: "test",
      index: 0,
      noCloseButton: true
    }, _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null))); // eslint-disable-next-line

    var expected = undefined;
    var actual = subject.find(Panel).first().prop('aria-owns');
    expect(actual).toBe(expected);
  });
  test.skip('should set aria-owns on each Panel for the breadcrumbs', function () {
    var ThreeBreadcrumbPanels = (0, _BreadcrumbDecorator["default"])({
      max: 3
    }, _Panels["default"]);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(ThreeBreadcrumbPanels, {
      id: "test",
      index: 3,
      noCloseButton: true
    }, _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null))); // tests for {config.max} aria-owns entries in the format ${id}_bc_{$index}

    var expected = [0, 1, 2].map(function (n) {
      return "test_bc_".concat(n);
    }).join(' ');
    var actual = subject.find(Panel).first().prop('aria-owns');
    expect(actual).toBe(expected);
  });
  test.skip('should set aria-owns on each Panel for the `max` breadcrumbs', function () {
    var ThreeBreadcrumbPanels = (0, _BreadcrumbDecorator["default"])({
      max: 1
    }, _Panels["default"]);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(ThreeBreadcrumbPanels, {
      id: "test",
      index: 3,
      noCloseButton: true
    }, _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null))); // tests for truncated {config.max} aria-owns entries in the format ${id}_bc_{$index}

    var expected = 'test_bc_2';
    var actual = subject.find(Panel).first().prop('aria-owns');
    expect(actual).toBe(expected);
  });
  test.skip('should append breadcrumb aria-owns to set aria-owns value in childProps', function () {
    var Component = (0, _BreadcrumbDecorator["default"])({
      max: 1
    }, _Panels["default"]);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: "test",
      noCloseButton: true,
      index: 1,
      childProps: {
        'aria-owns': ':allthethings:'
      }
    }, _react["default"].createElement(Panel, null), _react["default"].createElement(Panel, null)));
    var expected = ':allthethings: test_bc_0';
    var actual = subject.find(Panel).first().prop('aria-owns');
    expect(actual).toBe(expected);
  });
});