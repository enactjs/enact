"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderBase = exports.Header = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _util = require("@enact/i18n/util");

var _Layout = require("@enact/ui/Layout");

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _ComponentOverride = _interopRequireDefault(require("@enact/ui/ComponentOverride"));

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _HeaderModule = _interopRequireDefault(require("./Header.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Extract the spacing class to override the title Marquee instance
var marqueeCss = {
  spacing: _HeaderModule["default"].spacing
};

var TitleMarquee = function TitleMarquee(props) {
  return _react["default"].createElement(_Marquee.MarqueeBase, Object.assign({}, props, {
    css: marqueeCss
  }));
}; // Create a <h1> and Marquee component


var MarqueeH1 = (0, _Marquee.MarqueeDecorator)({
  component: TitleMarquee
}, 'h1');
var MarqueeH2 = (0, _Marquee.MarqueeDecorator)('h2');
var CompactTitleBase = (0, _kind["default"])({
  name: 'CompactTitle',
  styles: {
    css: _HeaderModule["default"],
    className: 'compactTitle'
  },
  render: function render(props) {
    delete props.title; // eslint-disable-line enact/prop-types

    delete props.titleBelow; // eslint-disable-line enact/prop-types

    return _react["default"].createElement("div", props);
  }
}); // Marquee decorated container with title and titleBelow as invalidateProps

var CompactTitle = (0, _Marquee.MarqueeDecorator)({
  invalidateProps: ['title', 'titleBelow']
}, CompactTitleBase);
/**
 * A header component for a Panel with a `title`, `titleBelow`, and `subTitleBelow`
 *
 * @class Header
 * @memberof moonstone/Panels
 * @ui
 * @public
 */

var HeaderBase = (0, _kind["default"])({
  name: 'Header',
  propTypes:
  /** @lends moonstone/Panels.Header.prototype */
  {
    /**
     * Centers the `title`, `titleBelow`, and `subTitleBelow`.
     *
     * This setting has no effect on the `type="compact"` header.
     *
     * @type {Boolean}
     * @public
     */
    centered: _propTypes["default"].bool,

    /**
     * Children provided are added to the header-components area.
     *
     * A space for controls which live in the header, apart from the body of the panel view.
     *
     * @type {Element|Element[]}
     */
    children: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].arrayOf(_propTypes["default"].element)]),

    /**
     * Indents then content and removes separator lines.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    fullBleed: _propTypes["default"].bool,

    /**
     * [`Input`]{@link moonstone/Input} element that will replace the `title`.
     *
     * This is also a [slot]{@link ui/Slottable.Slottable}, so it can be referred
     * to as if it were JSX.
     *
     * Note: Only applies to `type="standard"` headers.
     *
     * Example
     * ```
     *  <Header>
     *  	<title>Example Header Title</title>
     *  	<headerInput>
     *  		<Input dismissOnEnter />
     *  	</headerInput>
     *  	<titleBelow>The Adventure Continues</titleBelow>
     *  	<subTitleBelow>The rebels face attack by imperial forces on the ice planet</subTitleBelow>
     *  </Header>
     * ```
     *
     * @type {Node}
     */
    headerInput: _propTypes["default"].node,

    /**
     * Hides the horizontal-rule (line) under the component
     *
     * @type {Boolean}
     * @public
     */
    hideLine: _propTypes["default"].bool,

    /**
     * Determines what triggers the header content to start its animation.
     *
     * @type {('focus'|'hover'|'render')}
     * @default 'hover'
     * @public
     */
    marqueeOn: _propTypes["default"].oneOf(['focus', 'hover', 'render']),

    /**
     * Sub-title displayed at the bottom of the panel.
     *
     * This is a [`slot`]{@link ui/Slottable.Slottable}, so it can be used as a tag-name inside
     * this component.
     *
     * @type {String}
     */
    subTitleBelow: _propTypes["default"].string,

    /**
     * Title of the header.
     *
     * This is a [`slot`]{@link ui/Slottable.Slottable}, so it can be used as a tag-name inside
     * this component.
     *
     * Example:
     * ```
     *  <Header>
     *  	<title>Example Header Title</title>
     *  	<titleBelow>The Adventure Continues</titleBelow>
     *  	<subTitleBelow>The rebels face attack by imperial forces on the ice planet</subTitleBelow>
     *  </Header>
     * ```
     *
     * @type {String}
     */
    title: _propTypes["default"].string,

    /**
     * Text displayed below the title.
     *
     * This is a [`slot`]{@link ui/Slottable.Slottable}, so it can be used as a tag-name inside
     * this component.
     *
     * @type {String}
     */
    titleBelow: _propTypes["default"].string,

    /**
     * Set the type of header to be used.
     *
     * @type {('compact'|'dense'|'standard')}
     * @default 'standard'
     */
    type: _propTypes["default"].oneOf(['compact', 'dense', 'standard'])
  },
  defaultProps: {
    fullBleed: false,
    marqueeOn: 'render',
    // titleAbove: '00',
    type: 'standard'
  },
  styles: {
    css: _HeaderModule["default"],
    className: 'header'
  },
  computed: {
    className: function className(_ref) {
      var centered = _ref.centered,
          fullBleed = _ref.fullBleed,
          hideLine = _ref.hideLine,
          type = _ref.type,
          styler = _ref.styler;
      return styler.append({
        centered: centered,
        fullBleed: fullBleed,
        hideLine: hideLine
      }, type);
    },
    direction: function direction(_ref2) {
      var title = _ref2.title,
          titleBelow = _ref2.titleBelow;
      return (0, _util.isRtlText)(title) || (0, _util.isRtlText)(titleBelow) ? 'rtl' : 'ltr';
    },
    titleBelowComponent: function titleBelowComponent(_ref3) {
      var centered = _ref3.centered,
          marqueeOn = _ref3.marqueeOn,
          titleBelow = _ref3.titleBelow,
          type = _ref3.type;

      switch (type) {
        case 'compact':
          return titleBelow ? _react["default"].createElement("h2", {
            className: _HeaderModule["default"].titleBelow
          }, titleBelow) : null;

        case 'dense':
        case 'standard':
          return _react["default"].createElement(MarqueeH2, {
            className: _HeaderModule["default"].titleBelow,
            marqueeOn: marqueeOn,
            alignment: centered ? 'center' : null
          }, titleBelow != null && titleBelow !== '' ? titleBelow : ' ');
      }
    },
    subTitleBelowComponent: function subTitleBelowComponent(_ref4) {
      var centered = _ref4.centered,
          marqueeOn = _ref4.marqueeOn,
          subTitleBelow = _ref4.subTitleBelow;
      return _react["default"].createElement(MarqueeH2, {
        className: _HeaderModule["default"].subTitleBelow,
        marqueeOn: marqueeOn,
        alignment: centered ? 'center' : null
      }, subTitleBelow != null && subTitleBelow !== '' ? subTitleBelow : ' ');
    },
    titleOrInput: function titleOrInput(_ref5) {
      var centered = _ref5.centered,
          headerInput = _ref5.headerInput,
          marqueeOn = _ref5.marqueeOn,
          title = _ref5.title,
          type = _ref5.type;

      if (headerInput && type === 'standard') {
        return _react["default"].createElement(_Layout.Cell, {
          className: _HeaderModule["default"].headerInput
        }, _react["default"].createElement(_ComponentOverride["default"], {
          component: headerInput,
          css: _HeaderModule["default"],
          size: "large"
        }));
      } else {
        return _react["default"].createElement(_Layout.Cell, null, _react["default"].createElement(MarqueeH1, {
          className: _HeaderModule["default"].title,
          marqueeOn: marqueeOn,
          alignment: centered ? 'center' : null
        }, title));
      }
    }
  },
  render: function render(_ref6) {
    var children = _ref6.children,
        direction = _ref6.direction,
        marqueeOn = _ref6.marqueeOn,
        subTitleBelowComponent = _ref6.subTitleBelowComponent,
        title = _ref6.title,
        titleOrInput = _ref6.titleOrInput,
        titleBelowComponent = _ref6.titleBelowComponent,
        type = _ref6.type,
        rest = _objectWithoutProperties(_ref6, ["children", "direction", "marqueeOn", "subTitleBelowComponent", "title", "titleOrInput", "titleBelowComponent", "type"]);

    delete rest.centered;
    delete rest.fullBleed;
    delete rest.headerInput;
    delete rest.hideLine;
    delete rest.subTitleBelow;
    delete rest.titleBelow;

    switch (type) {
      case 'compact':
        return _react["default"].createElement(_Layout.Layout, Object.assign({
          component: "header",
          "aria-label": title
        }, rest, {
          align: "end"
        }), _react["default"].createElement(_Layout.Cell, {
          component: CompactTitle,
          title: title,
          titleBelow: titleBelowComponent,
          marqueeOn: marqueeOn,
          forceDirection: direction
        }, _react["default"].createElement("h1", {
          className: _HeaderModule["default"].title
        }, title), titleBelowComponent), children ? _react["default"].createElement(_Layout.Cell, {
          shrink: true,
          component: "nav",
          className: _HeaderModule["default"].headerComponents
        }, children) : null);
      // Keeping this block in case we need to add it back after discussing with UX and GUI about future plans.
      // case 'large': return (
      // 	<header {...rest}>
      // 		<div className={css.titleAbove}>{titleAbove}</div>
      // 		<h1 className={css.title}><Marquee>{title}</Marquee></h1>
      // 		<h2 className={css.titleBelow}><Marquee>{titleBelow}</Marquee></h2>
      // 		<h2 className={css.subTitleBelow}><Marquee>{subTitleBelow}</Marquee></h2>
      // 		<nav className={css.headerComponents}>{children}</nav>
      // 	</header>
      // );

      case 'dense':
      case 'standard':
        return _react["default"].createElement(_Layout.Layout, Object.assign({
          component: "header",
          "aria-label": title
        }, rest, {
          orientation: "vertical"
        }), titleOrInput, _react["default"].createElement(_Layout.Cell, {
          shrink: true,
          size: 96
        }, _react["default"].createElement(_Layout.Layout, {
          align: "end"
        }, _react["default"].createElement(_Layout.Cell, {
          className: _HeaderModule["default"].titlesCell
        }, titleBelowComponent, subTitleBelowComponent), children ? _react["default"].createElement(_Layout.Cell, {
          shrink: true,
          component: "nav",
          className: _HeaderModule["default"].headerComponents
        }, children) : null)));
    }
  }
}); // Note that we only export this (even as HeaderBase). HeaderBase is not useful on its own.

exports.HeaderBase = HeaderBase;
var Header = (0, _Slottable["default"])({
  slots: ['headerInput', 'subTitleBelow', 'title', 'titleBelow']
}, (0, _Skinnable["default"])(HeaderBase)); // Set up Header so when it's used in a slottable layout (like Panel), it is automatically
// recognized as this specific slot.

exports.Header = Header;
Header.defaultSlot = 'header';
var _default = Header;
exports["default"] = _default;