"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageDecorator = exports.ImageBase = exports.Image = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _Image = _interopRequireDefault(require("@enact/ui/Image"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _resolution = require("@enact/ui/resolution");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _ImageModule = _interopRequireDefault(require("./Image.module.css"));

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

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A Moonstone-styled image component without any behavior
 *
 * @class ImageBase
 * @memberof moonstone/Image
 * @extends ui/Image.Image
 * @ui
 * @public
 */
var ImageBase = (0, _kind["default"])({
  name: 'Image',
  propTypes:
  /** @lends moonstone/Image.ImageBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `image` - The root component class for Image
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _ImageModule["default"],
    publicClassNames: ['image']
  },
  render: function render(_ref) {
    var css = _ref.css,
        rest = _objectWithoutProperties(_ref, ["css"]);

    return _react["default"].createElement(_Image["default"], Object.assign({
      draggable: "false"
    }, rest, {
      css: css
    }));
  }
}); // This induces a render when there is a screen size change that has a corosponding image src value
// associated with the new screen size. The render is kicked off by remembering the new image src.
//
// This hoc could (should) be rewritten at a later time to use a smarter context API and callbacks,
// or something like pub/sub; each of which would be hooked together from the resolution.js that
// would coordinate any screen size/orientation changes and emit events from there.
//
// This is ripe for refactoring, and could probably move into UI to be generalized, but that's for
// another time. -B 2018-05-01

exports.ImageBase = ImageBase;
var ResponsiveImageDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  // eslint-disable-line no-unused-vars
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(_props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, _props));

      _this.handleResize = function () {
        _this.setState(function (state, props) {
          var src = (0, _resolution.selectSrc)(props.src); // Trigger a render and save the currently selected src for later comparisons

          if (src !== state.src) {
            return {
              src: src
            };
          }

          return null;
        });
      };

      _this.state = {
        src: (0, _resolution.selectSrc)(_this.props.src)
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        window.addEventListener('resize', this.handleResize);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
      }
    }, {
      key: "render",
      value: function render() {
        return _react["default"].createElement(Wrapped, this.props);
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'ResponsiveImageDecorator', _class.propTypes = {
    src: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object])
  }, _temp;
});
/**
 * Moonstone-specific behaviors to apply to [Image]{@link moonstone/Image.ImageBase}.
 *
 * @hoc
 * @memberof moonstone/Image
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

var ImageDecorator = (0, _compose["default"])(_Pure["default"], ResponsiveImageDecorator, _Skinnable["default"]);
/**
 * A Moonstone-styled image component
 *
 * ```
 * <Image
 *   src={{
 *     'hd': 'https://dummyimage.com/64/e048e0/0011ff',
 *     'fhd': 'https://dummyimage.com/128/e048e0/0011ff',
 *     'uhd': 'https://dummyimage.com/256/e048e0/0011ff'
 *   }}
 * >
 * ```
 *
 * @class Image
 * @memberof moonstone/Image
 * @extends moonstone/Image.ImageBase
 * @mixes moonstone/Image.ImageDecorator
 * @ui
 * @public
 */

exports.ImageDecorator = ImageDecorator;
var Image = ImageDecorator(ImageBase);
exports.Image = Image;
var _default = Image;
exports["default"] = _default;