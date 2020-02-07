"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _DaySelector = _interopRequireDefault(require("../DaySelector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tap = function tap(node) {
  node.simulate('mousedown');
  node.simulate('mouseup');
};

describe('DaySelector', function () {
  test('should set selected prop to true for the item that is selected by default', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      defaultSelected: 0
    }));
    var item = subject.find('DaySelectorItem').first();
    var expected = true;
    var actual = item.prop('selected');
    expect(actual).toBe(expected);
  });
  test('should fire onSelect when a day is selected', function () {
    var handleSelect = jest.fn();
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      onSelect: handleSelect
    }));
    var item = subject.find('DaySelectorItem').first();
    tap(item);
    var expected = 1;
    var actual = handleSelect.mock.calls.length;
    expect(actual).toBe(expected);
  });
  test('should fire onSelect with the correct content when a day is selected', function () {
    var handleSelect = jest.fn();
    var content = 'Sat';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      onSelect: handleSelect
    }));
    var item = subject.find('DaySelectorItem').last();
    tap(item);
    var expected = content;
    var actual = handleSelect.mock.calls[0][0].content;
    expect(actual).toBe(expected);
  });
  test('should use the full string format when dayNameLength is `full`', function () {
    var handleSelect = jest.fn();
    var content = 'Saturday';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      dayNameLength: "full",
      onSelect: handleSelect
    }));
    var item = subject.find('DaySelectorItem').last();
    tap(item);
    var expected = content;
    var actual = handleSelect.mock.calls[0][0].content;
    expect(actual).toBe(expected);
  });
  test('should set selected content as Every day when every day is selected', function () {
    var handleSelect = jest.fn();
    var content = 'Every Day';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      defaultSelected: [0, 1, 2, 3, 4, 5],
      onSelect: handleSelect
    }));
    var item = subject.find('DaySelectorItem').last();
    tap(item);
    var expected = content;
    var actual = handleSelect.mock.calls[0][0].content;
    expect(actual).toBe(expected);
  });
  test('should set selected content as Every weekday when every weekday is selected', function () {
    var handleSelect = jest.fn();
    var content = 'Every Weekday';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      defaultSelected: [0, 1, 2, 3, 4, 5],
      onSelect: handleSelect
    }));
    var item = subject.find('DaySelectorItem').first();
    tap(item);
    var expected = content;
    var actual = handleSelect.mock.calls[0][0].content;
    expect(actual).toBe(expected);
  });
  test('should set selected content as Every weekend when every weekend is selected', function () {
    var handleSelect = jest.fn();
    var content = 'Every Weekend';
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      defaultSelected: [0],
      onSelect: handleSelect
    }));
    var item = subject.find('DaySelectorItem').last();
    tap(item);
    var expected = content;
    var actual = handleSelect.mock.calls[0][0].content;
    expect(actual).toBe(expected);
  });
  test('should render updated day name length.', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_DaySelector["default"], {
      dayNameLength: 'full'
    }));
    subject.setProps({
      dayNameLength: 'short'
    });
    subject.update();
    var expected = '✓S✓M✓T✓W✓T✓F✓S';
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
});