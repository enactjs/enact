"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "icons", {
  enumerable: true,
  get: function get() {
    return _IconList["default"];
  }
});
exports.IconDecorator = exports.IconBase = exports.Icon = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Icon = _interopRequireDefault(require("@enact/ui/Icon"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _IconList = _interopRequireDefault(require("./IconList.js"));

var _IconModule = _interopRequireDefault(require("./Icon.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Renders a moonstone-styled icon without any behavior.
 *
 * @class IconBase
 * @memberof moonstone/Icon
 * @extends ui/Icon.Icon
 * @ui
 * @public
 */
var IconBase = (0, _kind["default"])({
  name: 'Icon',
  propTypes:
  /** @lends moonstone/Icon.IconBase.prototype */
  {
    /**
     * The size of the icon.
     *
     * @type {('large'|'small')}
     * @default 'small'
     * @public
     */
    size: _propTypes["default"].string
  },
  defaultProps: {
    size: 'small'
  },
  render: function render(props) {
    return _Icon["default"].inline(_objectSpread({}, props, {
      css: _IconModule["default"],
      iconList: _IconList["default"]
    }));
  }
}); // Let's find a way to import this list directly, and bonus feature, render our icons in the docs
// next to their names.

/**
 * An object whose keys can be used as the child of an [Icon]{@link moonstone/Icon.Icon} component.
 *
 * List of Icons:
 * ```
 * plus
 * minus
 * arrowhookleft
 * arrowhookright
 * ellipsis
 * check
 * circle
 * stop
 * play
 * pause
 * forward
 * backward
 * skipforward
 * skipbackward
 * pauseforward
 * pausebackward
 * pausejumpforward
 * pausejumpbackward
 * jumpforward
 * jumpbackward
 * denselist
 * bulletlist
 * list
 * drawer
 * arrowlargedown
 * arrowlargeup
 * arrowlargeleft
 * arrowlargeright
 * arrowsmallup
 * arrowsmalldown
 * arrowsmallleft
 * arrowsmallright
 * closex
 * search
 * rollforward
 * rollbackward
 * exitfullscreen
 * fullscreen
 * arrowshrinkleft
 * arrowshrinkright
 * arrowextend
 * arrowshrink
 * flag
 * funnel
 * trash
 * star
 * hollowstar
 * halfstar
 * gear
 * plug
 * lock
 * forward15
 * back15
 * continousplay
 * playlist
 * resumeplay
 * image
 * audio
 * music
 * languages
 * cc
 * ccon
 * ccoff
 * sub
 * recordings
 * livezoom
 * liveplayback
 * liveplaybackoff
 * repeat
 * repeatoff
 * series
 * repeatdownload
 * view360
 * view360off
 * info
 * cycle
 * bluetoothoff
 * verticalellipsis
 * arrowcurveright
 * picture
 * home
 * warning
 * scroll
 * densedrawer
 * starminus
 * liverecord
 * liveplay
 * contrast
 * edit
 * trashlock
 * arrowrightskip
 * volumecycle
 * movecursor
 * refresh
 * question
 * questionreversed
 * s
 * repeatone
 * repeatall
 * repeatnone
 * speakers
 * koreansubtitles
 * chinesesubtitles
 * arrowleftprevious
 * searchfilled
 * zoomin
 * zoomout
 * playlistadd
 * files
 * arrowupdown
 * brightness
 * download
 * playlistedit
 * font
 * musicon
 * musicoff
 * liverecordone
 * liveflagone
 * shuffle
 * sleep
 * notification
 * notificationoff
 * checkselection
 * ```
 *
 * @name iconList
 * @memberof moonstone/Icon
 * @constant
 * @type {Object}
 * @public
 */

/**
 * Moonstone-specific behaviors to apply to [IconBase]{@link moonstone/Icon.IconBase}.
 *
 * @hoc
 * @memberof moonstone/Icon
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.IconBase = IconBase;
var IconDecorator = (0, _compose["default"])(_Pure["default"], _Skinnable["default"]);
/**
 * A Moonstone-styled icon.
 *
 * @class Icon
 * @memberof moonstone/Icon
 * @extends moonstone/Icon.IconBase
 * @mixes moonstone/Icon.IconDecorator
 * @ui
 * @public
 */

exports.IconDecorator = IconDecorator;
var Icon = IconDecorator(IconBase);
exports.Icon = Icon;
var _default = Icon;
exports["default"] = _default;