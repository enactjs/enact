"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedStateDecorator = exports.SharedState = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SharedState = _react["default"].createContext(null);

exports.SharedState = SharedState;
var defaultConfig = {
  idProp: 'id',
  updateOnMount: false
};
/**
 * Adds shared state to a component.
 *
 * The purpose of shared state is to store framework component state at significant container
 * boundaries in order to restore it when the "same" component is mounted later.
 *
 * "Sameness" is determined by the `idProp` config member (defaults to "id"). If multiple
 * descendants have the same `idProp` within the subtree, SharedStateDecorator will not distinguish
 * between them and will allow each to read from and write over each other's data.
 *
 * For example, Panels and Panel are considered "significant container boundaries" since they are
 * key building blocks for moonstone applications. When components are rendered within a Panel, we
 * may want to store those components state on unmount so that we can restore it when returning to
 * the panel. Panel can (and does) use SharedStateDecorator to establish a shared state which can be
 * used by contained components.
 *
 * It's important to note that SharedStateDecorator doesn't prescribe how or what is stored nor how
 * the data is managed. That is left to the consuming component to determine. Also, unlike React
 * state or third-party state management solutions like Redux, updating shared state will not
 * initiate an update cycle in React. The intent is only to restore state on mount.
 *
 * If shared state is used in the render method for a component, it may be necessary to use the
 * `updateOnMount` config member which will initiate an update cycle within React once the data is
 * available from an upstream shared state.
 *
 * @hoc
 * @private
 */

var SharedStateDecorator = (0, _hoc["default"])(defaultConfig, function (config, Wrapped) {
  var _class, _temp;

  var idProp = config.idProp,
      updateOnMount = config.updateOnMount;
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
      _this.data = {};
      _this.sharedState = _this.initSharedState();
      _this.state = {
        updateOnMount: false
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.loadFromContext();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (!prevProps.noSharedState && this.props.noSharedState) {
          this.data = {};
        } else if (prevProps.noSharedState && !this.props.noSharedState) {
          this.loadFromContext();
        }
      }
    }, {
      key: "isUpdateable",
      value: function isUpdateable() {
        var _this$props = this.props,
            id = _this$props[idProp],
            noSharedState = _this$props.noSharedState;
        return !noSharedState && (id || id === 0);
      }
    }, {
      key: "initSharedState",
      value: function initSharedState() {
        var _this2 = this;

        return {
          set: function set(key, value) {
            var id = _this2.props[idProp];

            if (_this2.isUpdateable()) {
              _this2.data[id] = _this2.data[id] || {};
              _this2.data[id][key] = value;
            }
          },
          get: function get(key) {
            var id = _this2.props[idProp];
            return _this2.isUpdateable() && _this2.data[id] ? _this2.data[id][key] : null;
          },
          "delete": function _delete(key) {
            var id = _this2.props[idProp];

            if (_this2.isUpdateable() && _this2.data[id]) {
              delete _this2.data[id][key];
            }
          }
        };
      }
    }, {
      key: "loadFromContext",
      value: function loadFromContext() {
        var _this$props2 = this.props,
            id = _this$props2[idProp],
            noSharedState = _this$props2.noSharedState;

        if (!noSharedState && this.context && this.context.get) {
          var data = this.context.get(id);

          if (data) {
            this.data = data;
          } else {
            this.context.set(id, this.data);
          }

          if (updateOnMount) {
            this.setState({
              updateOnMount: true
            });
          }
        }
      }
    }, {
      key: "render",
      value: function render() {
        var props = Object.assign({}, this.props);
        delete props.noSharedState;
        return _react["default"].createElement(SharedState.Provider, {
          value: this.sharedState
        }, _react["default"].createElement(Wrapped, props));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'SharedStateDecorator', _class.contextType = SharedState, _class.propTypes = {
    /**
     * Prevents the component from setting or restoring any framework shared state.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noSharedState: _propTypes["default"].bool
  }, _temp;
});
exports.SharedStateDecorator = SharedStateDecorator;
var _default = SharedStateDecorator;
exports["default"] = _default;