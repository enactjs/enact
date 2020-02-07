"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _SharedStateDecorator = _interopRequireWildcard(require("../SharedStateDecorator"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

describe('SharedStateDecorator Specs', function () {
  test('should provide a set method via context', function () {
    var fn = jest.fn();
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        fn(value.set);
        return null;
      });
    });
    (0, _enzyme.mount)(_react["default"].createElement(Component, null));
    var expected = 'function';

    var actual = _typeof(fn.mock.calls[0][0]);

    expect(actual).toBe(expected);
  });
  test('should provide a get method via context', function () {
    var fn = jest.fn();
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        fn(value.get);
        return null;
      });
    });
    (0, _enzyme.mount)(_react["default"].createElement(Component, null));
    var expected = 'function';

    var actual = _typeof(fn.mock.calls[0][0]);

    expect(actual).toBe(expected);
  });
  test('should provide a delete method via context', function () {
    var fn = jest.fn();
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        fn(value["delete"]);
        return null;
      });
    });
    (0, _enzyme.mount)(_react["default"].createElement(Component, null));
    var expected = 'function';

    var actual = _typeof(fn.mock.calls[0][0]);

    expect(actual).toBe(expected);
  });
  test('should supporting setting and getting a value by key when {id} is set', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: "outer"
    }));
    var expected = 'value';
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should supporting setting and getting a value by key when {id} is set to a non-zero value', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: -1
    }));
    var expected = 'value';
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should supporting setting and getting a value by key when {id} is set to zero', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: 0
    }));
    var expected = 'value';
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should not set or return values when {id} is not set', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, null));
    var expected = null;
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should not set or return values when {id} is set to an empty string', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: ""
    }));
    var expected = null;
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should not set or return values when {id} is set to null', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: null
    }));
    var expected = null;
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should not set or return values when {id} and {noSharedState} are set', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: "outer",
      noSharedState: true
    }));
    var expected = null;
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should supporting deleting a value by key when {id} is set', function () {
    var Component = (0, _SharedStateDecorator["default"])(function () {
      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        value["delete"]('key');
        return value.get('key');
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: "outer"
    }));
    var expected = null;
    var actual = subject.text();
    expect(actual).toBe(expected);
  });
  test('should share data upstream when inside another SharedStateDecorator', function () {
    var Component = (0, _SharedStateDecorator["default"])(function (_ref) {
      var children = _ref.children,
          rest = _objectWithoutProperties(_ref, ["children"]);

      return _react["default"].createElement(_SharedStateDecorator.SharedState.Consumer, null, function (value) {
        value.set('key', 'value');
        return _react["default"].createElement("div", rest, _react["default"].createElement("span", null, value.get('key')), children);
      });
    });
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: "outer"
    }, _react["default"].createElement(Component, {
      id: "inner"
    })));
    var expected = {
      // "data" is grouped by id so the top level key is the current id
      outer: {
        // this is set by value.set('key', 'value');
        key: 'value',
        // when a descendant is added, it pushes its data upstream stored by its id
        inner: {
          // like above, the data is grouped again by the id
          inner: {
            // from the descendant's set()
            key: 'value'
          }
        }
      }
    };
    var actual = subject.instance().data;
    expect(actual).toEqual(expected);
  });
  test('should restore shared state from ancestor', function () {
    var Base =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(Base, _React$Component);

      function Base() {
        _classCallCheck(this, Base);

        return _possibleConstructorReturn(this, _getPrototypeOf(Base).apply(this, arguments));
      }

      _createClass(Base, [{
        key: "render",
        value: function render() {
          // eslint-disable-next-line enact/prop-types
          var _this$props = this.props,
              children = _this$props.children,
              propValue = _this$props.value,
              rest = _objectWithoutProperties(_this$props, ["children", "value"]);

          if (propValue) {
            this.context.set('key', propValue);
          }

          return _react["default"].createElement("div", rest, _react["default"].createElement("span", null, this.context.get('key')), children);
        }
      }]);

      return Base;
    }(_react["default"].Component);

    Base.contextType = _SharedStateDecorator.SharedState;
    var Component = (0, _SharedStateDecorator["default"])({
      updateOnMount: true
    }, Base);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(Component, {
      id: "outer",
      value: "value"
    }, _react["default"].createElement(Component, {
      id: "inner",
      value: "from-prop"
    }))); // remove the children which drops inner's shared state

    subject.setProps({
      children: null
    }); // recreate it with the same id but no initial value to validate the previous state is
    // restored. updateOnMount is used above to coerce a re-render on mount since the shared
    // state value is used in the render method and isn't available on first render otherwise.

    subject.setProps({
      children: _react["default"].createElement(Component, {
        id: "inner"
      })
    });
    var expected = 'from-prop';
    var actual = subject.find('div#inner').text();
    expect(actual).toBe(expected);
  });
});