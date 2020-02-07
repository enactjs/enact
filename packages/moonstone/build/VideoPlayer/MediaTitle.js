"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaTitleBase = exports.MediaTitle = exports["default"] = void 0;

var _ForwardRef = _interopRequireDefault(require("@enact/ui/ForwardRef"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Marquee = _interopRequireDefault(require("../Marquee"));

var _VideoPlayerModule = _interopRequireDefault(require("./VideoPlayer.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * MediaTitle {@link moonstone/VideoPlayer}.
 *
 * @class MediaTitle
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var MediaTitleBase = (0, _kind["default"])({
  name: 'MediaTitle',
  propTypes:
  /** @lends moonstone/VideoPlayer.MediaTitle.prototype */
  {
    /**
     * DOM id for the component. Also define ids for the title and node wrapping the `children`
     * in the forms `${id}_title` and `${id}_info`, respectively.
     *
     * @type {String}
     * @required
     * @public
     */
    id: _propTypes["default"].string.isRequired,

    /**
     * Anything supplied to `children` will be rendered. Typically this will be informational
     * badges indicating aspect ratio, audio channels, etc., but it could also be a description.
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node,

    /**
     * Forwards a reference to the MediaTitle component.
     *
     * @type {Function}
     * @private
     */
    forwardRef: _propTypes["default"].func,

    /**
     * Control whether the children (infoComponents) are displayed.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    infoVisible: _propTypes["default"].bool,

    /**
     * A title string to identify the media's title.
     *
     * @type {Node}
     * @public
     */
    title: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),

    /**
     * Setting this to false effectively hides the entire component. Setting it to `false` after
     * the control has rendered causes a fade-out transition. Setting to `true` after or during
     * the transition makes the component immediately visible again, without delay or transition.
     *
     * @type {Boolean}
     * @default true
     * @public
     */
    // This property uniquely defaults to true, because it doesn't make sense to have it false
    // and have the control be initially invisible, and is named "visible" to match the other
    // props (current and possible future). Having an `infoVisible` and a `hidden` prop seems weird.
    visible: _propTypes["default"].bool
  },
  defaultProps: {
    infoVisible: false,
    visible: true
  },
  styles: {
    css: _VideoPlayerModule["default"],
    className: 'titleFrame'
  },
  computed: {
    childrenClassName: function childrenClassName(_ref) {
      var infoVisible = _ref.infoVisible,
          styler = _ref.styler;
      return styler.join('infoComponents', infoVisible ? 'visible' : 'hidden');
    },
    className: function className(_ref2) {
      var visible = _ref2.visible,
          styler = _ref2.styler;
      return styler.append(visible ? 'visible' : 'hidden');
    },
    titleClassName: function titleClassName(_ref3) {
      var infoVisible = _ref3.infoVisible,
          styler = _ref3.styler;
      return styler.join({
        title: true,
        infoVisible: infoVisible
      });
    }
  },
  render: function render(_ref4) {
    var children = _ref4.children,
        childrenClassName = _ref4.childrenClassName,
        id = _ref4.id,
        forwardRef = _ref4.forwardRef,
        title = _ref4.title,
        titleClassName = _ref4.titleClassName,
        rest = _objectWithoutProperties(_ref4, ["children", "childrenClassName", "id", "forwardRef", "title", "titleClassName"]);

    delete rest.infoVisible;
    delete rest.visible;
    return _react["default"].createElement("div", Object.assign({}, rest, {
      id: id,
      ref: forwardRef
    }), _react["default"].createElement(_Marquee["default"], {
      id: id + '_title',
      className: titleClassName,
      marqueeOn: "render"
    }, title), _react["default"].createElement("div", {
      id: id + '_info',
      className: childrenClassName
    }, "  ", children));
  }
});
exports.MediaTitleBase = MediaTitleBase;
var MediaTitle = (0, _ForwardRef["default"])((0, _onlyUpdateForKeys["default"])(['children', 'title', 'infoVisible', 'visible'])(MediaTitleBase));
exports.MediaTitle = MediaTitle;
var _default = MediaTitle;
exports["default"] = _default;