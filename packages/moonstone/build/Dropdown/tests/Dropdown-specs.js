"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Dropdown = require("../Dropdown");

var _DropdownList = _interopRequireDefault(require("../DropdownList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var title = 'Dropdown select';
var children = ['option1', 'option2', 'option3'];
describe('Dropdown', function () {
  test('should have `title`', function () {
    var dropDown = (0, _enzyme.mount)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title
    }, children));
    var expected = title;
    var actual = dropDown.find('.text').text();
    expect(actual).toBe(expected);
  });
  test('should have `title` when `children` is invalid', function () {
    var dropDown = (0, _enzyme.mount)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title
    }, null));
    var expected = title;
    var actual = dropDown.find('.text').text();
    expect(actual).toBe(expected);
  });
  test('should have `title` that reflects `selected` option', function () {
    var selectedIndex = 1;
    var dropDown = (0, _enzyme.mount)(_react["default"].createElement(_Dropdown.DropdownBase, {
      selected: selectedIndex,
      title: title
    }, children));
    var expected = children[selectedIndex];
    var actual = dropDown.find('.text').text();
    expect(actual).toBe(expected);
  });
  test('should have `title` when `selected` is invalid', function () {
    var dropDown = (0, _enzyme.mount)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title,
      selected: -1
    }, children));
    var expected = title;
    var actual = dropDown.find('.text').text();
    expect(actual).toBe(expected);
  });
  test('should be disabled when `children` is omitted', function () {
    var dropDown = (0, _enzyme.mount)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title
    }));
    var expected = true;
    var actual = dropDown.find('DropdownButton').prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should be disabled when there are no `children`', function () {
    var dropDown = (0, _enzyme.mount)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title
    }, []));
    var expected = true;
    var actual = dropDown.find('DropdownButton').prop('disabled');
    expect(actual).toBe(expected);
  });
  test('should update when children are added', function () {
    var dropDown = (0, _enzyme.shallow)(_react["default"].createElement(_Dropdown.Dropdown, {
      title: title
    }, children));
    var updatedChildren = children.concat('option4', 'option5');
    dropDown.setProps({
      children: updatedChildren
    });
    var expected = 5;
    var actual = dropDown.children().length;
    expect(actual).toBe(expected);
  });
  test('should set the `role` of items to "checkbox"', function () {
    var dropDown = (0, _enzyme.shallow)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title,
      defaultOpen: true
    }, ['item']));
    var expected = 'checkbox';
    var actual = dropDown.prop('popupProps').children[0].role;
    expect(actual).toBe(expected);
  });
  test('should set the `aria-checked` state of the `selected` item', function () {
    var dropDown = (0, _enzyme.shallow)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title,
      selected: 0
    }, ['item']));
    var expected = true;
    var actual = dropDown.prop('popupProps').children[0]['aria-checked'];
    expect(actual).toBe(expected);
  });
  test('should pass through members of child objects to props for each item', function () {
    var dropDown = (0, _enzyme.shallow)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title
    }, [{
      disabled: true,
      children: 'child',
      key: 'item-0'
    }]));
    var expected = true;
    var actual = dropDown.prop('popupProps').children[0].disabled;
    expect(actual).toBe(expected);
  });
  test('should allow members in child object to override injected aria values', function () {
    var dropDown = (0, _enzyme.shallow)(_react["default"].createElement(_Dropdown.DropdownBase, {
      title: title,
      selected: 0
    }, [{
      disabled: true,
      children: 'child',
      key: 'item-0',
      role: 'button',
      'aria-checked': false
    }]));
    var expected = {
      role: 'button',
      'aria-checked': false
    };
    var actual = dropDown.prop('popupProps').children[0];
    expect(actual).toMatchObject(expected);
  });
  describe('DropdownList', function () {
    test('should include `data` and `selected` in `onSelect` callback', function () {
      var handler = jest.fn();
      var dropDown = (0, _enzyme.mount)(_react["default"].createElement(_DropdownList["default"], {
        onSelect: handler
      }, children));
      dropDown.find('Item').at(0).simulate('click');
      var expected = {
        data: 'option1',
        selected: 0
      };
      var actual = handler.mock.calls[0][0];
      expect(actual).toEqual(expected);
    });
  });
});