import kind from 'enact-core/kind';
import React from 'react';
import Uppercase from 'enact-i18n/Uppercase';
import Slottable from 'enact-ui/Slottable';
import Marquee from 'enact-moonstone/Marquee';

import css from './Header.less';

// Create a Marquee component that supports the uppercase attribute
const UppercaseMarquee = Uppercase(Marquee);

/**
 * A visual header component for a Panel with a title, titleAbove, titleBelow, and subTitleBelow
 *
 * @class Header
 * @see module:enact-i18n/Uppercase~Uppercase
 */
const HeaderBase = kind({
	name: 'Header',

	propTypes: {
		/**
		 * Children provided are added to the header-components area. A space for controls which
		 * live in the header, apart from the body of the panel view.
		 *
		 * @type {String}
		 */
		children: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.element),
			React.PropTypes.element
		]),

		/**
		 * When true, the case of the [`title`]{@link module:moonstone/Header~Header#title} will
		 * remain unchanged.
		 * Uses [Uppercase HOC]{@link module:enact-i18n/Uppercase~Uppercase} and mirrors the
		 * [preserveCase prop]{@link module:enact-i18n/Uppercase~Uppercase#preserveCase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		preserveCase: React.PropTypes.bool,

		/**
		 * Sub-title displayed at the bottom of the panel
		 *
		 * @type {String}
		 */
		subTitleBelow: React.PropTypes.string,

		/**
		 * Title of the header
		 *
		 * @type {String}
		 */
		title: React.PropTypes.string,

		/**
		 * Text displayed above the title
		 *
		 * @type {String}
		 */
		titleAbove: React.PropTypes.string,

		/**
		 * Text displayed below the title
		 *
		 * @type {String}
		 */
		titleBelow: React.PropTypes.string,

		/**
		 * Set the type of header to be used. `standard` or `compact`.
		 *
		 * @type {String}
		 * @default 'standard'
		 */
		type: React.PropTypes.oneOf(['compact', 'standard'])
	},

	defaultProps: {
		preserveCase: false,
		titleAbove: '00',
		type: 'standard'
	},

	styles: {
		css,
		className: 'header'
	},

	computed: {
		className: ({type, styler}) => styler.append(type)
	},

	render: ({children, preserveCase, styler, subTitleBelow, title, titleAbove, titleBelow, type, ...rest}) => {
		switch (type) {
			case 'compact': return (
				<header {...rest}>
					<h1 className={css.title}><UppercaseMarquee preserveCase={preserveCase}>{title}</UppercaseMarquee></h1>
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
				<header {...rest}>
					<h1 className={css.title}><UppercaseMarquee preserveCase={preserveCase}>{title}</UppercaseMarquee></h1>
					<div className={css.headerRow}>
						<div className={css.headerCell}>
							<h2 className={css.titleBelow}><Marquee>{titleBelow}</Marquee></h2>
							<h2 className={css.subTitleBelow}><Marquee>{subTitleBelow}</Marquee></h2>
						</div>
						<nav className={css.headerComponents}>{children}</nav>
					</div>
				</header>
			);
		}
	}
});

const Header = Slottable({slots: ['subTitleBelow', 'titleAbove', 'title', 'titleBelow']}, HeaderBase);

// Set up Header so when it's used in a slottable layout (like Panel), it is automatically
// recognized as this specific slot.
Header.defaultSlot = 'header';

export default Header;
export {Header, Header as HeaderBase};
