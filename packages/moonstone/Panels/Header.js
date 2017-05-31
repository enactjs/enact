import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Uppercase from '@enact/i18n/Uppercase';
import {isRtlText} from '@enact/i18n/util';
import Slottable from '@enact/ui/Slottable';

import {MarqueeDecorator, MarqueeText} from '../Marquee';
import Skinnable from '../Skinnable';

import css from './Header.less';

// Create a <h1> and Marquee component that support the uppercase attribute
const UppercaseH1 = Uppercase('h1');		// Used by compact header, which provides its own inline strings and tags for marqueeing
const MarqueeH2 = MarqueeDecorator('h2');
const HeaderH1 = Uppercase(MarqueeDecorator('h1'));

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
		 * Sub-title displayed at the bottom of the panel
		 *
		 * @type {String}
		 */
		subTitleBelow: PropTypes.string,

		/**
		 * Title of the header
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
		 * Text displayed below the title
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
		titleBelowComponent: ({titleBelow, type}) => {
			switch (type) {
				case 'compact':
					return titleBelow ? <h2 className={css.titleBelow}>{titleBelow}</h2> : null;
				case 'standard':
					return titleBelow ? <MarqueeH2 className={css.titleBelow} marqueeOn="hover">{titleBelow}</MarqueeH2> : null;
			}
		},
		subTitleBelowComponent: ({subTitleBelow}) => {
			return subTitleBelow ? <MarqueeH2 className={css.subTitleBelow} marqueeOn="hover">{subTitleBelow}</MarqueeH2> : null;
		}
	},

	render: ({casing, children, direction, preserveCase, subTitleBelowComponent, title, /* titleAbove, */titleBelowComponent, type, ...rest}) => {
		delete rest.fullBleed;
		delete rest.subTitleBelow;
		delete rest.titleBelow;

		switch (type) {
			case 'compact': return (
				<header aria-label={title} {...rest}>
					<MarqueeText className={css.headerCell} marqueeOn="hover" forceDirection={direction}>
						<UppercaseH1 casing={casing} className={css.title} preserveCase={preserveCase}>{title}</UppercaseH1>
						{titleBelowComponent}
					</MarqueeText>
					<nav className={css.headerComponents}>{children}</nav>
				</header>
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
				<header aria-label={title} {...rest}>
					<HeaderH1 casing={casing} className={css.title} preserveCase={preserveCase} marqueeOn="hover">
						{title}
					</HeaderH1>
					<div className={css.headerRow}>
						<div className={css.headerCell}>
							{titleBelowComponent}
							{subTitleBelowComponent}
						</div>
						<nav className={css.headerComponents}>{children}</nav>
					</div>
				</header>
			);
		}
	}
});

// Note that we only export this (even as HeaderBase).  HeaderBase is not useful on its own.
const Header = Slottable({slots: ['subTitleBelow', /* 'titleAbove', */'title', 'titleBelow']}, Skinnable(HeaderBase));

// Set up Header so when it's used in a slottable layout (like Panel), it is automatically
// recognized as this specific slot.
Header.defaultSlot = 'header';

export default Header;
export {Header, Header as HeaderBase};
