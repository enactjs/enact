"use strict";

var _react = _interopRequireDefault(require("react"));

var _ExpandableItem = require("../ExpandableItem");

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('ExpandableItem', function () {
  describe('computed', function () {
    describe('label', function () {
      test('should use noneText when label is not set', function () {
        var expected = 'noneText';

        var actual = _ExpandableItem.ExpandableItemBase.computed.label({
          noneText: 'noneText'
        });

        expect(actual).toBe(expected);
      });
      test('should use label when set', function () {
        var expected = 'label';

        var actual = _ExpandableItem.ExpandableItemBase.computed.label({
          label: 'label',
          noneText: 'noneText'
        });

        expect(actual).toBe(expected);
      });
    });
    describe('open', function () {
      test('should be false when disabled', function () {
        var expected = false;

        var actual = _ExpandableItem.ExpandableItemBase.computed.open({
          disabled: true,
          open: true
        });

        expect(actual).toBe(expected);
      });
    });
    describe('handlers', function () {
      test('should call onClose when there is a prop onClose', function () {
        var children = ['option1', 'option2', 'option3'];
        var handleClose = jest.fn();
        var expandableItem = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableItem.ExpandableItemBase, {
          onClose: handleClose,
          title: "Item",
          noneText: "hello",
          open: true
        }, children));
        var item = expandableItem.find('LabeledItem');
        item.simulate('click');
        var expected = 1;
        var actual = handleClose.mock.calls.length;
        expect(actual).toBe(expected);
      });
      test('should call onOpen when there is a prop onOpen', function () {
        var children = ['option1', 'option2', 'option3'];
        var handleOpen = jest.fn();
        var expandableItem = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableItem.ExpandableItemBase, {
          onOpen: handleOpen,
          title: "Item",
          noneText: "hello"
        }, children));
        var item = expandableItem.find('LabeledItem');
        item.simulate('click');
        var expected = 1;
        var actual = handleOpen.mock.calls.length;
        expect(actual).toBe(expected);
      });
    });
  });
  describe('Voice Control', function () {
    test('should set "data-webos-voice-disabled" to LabeledItem when voice control is disabled', function () {
      var children = ['option1', 'option2', 'option3'];
      var expandableItem = (0, _enzyme.mount)(_react["default"].createElement(_ExpandableItem.ExpandableItemBase, {
        "data-webos-voice-disabled": true,
        title: "Item"
      }, children));
      var expected = true;
      var actual = expandableItem.find('LabeledItem').prop('data-webos-voice-disabled');
      expect(actual).toBe(expected);
    });
  });
});