"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ExpandableList = require("../ExpandableList");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('ExpandableList', function () {
  describe('#aria-multiselectable', function () {
    test('should be true when select is multiple', function () {
      var expandableList = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableList.ExpandableListBase, {
        title: "Item",
        select: "multiple"
      }, ['option1', 'option2', 'option3']));
      var expected = true;
      var actual = expandableList.find('ExpandableItem').prop('aria-multiselectable');
      expect(actual).toBe(expected);
    });
  });
  test('should update when children are added', function () {
    var children = ['option1', 'option2', 'option3'];
    var expandableList = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableList.ExpandableList, {
      title: "Item",
      open: true
    }, children));
    var updatedChildren = children.concat('option4', 'option5');
    expandableList.setProps({
      children: updatedChildren
    });
    var expected = 5;
    var actual = expandableList.find('GroupItem').length;
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to LabeledItem when voice control is disabled', function () {
    var children = ['option1', 'option2', 'option3'];
    var expandableList = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableList.ExpandableListBase, {
      "data-webos-voice-disabled": true,
      title: "Item",
      open: true
    }, children));
    var expected = true;
    var actual = expandableList.find('LabeledItem').prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should set "data-webos-voice-disabled" to child item when voice control is disabled', function () {
    var children = ['option1', 'option2', 'option3'];
    var expandableList = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableList.ExpandableList, {
      "data-webos-voice-disabled": true,
      title: "Item",
      open: true
    }, children));
    var expected = true;
    var actual = expandableList.find('GroupItem').first().prop('data-webos-voice-disabled');
    expect(actual).toBe(expected);
  });
  test('should allow for selected as array when not multi-select', function () {
    var children = ['option1', 'option2', 'option3'];
    var expandableList = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableList.ExpandableList, {
      selected: [0, 1],
      title: "Item"
    }, children));
    var expected = children[0];
    var actual = expandableList.text().slice(-1 * expected.length);
    expect(actual).toBe(expected);
  });
  test('should allow for selected as array when not multi-select with object', function () {
    var children = [{
      children: 'option1',
      key: 'a'
    }, {
      children: 'option2',
      key: 'b'
    }, {
      children: 'option3',
      key: 'c'
    }];
    var expandableList = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableList.ExpandableList, {
      selected: [1, 2],
      title: "Item"
    }, children));
    var expected = children[1].children;
    var actual = expandableList.text().slice(-1 * expected.length);
    expect(actual).toBe(expected);
  });
  test('should show noneText when selected is empty array', function () {
    var children = [{
      children: 'option1',
      key: 'a'
    }, {
      children: 'option2',
      key: 'b'
    }, {
      children: 'option3',
      key: 'c'
    }];
    var expandableList = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableList.ExpandableList, {
      selected: [],
      title: "Item",
      noneText: "hello"
    }, children));
    var expected = 'hello';
    var actual = expandableList.text().slice(-1 * expected.length);
    expect(actual).toBe(expected);
  });
});