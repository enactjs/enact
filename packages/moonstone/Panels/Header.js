import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Uppercase from '@enact/i18n/Uppercase';
import {isRtlText} from '@enact/i18n/util';
import {Layout, Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import ComponentOverride from '@enact/ui/ComponentOverride';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import css from './Header.less';

// Create a <h1> and Marquee component that support the uppercase attribute
const UppercaseH1 = Uppercase('h1');		// Used by compact header, which provides its own inline strings and tags for marqueeing
const MarqueeH2 = MarqueeDecorator('h2');
const HeaderH1 = Uppercase(MarqueeDecorator('h1'));

const CompactTitleBase = kind({
	name: 'CompactTitle',
	render: (props) => {
		delete props.title;
		delete props.titleBelow;

		return (
			<div {...props} />
		);
	}
});

// Marquee decorated container with title and titleBelow as invalidateProps
const CompactTitle = MarqueeDecorator({invalidateProps: ['title', 'titleBelow']}, CompactTitleBase);

/**
 * A visual header component for a Panel with a title, titleAbove, titleBelow, and subTitleBelow
 *
 * @class Header
 * @memberof moonstone/Panels
 * @see i18n/Uppercase.Uppercase
 * @ui
 * @public
 */
const HeaderBase = kind({
	name: 'Header',

	propTypes: /** @lends moonstone/Panels.Header.prototype */ {
		/**
		 * Configures the mode of uppercasing for the [`title`]{@link moonstone/Panels.Header#title}.
		 *
		 * @see i18n/Uppercase#casing
		 * @type {String}
		 * @default 'upper'
		 * @public
		 */
		casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

		/**
		 * Children provided are added to the header-components area. A space for controls which
		 * live in the header, apart from the body of the panel view.
		 *
		 * @type {String}
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.element
		]),

		/**
		 * When `true`, the header content is indented and the header lines are removed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		fullBleed: PropTypes.bool,

		/**
		 * Converts the title text of a "standard" Header into an Input, which you provide through
		 * this property. This is also a "slot" so it can be referred to as if it were JSX.
		 *
		 * Example:
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
		 * @type {[type]}
		 */
		headerInput: PropTypes.node,

		/**
		 * Determines what triggers the header content to start its animation. Valid values are
		 * `'focus'`, `'hover'` and `'render'`. The default is `'hover'`.
		 *
		 * @type {String}
		 * @default 'hover'
		 * @public
		 */
		marqueeOn: PropTypes.oneOf(['focus', 'hover', 'render']),

		/**
		 * When true, the case of the [`title`]{@link moonstone/Panels.Header#title} will
		 * remain unchanged.
		 * Uses [Uppercase HOC]{@link i18n/Uppercase.Uppercase} and mirrors the
		 * [preserveCase prop]{@link i18n/Uppercase.Uppercase#preserveCase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @deprecated replaced by `casing`
		 * @public
		 */
		preserveCase: PropTypes.bool,

		/**
		 * Sub-title displayed at the bottom of the panel. This is a "slot", so it can be used as a
		 * tag-name inside this component, which improves readability.
		 *
		 * @type {String}
		 */
		subTitleBelow: PropTypes.string,

		/**
		 * Title of the header. This is a "slot", so it can be used as a tag-name inside this
		 * component, which improves readability.
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
		title: PropTypes.string,

		// /**
		//  * Text displayed above the title
		//  *
		//  * @type {String}
		//  */
		// titleAbove: PropTypes.string,

		/**
		 * Text displayed below the title. This is a "slot", so it can be used as a tag-name inside
		 * this component, which improves readability.
		 *
		 * @type {String}
		 */
		titleBelow: PropTypes.string,

		/**
		 * Set the type of header to be used. `standard` or `compact`.
		 *
		 * @type {String}
		 * @default 'standard'
		 */
		type: PropTypes.oneOf(['compact', 'standard'])
	},

	defaultProps: {
		casing: 'upper',
		fullBleed: false,
		marqueeOn: 'hover',
		preserveCase: false,
		// titleAbove: '00',
		type: 'standard'
	},

	styles: {
		css,
		className: 'header'
	},

	computed: {
		className: ({fullBleed, type, styler}) => styler.append({fullBleed}, type),
		direction: ({title, titleBelow}) => isRtlText(title) || isRtlText(titleBelow) ? 'rtl' : 'ltr',
		titleBelowComponent: ({marqueeOn, titleBelow, type}) => {
			switch (type) {
				case 'compact':
					return titleBelow ? <h2 className={css.titleBelow}>   {titleBelow}</h2> : null;
				case 'standard':
					return <MarqueeH2 className={css.titleBelow} marqueeOn={marqueeOn}>{(titleBelow != null && titleBelow !== '') ? titleBelow : ' '}</MarqueeH2>;
			}
		},
		subTitleBelowComponent: ({marqueeOn, subTitleBelow}) => {
			return <MarqueeH2 className={css.subTitleBelow} marqueeOn={marqueeOn}>{(subTitleBelow != null && subTitleBelow !== '') ? subTitleBelow : ' '}</MarqueeH2>;
		},
		titleOrInput: ({casing, headerInput, marqueeOn, preserveCase, title}) => {
			if (headerInput) {
				return (
					<Cell>
						<ComponentOverride
							component={headerInput}
							css={css}
						/>
					</Cell>
				);
			} else {
				return (
					<Cell component={HeaderH1} casing={casing} className={css.title} preserveCase={preserveCase} marqueeOn={marqueeOn}>
						{title}
					</Cell>
				);
			}
		}
	},

	render: ({casing, children, direction, marqueeOn, preserveCase, subTitleBelowComponent, title, titleOrInput, /* titleAbove, */titleBelowComponent, type, ...rest}) => {
		delete rest.fullBleed;
		delete rest.headerInput;
		delete rest.subTitleBelow;
		delete rest.titleBelow;

		switch (type) {
			case 'compact': return (
				<Layout component="header" aria-label={title} {...rest} align="end">
					<Cell component={CompactTitle} title={title} titleBelow={titleBelowComponent} marqueeOn={marqueeOn} forceDirection={direction}>
						<UppercaseH1 casing={casing} className={css.title} preserveCase={preserveCase}>{title}</UppercaseH1>
						{titleBelowComponent}
					</Cell>
					<Cell shrink component="nav" className={css.headerComponents}>{children}</Cell>
				</Layout>
			);
			// Keeping this block in case we need to add it back after discussing with UX and GUI about future plans.
			// case 'large': return (
			// 	<header {...rest}>
			// 		<div className={css.titleAbove}>{titleAbove}</div>
			// 		<h1 className={css.title}><UppercaseMarquee preserveCase={preserveCase}>{title}</UppercaseMarquee></h1>
			// 		<h2 className={css.titleBelow}><Marquee>{titleBelow}</Marquee></h2>
			// 		<h2 className={css.subTitleBelow}><Marquee>{subTitleBelow}</Marquee></h2>
			// 		<nav className={css.headerComponents}>{children}</nav>
			// 	</header>
			// );
			case 'standard': return (
				<Layout component="header" aria-label={title} {...rest} orientation="vertical">
					{titleOrInput}
					<Cell shrink size={78}>
						<Layout align="end">
							<Cell>
								{titleBelowComponent}
								{subTitleBelowComponent}
							</Cell>
							<Cell shrink component="nav" className={css.headerComponents}>{children}</Cell>
						</Layout>
					</Cell>
				</Layout>
			);
		}
	}
});

// Note that we only export this (even as HeaderBase).  HeaderBase is not useful on its own.
const Header = Slottable({slots: ['headerInput', 'subTitleBelow', /* 'titleAbove', */'title', 'titleBelow']}, Skinnable(HeaderBase));

// Set up Header so when it's used in a slottable layout (like Panel), it is automatically
// recognized as this specific slot.
Header.defaultSlot = 'header';

export default Header;
export {Header, Header as HeaderBase};
