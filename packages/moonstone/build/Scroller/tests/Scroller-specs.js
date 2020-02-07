"use strict";

var _enzyme = require("enzyme");

var _react = _interopRequireDefault(require("react"));

var _Scroller = _interopRequireWildcard(require("../Scroller"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Scroller', function () {
  var contents;
  beforeEach(function () {
    contents = _react["default"].createElement("div", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", _react["default"].createElement("br", null), "Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.");
  });
  afterEach(function () {
    contents = null;
  });
  describe('Scrollbar visibility', function () {
    test('should render both horizontal and vertical scrollbars when \'horizontalScrollbar\' and \'verticalScrollbar\' are "visible"', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Scroller["default"], {
        horizontalScrollbar: "visible",
        verticalScrollbar: "visible"
      }, contents));
      var expected = 2;
      var actual = subject.find('Scrollbar').length;
      expect(actual).toBe(expected);
    });
    test('should render only vertical scrollbar when \'verticalScrollbar\' is "visible" and \'horizontalScrollbar\' is "hidden"', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Scroller["default"], {
        horizontalScrollbar: "hidden",
        verticalScrollbar: "visible"
      }, contents));
      var expected = 1;
      var actual = subject.find('Scrollbar').length;
      expect(actual).toBe(expected);
    });
    test('should not render any scrollbar when when \'horizontalScrollbar\' and \'verticalScrollbar\' are "hidden"', function () {
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Scroller["default"], {
        horizontalScrollbar: "hidden",
        verticalScrollbar: "hidden"
      }, contents));
      var expected = 0;
      var actual = subject.find('Scrollbar').length;
      expect(actual).toBe(expected);
    });
  });
  describe('Scrollbar accessibility', function () {
    test('should set "aria-label" to previous scroll button in the horizontal scroll bar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Scroller["default"], {
        horizontalScrollbar: "visible",
        scrollLeftAriaLabel: label,
        verticalScrollbar: "visible"
      }, contents));
      var expected = label;
      var actual = subject.find('ScrollButton').at(2).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set "aria-label" to next scroll button in the horizontal scroll bar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Scroller["default"], {
        horizontalScrollbar: "visible",
        scrollRightAriaLabel: label,
        verticalScrollbar: "visible"
      }, contents));
      var expected = label;
      var actual = subject.find('ScrollButton').at(3).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set "aria-label" to previous scroll button in the vertical scroll bar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Scroller["default"], {
        horizontalScrollbar: "visible",
        verticalScrollbar: "visible",
        scrollUpAriaLabel: label
      }, contents));
      var expected = label;
      var actual = subject.find('ScrollButton').at(0).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set "aria-label" to next scroll button in the vertical scroll bar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_Scroller["default"], {
        horizontalScrollbar: "visible",
        verticalScrollbar: "visible",
        scrollDownAriaLabel: label
      }, contents));
      var expected = label;
      var actual = subject.find('ScrollButton').at(1).prop('aria-label');
      expect(actual).toBe(expected);
    });
  });
  describe('ScrollerBase API', function () {
    test('should call onUpdate when Scroller updates', function () {
      var handleUpdate = jest.fn();
      var subject = (0, _enzyme.shallow)(_react["default"].createElement(_Scroller.ScrollerBase, {
        onUpdate: handleUpdate
      }, contents));
      subject.setProps({
        children: ''
      });
      var expected = 1;
      var actual = handleUpdate.mock.calls.length;
      expect(expected).toBe(actual);
    });
  });
});