"use strict";

var _enzyme = require("enzyme");

var _react = _interopRequireDefault(require("react"));

var _Item = _interopRequireDefault(require("../../Item"));

var _VirtualList = _interopRequireDefault(require("../VirtualList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

describe('VirtualList', function () {
  var clientSize, dataSize, getScrollTo, handlerOnScroll, handlerOnScrollStart, handlerOnScrollStop, items, myScrollTo, onScrollCount, onScrollStartCount, onScrollStopCount, renderItem, resultScrollLeft, resultScrollTop;
  beforeEach(function () {
    clientSize = {
      clientWidth: 1280,
      clientHeight: 720
    };
    dataSize = 100;
    items = [];
    onScrollCount = 0;
    onScrollStartCount = 0;
    onScrollStopCount = 0;
    resultScrollLeft = 0;
    resultScrollTop = 0;

    getScrollTo = function getScrollTo(scrollTo) {
      myScrollTo = scrollTo;
    };

    handlerOnScroll = function handlerOnScroll() {
      onScrollCount++;
    };

    handlerOnScrollStart = function handlerOnScrollStart() {
      onScrollStartCount++;
    };

    handlerOnScrollStop = function handlerOnScrollStop(done, testCase) {
      return function (e) {
        onScrollStopCount++;
        resultScrollLeft = e.scrollLeft;
        resultScrollTop = e.scrollTop;
        testCase();
        done();
      };
    };

    renderItem = function renderItem(_ref) {
      var index = _ref.index,
          rest = _objectWithoutProperties(_ref, ["index"]);

      // eslint-disable-line enact/display-name, enact/prop-types
      return _react["default"].createElement(_Item["default"], rest, items[index].name);
    };

    for (var _i = 0; _i < dataSize; _i++) {
      items.push({
        name: 'Account ' + _i
      });
    }
  });
  afterEach(function () {
    clientSize = null;
    dataSize = null;
    getScrollTo = null;
    handlerOnScroll = null;
    handlerOnScrollStart = null;
    handlerOnScrollStop = null;
    items = null;
    myScrollTo = null;
    onScrollCount = null;
    onScrollStartCount = null;
    onScrollStopCount = null;
    renderItem = null;
    resultScrollLeft = null;
    resultScrollTop = null;
  });
  test('should render a list of \'items\'', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
      clientSize: clientSize,
      dataSize: dataSize,
      itemRenderer: renderItem,
      itemSize: 30
    }));
    var expected = 'Account 0';
    var actual = subject.find('[data-index]').at(0).text();
    expect(actual).toBe(expected);
  });
  test('should render (clientHeight / itemHeight + overhang) items', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
      clientSize: clientSize,
      dataSize: dataSize,
      itemRenderer: renderItem,
      itemSize: 30
    }));
    var expected = 27; // 720 / 30 + 3

    var actual = subject.find('Item[data-index]').length;
    expect(actual).toBe(expected);
  });
  test('should render only one scrollbar', function () {
    var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
      clientSize: clientSize,
      dataSize: dataSize,
      direction: "horizontal",
      itemRenderer: renderItem,
      itemSize: 30
    }));
    var expected = 1;
    var actual = subject.find('Scrollbar').length;
    expect(actual).toBe(expected);
  });
  describe('ScrollTo', function () {
    test('should scroll to the specific item of a given index with scrollTo', function (done) {
      var onScrollStop = handlerOnScrollStop(done, function () {
        var expected = 300;
        var actual = resultScrollTop;
        expect(actual).toBe(expected);
      });
      (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        cbScrollTo: getScrollTo,
        clientSize: clientSize,
        dataSize: dataSize,
        itemRenderer: renderItem,
        itemSize: 30,
        onScrollStop: onScrollStop
      }));
      myScrollTo({
        index: 10,
        animate: false
      });
    });
    test('should scroll to the given \'x\' position with scrollTo', function (done) {
      var onScrollStop = handlerOnScrollStop(done, function () {
        var expected = 100;
        var actual = resultScrollLeft;
        expect(actual).toBe(expected);
      });
      (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        cbScrollTo: getScrollTo,
        clientSize: clientSize,
        dataSize: dataSize,
        direction: "horizontal",
        itemRenderer: renderItem,
        itemSize: 30,
        onScrollStop: onScrollStop
      }));
      myScrollTo({
        position: {
          x: 100
        },
        animate: false
      });
    });
    test('should scroll to the given \'y\' position with scrollTo', function (done) {
      var onScrollStop = handlerOnScrollStop(done, function () {
        var expected = 100;
        var actual = resultScrollTop;
        expect(actual).toBe(expected);
      });
      (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        cbScrollTo: getScrollTo,
        clientSize: clientSize,
        dataSize: dataSize,
        itemRenderer: renderItem,
        itemSize: 30,
        onScrollStop: onScrollStop
      }));
      myScrollTo({
        position: {
          y: 100
        },
        animate: false
      });
    });
    describe('scroll events', function () {
      test('should call onScrollStart once', function () {
        (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
          cbScrollTo: getScrollTo,
          clientSize: clientSize,
          dataSize: dataSize,
          itemRenderer: renderItem,
          itemSize: 30,
          onScrollStart: handlerOnScrollStart
        }));
        myScrollTo({
          position: {
            y: 100
          },
          animate: false
        });
        var expected = 1;
        var actual = onScrollStartCount;
        expect(actual).toBe(expected);
      });
      test('should call onScroll once', function () {
        (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
          cbScrollTo: getScrollTo,
          clientSize: clientSize,
          dataSize: dataSize,
          itemRenderer: renderItem,
          itemSize: 30,
          onScroll: handlerOnScroll
        }));
        myScrollTo({
          position: {
            y: 100
          },
          animate: false
        });
        var expected = 1;
        var actual = onScrollCount;
        expect(actual).toBe(expected);
      });
      test('should call onScrollStop once', function (done) {
        var onScrollStop = handlerOnScrollStop(done, function () {
          var expected = 1;
          var actual = onScrollStopCount;
          expect(actual).toBe(expected);
        });
        (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
          cbScrollTo: getScrollTo,
          clientSize: clientSize,
          dataSize: dataSize,
          itemRenderer: renderItem,
          itemSize: 30,
          onScrollStop: onScrollStop
        }));
        myScrollTo({
          position: {
            y: 100
          },
          animate: false
        });
      });
    });
  });
  describe('Adding an item', function () {
    test('should render an added item named \'Password 0\' as the first item', function (done) {
      var itemArray = [{
        name: 'A'
      }, {
        name: 'B'
      }, {
        name: 'C'
      }];

      var renderItemArray = function renderItemArray(_ref2) {
        var index = _ref2.index,
            rest = _objectWithoutProperties(_ref2, ["index"]);

        // eslint-disable-line enact/display-name, enact/prop-types, react/jsx-no-bind
        return _react["default"].createElement("div", Object.assign({}, rest, {
          id: 'item' + index
        }), itemArray[index].name);
      };

      var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        clientSize: clientSize,
        dataSize: itemArray.length,
        itemRenderer: renderItemArray // eslint-disable-line react/jsx-no-bind
        ,
        itemSize: 30
      }));
      itemArray.unshift({
        name: 'Password 0'
      });
      subject.setProps({
        dataSize: itemArray.length
      });
      setTimeout(function () {
        var expected = itemArray[0].name;
        var actual = subject.find('[data-index]').at(0).text();
        expect(actual).toBe(expected);
        done();
      }, 0);
    });
  });
  describe('Scrollbar accessibility', function () {
    test('should set "aria-label" to previous scroll button in the horizontal scrollbar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        clientSize: clientSize,
        dataSize: dataSize,
        direction: "horizontal",
        scrollLeftAriaLabel: label,
        itemRenderer: renderItem,
        itemSize: 30
      }));
      var expected = label;
      var actual = subject.find('ScrollButton').at(0).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set "aria-label" to next scroll button in the horizontal scrollbar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        clientSize: clientSize,
        dataSize: dataSize,
        direction: "horizontal",
        scrollRightAriaLabel: label,
        itemRenderer: renderItem,
        itemSize: 30
      }));
      var expected = label;
      var actual = subject.find('ScrollButton').at(1).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set "aria-label" to previous scroll button in the vertical scrollbar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        clientSize: clientSize,
        dataSize: dataSize,
        direction: "vertical",
        itemRenderer: renderItem,
        itemSize: 30,
        scrollUpAriaLabel: label
      }));
      var expected = label;
      var actual = subject.find('ScrollButton').at(0).prop('aria-label');
      expect(actual).toBe(expected);
    });
    test('should set "aria-label" to next scroll button in the vertical scrollbar', function () {
      var label = 'custom button aria label';
      var subject = (0, _enzyme.mount)(_react["default"].createElement(_VirtualList["default"], {
        clientSize: clientSize,
        dataSize: dataSize,
        direction: "vertical",
        itemRenderer: renderItem,
        itemSize: 30,
        scrollDownAriaLabel: label
      }));
      var expected = label;
      var actual = subject.find('ScrollButton').at(1).prop('aria-label');
      expect(actual).toBe(expected);
    });
  });
});