import ApiDecorator from '@enact/core/internal/ApiDecorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ScrollbarBase as UiScrollbarBase} from '@enact/ui/Scrollable/Scrollbar';

import ScrollButtons from './ScrollButtons';
import ScrollThumb from './ScrollThumb';

import componentCss from './Scrollbar.less';

/**
 * A Moonstone-styled base component for [Scrollable]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @class ScrollbarBase
 * @memberof moonstone/Scrollable
 * @extends ui/ScrollbarBase
 * @ui
 * @private
 */
class ScrollbarBase extends Component {
	static displayName = 'ScrollbarBase'

	static propTypes = /** @lends moonstone/Scrollable.Scrollbar.prototype */ {
		/**
		 * Called when [ScrollThumb]{@link moonstone/Scrollable.ScrollThumb} is updated.
		 *
		 * @type {Function}
		 * @private
		 */
		cbAlertThumb: PropTypes.func,

		/**
		 * Adds the corner between vertical and horizontal scrollbars.
		 *
		 * @type {Booelan}
		 * @default false
		 * @public
		 */
		corner: PropTypes.bool,

		/**
		 * `true` if rtl, `false` if ltr.
		 * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Registers the ScrollButtons component with an
		 * {@link core/internal/ApiDecorator.ApiDecorator}.
		 *
		 * @type {Function}
		 * @private
		 */
		setApiProvider: PropTypes.func,

		/**
		 * The scrollbar will be oriented vertically.
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

	constructor (props) {
		super(props);

		if (props.setApiProvider) {
			props.setApiProvider(this);
		}
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
				childRenderer={({initScrollThumbRef}) => ( // eslint-disable-line react/jsx-no-bind
					<ScrollButtons
						{...rest}
						ref={this.initScrollButtonsRef}
						vertical={vertical}
						thumbRenderer={() => ( // eslint-disable-line react/jsx-no-bind
							<ScrollThumb
								cbAlertThumb={cbAlertThumb}
								key="thumb"
								setRef={initScrollThumbRef}
								vertical={vertical}
							/>
						)}
					/>
				)}
			/>
		);
	}
}

/**
 * A Moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
const Scrollbar = ApiDecorator(
	{api: [
		'getContainerRef',
		'isOneOfScrollButtonsFocused',
		'showThumb',
		'startHidingThumb',
		'update'
	]}, ScrollbarBase
);
Scrollbar.displayName = 'Scrollbar';

export default Scrollbar;
export {
	Scrollbar,
	Scrollbar as ScrollbarBase
};
