/**
 * Exports the {@link moonstone/Dialog.Dialog}
 *
 * @module moonstone/Dialog
 */

import kind from '@enact/core/kind';
import React from 'react';
import Slottable from '@enact/ui/Slottable';

import Popup from '../Popup';

import css from './Dialog.less';

/**
 * {@link moonstone/Dialog.DialogBase} is a modal component with a title, a subtitle, a
 * message, and an area for additional controls.
 *
 * @class DialogBase
 * @memberOf moonstone/Dialog
 * @ui
 * @public
 */
const DialogBase = kind({
	name: 'Dialog',

	propTypes: {
		/**
		 * Buttons, typically to close or take action in the dialog.
		 *
		 * @type {React.node}
		 * @public
		 */
		buttons: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.element),
			React.PropTypes.element
		]),

		/**
		 * The element(s) to be displayed in the body of the Dialog.
		 *
		 * @type {Node}
		 * @public
		 */
		children: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.element),
			React.PropTypes.element
		]),

		/**
		 * Title of the header
		 *
		 * @type {String}
		 * @public
		 */
		title: React.PropTypes.string,

		/**
		 * Text displayed below the title
		 *
		 * @type {String}
		 * @public
		 */
		titleBelow: React.PropTypes.string,

		/**
		 * Should the dialog use a divider line to separate the titles from the dialog body?
		 *
		 * @type {Boolean}
		 * @public
		 */
		useDivider: React.PropTypes.bool
	},

	defaultProps: {
		anchor: {bottom: 0},
		open: false
	},

	styles: {
		css,
		className: 'dialog'
	},

	computed: {
		className: ({useDivider, styler}) => styler.append({useDivider})
	},

	render: ({buttons, children, title, titleBelow, ...rest}) => {
		delete rest.useDivider;

		return (
			<Popup {...rest}>
				<div className={css.titleWrapper}>
					<h1 className={css.title}>
						{title}
					</h1>
					<h2 className={css.titleBelow}>
						{titleBelow}
					</h2>
				</div>
				<div className={css.body}>
					{children}
				</div>
				<div className={css.buttons}>
					{buttons}
				</div>
			</Popup>
		);
	}
});


/**
 * {@link moonstone/Dialog.Dialog} is modal component with a title, a subtitle, a
 * message, and an area for additional controls.
 *
 * @class Dialog
 * @memberOf moonstone/Dialog
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const Dialog = Slottable({slots: ['title', 'titleBelow', 'buttons']}, DialogBase);

export default Dialog;
export {Dialog, DialogBase};
