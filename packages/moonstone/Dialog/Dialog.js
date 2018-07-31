/**
 * Moonstone styled modal dialog components.
 *
 * @module moonstone/Dialog
 * @exports Dialog
 * @exports DialogBase
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import React from 'react';

import {MarqueeDecorator} from '../Marquee';
import Popup from '../Popup';

import componentCss from './Dialog.less';

/*
 * If two or more Dialogs are rendered on one screen,
 * the same ID can be generated.
 */
const id = Math.random().toString(36).substr(2, 8);

const MarqueeH1 = Uppercase(MarqueeDecorator('h1'));

/**
 * A modal dialog component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [Dialog]{@link moonstone/Dialog.Dialog}.
 *
 * @class DialogBase
 * @memberof moonstone/Dialog
 * @ui
 * @public
 */
const DialogBase = kind({
	name: 'Dialog',

	propTypes: /** @lends moonstone/Dialog.DialogBase.prototype */ {
		/**
		 * Buttons to be included within the header of the component.
		 *
		 * Typically, these buttons would be used to close or take action on the dialog.
		 *
		 * @type {Element|Element[]}
		 * @public
		 */
		buttons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]),

		/**
		 * The casing mode applied to the `title` text.
		 *
		 * @see i18n/Uppercase#casing
		 * @type {String}
		 * @default 'upper'
		 * @public
		 */
		casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

		/**
		 * The contents of the body of the component.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `dialog` - The root class name
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

		/**
		 * Disables animating the dialog on or off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Omits the dividing line between the header and body of the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noDivider: PropTypes.bool,

		/**
		 * Called when the user requests to close the dialog.
		 *
		 * These actions include pressing the cancel key or tapping on the close button. It is the
		 * responsibility of the callback to set the `open` property to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called after the transition to hide the dialog has finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * Opens the dialog.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * The types of scrim shown behind the dialog.
		 *
		 * Allowed values include:
		 * * `'transparent'` - The scrim is invisible but prevents pointer events for components
		 *   below it.
		 * * `'translucent'` - The scrim is visible and both obscures and prevents pointer events
		 *   for components below it.
		 * * `'none'` - No scrim is present and pointer events are allowed outside the dialog.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none']),

		/**
		 * Shows the close button within the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		showCloseButton: PropTypes.bool,

		/**
		 * The primary text displayed within the header
		 *
		 * @type {String}
		 * @public
		 */
		title: PropTypes.string,

		/**
		 * The secondary text displayed below the `title` within the header.
		 *
		 * Will not display if `title` is not set.
		 *
		 * @type {String}
		 * @public
		 */
		titleBelow: PropTypes.string
	},

	defaultProps: {
		casing: 'upper',
		noAnimation: false,
		noDivider: false,
		open: false,
		showCloseButton: false,
		scrimType: 'translucent'
	},

	styles: {
		css: componentCss,
		className: 'dialog',
		publicClassNames: ['dialog']
	},

	computed: {
		className: ({noDivider, styler}) => styler.append({showDivider: !noDivider}),
		titleBelow: ({title, titleBelow}) => title ? titleBelow : ''
	},

	render: ({buttons, casing, css, children, title, titleBelow, ...rest}) => {
		delete rest.noDivider;

		return (
			<Popup {...rest} aria-labelledby={`${id}_title ${id}_titleBelow ${id}_children ${id}_buttons`} css={css}>
				<div className={css.titleWrapper}>
					<div className={css.titleBlock}>
						<MarqueeH1 casing={casing} marqueeOn="render" marqueeOnRenderDelay={5000} className={css.title} id={`${id}_title`}>
							{title}
						</MarqueeH1>
						<h2 className={css.titleBelow} id={`${id}_titleBelow`}>
							{titleBelow}
						</h2>
					</div>
					<div className={css.buttons} id={`${id}_buttons`}>
						{buttons}
					</div>
				</div>
				<div className={css.body} id={`${id}_children`}>
					{children}
				</div>
			</Popup>
		);
	}
});

/**
 * A modal dialog component, ready to use in Moonstone applications.
 *
 * `Dialog` may be used to interrupt a workflow to receive feedback from the user. The dialong
 * consists of a title, a subtitle, a message, and an area for additional
 * [buttons]{@link moonstone/Dialog.Dialog.buttons}.
 *
 * Usage:
 * ```
 * <Dialog
 *   open={this.state.open}
 *   showCloseButton
 *   title="An Important Dialog"
 *   titleBelow="Some important context to share about the purpose"
 * >
 *   <BodyText>You can include other Moonstone components here. </BodyText>
 *   <buttons>
 *     <Button>Button 1</Button>
 *     <Button>Button 2</Button>
 *   </buttons>
 * </Dialog>
 * ```
 *
 * @class Dialog
 * @memberof moonstone/Dialog
 * @extends moonstone/Dialog.DialogBase
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const Dialog = Slottable(
	{slots: ['title', 'titleBelow', 'buttons']},
	DialogBase
);

export default Dialog;
export {
	Dialog,
	DialogBase
};
