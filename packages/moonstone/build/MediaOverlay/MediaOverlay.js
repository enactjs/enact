"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaOverlayDecorator = exports.MediaOverlayBase = exports.MediaOverlay = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Layout = require("@enact/ui/Layout");

var _Media = _interopRequireDefault(require("@enact/ui/Media"));

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Image = _interopRequireDefault(require("../Image"));

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _MediaOverlayModule = _interopRequireDefault(require("./MediaOverlay.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A media component with image and text overlay support.
 *
 * @class MediaOverlayBase
 * @memberof moonstone/MediaOverlay
 * @ui
 * @public
 */
var MediaOverlayBase = (0, _kind["default"])({
  name: 'MediaOverlay',
  propTypes:
  /** @lends moonstone/MediaOverlay.MediaOverlayBase.prototype */
  {
    /**
     * Any children `<source>` tag elements will be sent directly to the media element as
     * sources.
     *
     * @type {Node}
     * @public
     */
    source: _propTypes2["default"].node.isRequired,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `image` - class name for image
     * * `textLayout` - class name for text layout
     *
     * @type {Object}
     * @public
     */
    css: _propTypes2["default"].object,

    /**
     * Image path for image overlay.
     *
     * NOTE: When image is displayed, media is not displayed even though it is playing.
     *
     * @type {String|Object}
     * @public
     */
    imageOverlay: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].object]),

    /**
     * Media component to use.
     *
     * The default (`'video'`) renders an `HTMLVideoElement`. Custom media components must have
     * a similar API structure, exposing the following APIs:
     *
     * Methods:
     * * `load()` - load media
     *
     * @type {String|Component}
     * @default 'video'
     * @public
     */
    mediaComponent: _propTypes["default"].renderable,

    /**
     * Placeholder for image overlay.
     *
     * @type {String}
     * @public
     */
    placeholder: _propTypes2["default"].string,

    /**
     * Text to display over media.
     *
     * @type {String}
     * @public
     */
    text: _propTypes2["default"].string,

    /**
     * Aligns the `text` vertically within the component.
     *
     * Allowed values are:
     *
     * * `"center"`, the default, aligns the text in the middle
     * * `"start"` aligns the text to the top
     * * `"end"` aligns the text to the bottom
     *
     * @type {String}
     * @public
     * @default "center"
     */
    textAlign: _propTypes2["default"].string
  },
  defaultProps: {
    mediaComponent: 'video',
    textAlign: 'center'
  },
  styles: {
    css: _MediaOverlayModule["default"],
    className: 'mediaOverlay',
    publicClassNames: ['mediaOverlay', 'image', 'textLayout']
  },
  render: function render(_ref) {
    var css = _ref.css,
        imageOverlay = _ref.imageOverlay,
        mediaComponent = _ref.mediaComponent,
        placeholder = _ref.placeholder,
        source = _ref.source,
        text = _ref.text,
        textAlign = _ref.textAlign,
        rest = _objectWithoutProperties(_ref, ["css", "imageOverlay", "mediaComponent", "placeholder", "source", "text", "textAlign"]);

    return _react["default"].createElement("div", rest, _react["default"].createElement(_Media["default"], {
      autoPlay: true,
      className: css.media,
      controls: false,
      mediaComponent: mediaComponent,
      source: source
    }), imageOverlay ? _react["default"].createElement(_Image["default"], {
      className: css.image,
      placeholder: placeholder,
      sizing: "fill",
      src: imageOverlay
    }) : null, text ? _react["default"].createElement(_Layout.Layout, {
      align: textAlign,
      className: css.textLayout
    }, _react["default"].createElement(_Layout.Cell, {
      component: _Marquee.Marquee,
      alignment: "center",
      className: css.text,
      marqueeOn: "render"
    }, text)) : null);
  }
});
/**
 * A higher-order component that adds Moonstone specific behaviors to `MediaOverlay`.
 *
 * @hoc
 * @memberof moonstone/MediaOverlay
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Slottable.Slottable
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.MediaOverlayBase = MediaOverlayBase;
var MediaOverlayDecorator = (0, _compose["default"])(_Pure["default"], _Spottable["default"], (0, _Slottable["default"])({
  slots: ['source']
}), _Skinnable["default"]);
/**
 * A Moonstone-styled `Media` component.
 *
 * Usage:
 * ```
 * <MediaOverlay>
 *     <source type='' src=''/>
 * </MediaOverlay>
 * ```
 *
 * @class MediaOverlay
 * @memberof moonstone/MediaOverlay
 * @extends moonstone/mediaOverlay.MediaOverlayBase
 * @mixes moonstone/MediaOverlay.MediaOverlayDecorator
 * @ui
 * @public
 */

exports.MediaOverlayDecorator = MediaOverlayDecorator;
var MediaOverlay = MediaOverlayDecorator(MediaOverlayBase);
exports.MediaOverlay = MediaOverlay;
var _default = MediaOverlay;
exports["default"] = _default;