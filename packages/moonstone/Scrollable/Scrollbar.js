import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ScrollbarBase as UiScrollbarBase} from '@enact/ui/Scrollable/Scrollbar';

import ScrollButtons from './ScrollButtons';
import ScrollThumb from './ScrollThumb';

import componentCss from './Scrollbar.less';

/**
 * A Moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
class Scrollbar extends Component {
	static propTypes = /** @lends moonstone/Scrollable.Scrollbar.prototype */ {
		/**
		 * Called when [ScrollThumb]{@link moonstone/Scrollable.ScrollThumb} is updated.
		 *
		 * @type {Function}
		 * @private
		 */
		cbAlertThumb: PropTypes.func,

		/**
		 * If `true`, add the corner between vertical and horizontal scrollbars.
		 *
		 * @type {Booelan}
		 * @default false
		 * @public
		 */
		corner: PropTypes.bool,

		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		vertical: PropTypes.bool
	}

	static defaultProps = {
		corner: false,
		vertical: true
	}

	initScrollbarRef = (ref) => {
		if (ref) {
			const {getContainerRef, showThumb, startHidingThumb, update: uiUpdate} = ref;

			this.getContainerRef = getContainerRef;
			this.showThumb = showThumb;
			this.startHidingThumb = startHidingThumb;
			this.uiUpdate = uiUpdate;
		}
	}

	initScrollButtonsRef = (ref) => {
		if (ref) {
			const {isOneOfScrollButtonsFocused, updateButtons} = ref;

			this.isOneOfScrollButtonsFocused = isOneOfScrollButtonsFocused;
			this.update = (bounds) => {
				updateButtons(bounds);
				this.uiUpdate(bounds);
			};
		}
	}

	render () {
		const {cbAlertThumb, corner, vertical, ...rest} = this.props;

		return (
			<UiScrollbarBase
				corner={corner}
				css={componentCss}
				ref={this.initScrollbarRef}
				vertical={vertical}
				childRenderer={({setScrollThumbRef}) => ( // eslint-disable-line react/jsx-no-bind
					<ScrollButtons
						{...rest}
						ref={this.initScrollButtonsRef}
						vertical={vertical}
						thumbRenderer={() => ( // eslint-disable-line react/jsx-no-bind
							<ScrollThumb
								cbAlertThumb={cbAlertThumb}
								key="thumb"
								setRef={setScrollThumbRef}
								vertical={vertical}
							/>
						)}
					/>
				)}
			/>
		);
	}
}

export default Scrollbar;
export {
	Scrollbar,
	Scrollbar as ScrollbarBase
};
