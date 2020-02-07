"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Panels = require("../Panels");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tap = function tap(node) {
  node.simulate('mousedown');
  node.simulate('mouseup');
}; // 2019-04-11 - Skipped tests here are avoiding a Hooks testing issue. At this time, enzyme does not
// properly test hooks, specifically the useCallback method.


describe('Panels Specs', function () {
  test.skip('should render application close button when \'noCloseButton\' is not specified', function () {
    var panels = (0, _enzyme.mount)(_react["default"].createElement(_Panels.Panels, null));
    var applicationCloseButton = panels.find('IconButton');
    var expected = 1;
    var actual = applicationCloseButton.length;
    expect(actual).toBe(expected);
  });
  test.skip('should not render application close button when \'noCloseButton\' is set to true', function () {
    var panels = (0, _enzyme.mount)(_react["default"].createElement(_Panels.Panels, {
      noCloseButton: true
    }));
    var applicationCloseButton = panels.find('IconButton');
    var expected = 0;
    var actual = applicationCloseButton.length;
    expect(actual).toBe(expected);
  });
  test.skip('should call onApplicationClose when application close button is clicked', function () {
    var handleAppClose = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_Panels.Panels, {
      onApplicationClose: handleAppClose
    }));
    tap(subject.find('IconButton'));
    var expected = 1;
    var actual = handleAppClose.mock.calls.length;
    expect(expected).toBe(actual);
  });
  test.skip('should set application close button "aria-label" to closeButtonAriaLabel', function () {
    var label = 'custom close button label';
    var panels = (0, _enzyme.mount)(_react["default"].createElement(_Panels.Panels, {
      closeButtonAriaLabel: label
    }));
    var expected = label;
    var actual = panels.find('IconButton').prop('aria-label');
    expect(actual).toBe(expected);
  });
  test.skip('should set {autoFocus} on child to "default-element" on first render', function () {
    // eslint-disable-next-line enact/prop-types
    var Panel = function Panel(_ref) {
      var autoFocus = _ref.autoFocus,
          id = _ref.id;
      return _react["default"].createElement("div", {
        id: id
      }, autoFocus);
    };

    var panels = (0, _enzyme.mount)(_react["default"].createElement(_Panels.Panels, {
      index: 0
    }, _react["default"].createElement(Panel, {
      id: "p1"
    }), _react["default"].createElement(Panel, {
      id: "p2"
    })));
    var expected = 'default-element';
    var actual = panels.find('Panel').prop('autoFocus');
    expect(actual).toBe(expected);
  });
  test.skip('should set {autoFocus} on child to "default-element" when navigating to a higher index', function () {
    // eslint-disable-next-line enact/prop-types
    var Panel = function Panel(_ref2) {
      var autoFocus = _ref2.autoFocus,
          id = _ref2.id;
      return _react["default"].createElement("div", {
        id: id
      }, autoFocus);
    };

    var panels = (0, _enzyme.mount)(_react["default"].createElement(_Panels.Panels, {
      index: 0
    }, _react["default"].createElement(Panel, {
      id: "p1"
    }), _react["default"].createElement(Panel, {
      id: "p2"
    })));
    panels.setProps({
      index: 1
    });
    var expected = 'default-element';
    var actual = panels.find('Panel').prop('autoFocus');
    expect(actual).toBe(expected);
  });
  test.skip('should not set {autoFocus} on child when navigating to a higher index when it has an autoFocus prop set', function () {
    // eslint-disable-next-line enact/prop-types
    var Panel = function Panel(_ref3) {
      var autoFocus = _ref3.autoFocus,
          id = _ref3.id;
      return _react["default"].createElement("div", {
        id: id
      }, autoFocus);
    };

    var panels = (0, _enzyme.mount)(_react["default"].createElement(_Panels.Panels, {
      index: 0
    }, _react["default"].createElement(Panel, {
      id: "p1"
    }), _react["default"].createElement(Panel, {
      id: "p2",
      autoFocus: "last-focused"
    })));
    panels.setProps({
      index: 1
    });
    var expected = 'last-focused';
    var actual = panels.find('Panel').prop('autoFocus');
    expect(actual).toBe(expected);
  });
  describe('computed', function () {
    describe('childProps', function () {
      test('should not add aria-owns when noCloseButton is true and no controls', function () {
        var id = 'id';
        var childProps = {};
        var props = {
          childProps: childProps,
          noCloseButton: true,
          id: id
        };
        var expected = childProps;

        var actual = _Panels.PanelsBase.computed.childProps(props);

        expect(actual).toBe(expected);
      });
      test('should not add aria-owns when id is not set', function () {
        var childProps = {};
        var props = {
          childProps: childProps,
          noCloseButton: false
        };
        var expected = childProps;

        var actual = _Panels.PanelsBase.computed.childProps(props);

        expect(actual).toBe(expected);
      });
      test('should add aria-owns', function () {
        var id = 'id';
        var childProps = {};
        var props = {
          childProps: childProps,
          noCloseButton: false,
          id: id
        };
        var expected = "".concat(id, "-controls");

        var actual = _Panels.PanelsBase.computed.childProps(props)['aria-owns'];

        expect(actual).toBe(expected);
      });
      test('should append aria-owns', function () {
        var id = 'id';
        var ariaOwns = ':allthethings:';
        var childProps = {
          'aria-owns': ariaOwns
        };
        var props = {
          childProps: childProps,
          noCloseButton: false,
          id: id
        };
        var expected = "".concat(ariaOwns, " ").concat(id, "-controls");

        var actual = _Panels.PanelsBase.computed.childProps(props)['aria-owns'];

        expect(actual).toBe(expected);
      });
      test('should append aria-owns with noCloseButton and controls', function () {
        var id = 'id';
        var ariaOwns = ':allthethings:';
        var childProps = {
          'aria-owns': ariaOwns
        };
        var props = {
          childProps: childProps,
          controls: _react["default"].createElement("div", null, "Hello"),
          noCloseButton: true,
          id: id
        };
        var expected = "".concat(ariaOwns, " ").concat(id, "-controls");

        var actual = _Panels.PanelsBase.computed.childProps(props)['aria-owns'];

        expect(actual).toBe(expected);
      });
    });
  });
});