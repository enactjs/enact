import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import {isRtlText} from '@enact/i18n/util';
import {Layout, Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import ComponentOverride from '@enact/ui/ComponentOverride';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import css from './Header.module.less';

// Create a <h1> and Marquee component
const MarqueeH1 = MarqueeDecorator('h1');
const MarqueeH2 = MarqueeDecorator('h2');

const CompactTitleBase = kind({
	name: 'CompactTitle',
	styles: {
		css,
		className: 'compactTitle'
	},
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
 * A header component for a Panel with a `title`, `titleBelow`, and `subTitleBelow`
 *
 * @class Header
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const HeaderBase = kind({
	name: 'Header',

	propTypes: /** @lends moonstone/Panels.Header.prototype */ {
		/**
		 * Centers the `title`, `titleBelow`, and `subTitleBelow`.
		 *
		 * This setting has no effect on the `type="compact"` header.
		 *
		 * @type {Boolean}
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * Children provided are added to the header-components area.
		 *
		 * A space for controls which live in the header, apart from the body of the panel view.
		 *
		 * @type {Element|Element[]}
		 */
		children: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]),

		/**
		 * Indents then content and removes separator lines.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		fullBleed: PropTypes.bool,

		/**
		 * [`Input`]{@link moonstone/Input} element that will replace the `title`.
		 *
		 * This is also a [slot]{@link ui/Slottable.Slottable}, so it can be referred
		 * to as if it were JSX.
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
		headerInput: PropTypes.node,

		/**
		 * Determines what triggers the header content to start its animation.
		 *
		 * * Values: `'focus'`, `'hover'` and `'render'`.
		 *
		 * @type {String}
		 * @default 'hover'
		 * @public
		 */
		marqueeOn: PropTypes.oneOf(['focus', 'hover', 'render']),

		/**
		 * Sub-title displayed at the bottom of the panel.
		 *
		 * This is a [`slot`]{@link ui/Slottable.Slottable}, so it can be used as a tag-name inside
		 * this component.
		 *
		 * @type {String}
		 */
		subTitleBelow: PropTypes.string,

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
		title: PropTypes.string,

		/**
		 * Text displayed below the title.
		 *
		 * This is a [`slot`]{@link ui/Slottable.Slottable}, so it can be used as a tag-name inside
		 * this component.
		 *
		 * @type {String}
		 */
		titleBelow: PropTypes.string,

		/**
		 * Set the type of header to be used.
		 *
		 * * Values: `'standard'` or `'compact'`.
		 *
		 * @type {String}
		 * @default 'standard'
		 */
		type: PropTypes.oneOf(['compact', 'standard'])
	},

	defaultProps: {
		fullBleed: false,
		marqueeOn: 'hover',
		// titleAbove: '00',
		type: 'standard'
	},

	styles: {
		css,
		className: 'header'
	},

	computed: {
		className: ({centered, fullBleed, type, styler}) => styler.append({centered, fullBleed}, type),
		direction: ({title, titleBelow}) => isRtlText(title) || isRtlText(titleBelow) ? 'rtl' : 'ltr',
		titleBelowComponent: ({centered, marqueeOn, titleBelow, type}) => {
			switch (type) {
				case 'compact':
					return titleBelow ? <h2 className={css.titleBelow}>{titleBelow}</h2> : null;
				case 'standard':
					return <MarqueeH2 className={css.titleBelow} marqueeOn={marqueeOn} alignment={centered ? 'center' : null}>{(titleBelow != null && titleBelow !== '') ? titleBelow : ' '}</MarqueeH2>;
			}
		},
		subTitleBelowComponent: ({centered, marqueeOn, subTitleBelow}) => {
			return <MarqueeH2 className={css.subTitleBelow} marqueeOn={marqueeOn} alignment={centered ? 'center' : null}>{(subTitleBelow != null && subTitleBelow !== '') ? subTitleBelow : ' '}</MarqueeH2>;
		},
		titleOrInput: ({centered, headerInput, marqueeOn, title}) => {
			if (headerInput) {
				return (
					<Cell className={css.headerInput}>
						<ComponentOverride
							component={headerInput}
							css={css}
							size="large"
						/>
					</Cell>
				);
			} else {
				return (
					<Cell component={MarqueeH1} className={css.title} marqueeOn={marqueeOn} alignment={centered ? 'center' : null}>
						{title}
					</Cell>
				);
			}
		}
	},

	render: ({children, direction, marqueeOn, subTitleBelowComponent, title, titleOrInput, /* titleAbove, */titleBelowComponent, type, ...rest}) => {
		delete rest.centered;
		delete rest.fullBleed;
		delete rest.headerInput;
		delete rest.subTitleBelow;
		delete rest.titleBelow;

		switch (type) {
			case 'compact': return (
				<Layout component="header" aria-label={title} {...rest} align="end">
					<Cell component={CompactTitle} title={title} titleBelow={titleBelowComponent} marqueeOn={marqueeOn} forceDirection={direction}>
						<h1 className={css.title}>{title}</h1>
						{titleBelowComponent}
					</Cell>
					{children ? <Cell shrink component="nav" className={css.headerComponents}>{children}</Cell> : null}
				</Layout>
			);
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
			case 'standard': return (
				<Layout component="header" aria-label={title} {...rest} orientation="vertical">
					{titleOrInput}
					<Cell shrink size={96}>
						<Layout align="end">
							<Cell>
								{titleBelowComponent}
								{subTitleBelowComponent}
							</Cell>
							{children ? <Cell shrink component="nav" className={css.headerComponents}>{children}</Cell> : null}
						</Layout>
					</Cell>
				</Layout>
			);
		}
	}
});

// Note that we only export this (even as HeaderBase). HeaderBase is not useful on its own.
const Header = Slottable({slots: ['headerInput', 'subTitleBelow', 'title', 'titleBelow']}, Skinnable(HeaderBase));

// Set up Header so when it's used in a slottable layout (like Panel), it is automatically
// recognized as this specific slot.
Header.defaultSlot = 'header';

export default Header;
export {Header, HeaderBase};
