/**
 * Exports the {@link module:@enact/moonstone/Dialog~Dialog}
 *
 * @module @enact/moonstone/Dialog
 */

import kind from '@enact/core/kind';
import React from 'react';
import Slottable from '@enact/ui/Slottable';

import Popup from '../Popup';

import css from './Dialog.less';

/**
 * {@link module:@enact/moonstone/Dialog~Dialog}
 *
 * @class Dialog
 * @ui
 * @public
 */
const DialogBase = kind({
	name: 'Dialog',

	propTypes: {
		/**
		 * Buttons, typically to close or take action in the dialog.
		 *
		 * @type {String}
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
		 */
		title: React.PropTypes.string,

		/**
		 * Text displayed below the title
		 *
		 * @type {String}
		 */
		titleBelow: React.PropTypes.string,

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

const Dialog = Slottable({slots: ['title', 'titleBelow', 'buttons']}, DialogBase);

export default Dialog;
export {Dialog, DialogBase};
