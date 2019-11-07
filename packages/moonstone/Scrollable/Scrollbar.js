import ApiDecorator from '@enact/core/internal/ApiDecorator';
import {ScrollbarBase as UiScrollbarBase} from '@enact/ui/Scrollable/Scrollbar';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ScrollButtons from './ScrollButtons';
import ScrollThumb from './ScrollThumb';
import Skinnable from '../Skinnable';

import componentCss from './Scrollbar.module.less';

/**
 * A Moonstone-styled scroller base component.
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
		 * Client size of the container; valid values are an object that has `clientWidth` and `clientHeight`.
		 *
		 * @type {Object}
		 * @property {Number}    clientHeight    The client height of the list.
		 * @property {Number}    clientWidth    The client width of the list.
		 * @public
		 */
		clientSize: PropTypes.shape({
			clientHeight: PropTypes.number.isRequired,
			clientWidth: PropTypes.number.isRequired
		}),

		/**
		 * Adds the corner between vertical and horizontal scrollbars.
		 *
		 * @type {Booelan}
		 * @default false
		 * @public
		 */
		corner: PropTypes.bool,

		/**
		 * The distance that a list should move first when scrolling
		 *
		 * @type {Number}
		 * @public
		 */
		moveDistance: PropTypes.number,

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

		this.scrollbarRef = React.createRef();
		this.scrollButtonsRef = React.createRef();
		this.moveDistanceRef = React.createRef();
	}

	componentDidMount () {
		const {getContainerRef, showThumb, startHidingThumb, update: uiUpdate} = this.scrollbarRef.current;

		this.getContainerRef = getContainerRef;
		this.showThumb = showThumb;
		this.startHidingThumb = startHidingThumb;
		this.uiUpdate = uiUpdate;

		const {isOneOfScrollButtonsFocused, updateButtons, focusOnButton} = this.scrollButtonsRef.current;

		this.isOneOfScrollButtonsFocused = isOneOfScrollButtonsFocused;
		this.update = (bounds) => {
			updateButtons(bounds);
			this.uiUpdate(bounds);
		};
		this.focusOnButton = focusOnButton;

		this.syncHeight = (moveDistance, scrollPosition) => {
			if (this.moveDistanceRef.current && typeof window !== 'undefined') {
				const
					height = parseInt(window.getComputedStyle(this.moveDistanceRef.current).getPropertyValue('height')),
					thumbRef = this.getContainerRef(),
					nextButtonRef = this.scrollButtonsRef.current.nextButtonRef;

				// To scale the thumb height depending on the VirtualList position
				thumbRef.current.style.transform =
					'scale3d(1, ' + (height - moveDistance + scrollPosition - 120) / (height - moveDistance - 120) + ', 1)';

				// To move the next scroll bar button depending on the VirtualList position
				nextButtonRef.current.style.transform =
					'translate3d(0, ' + (scrollPosition - moveDistance) + 'px, 0)';
			}
		};
	}

	render () {
		const {cbAlertThumb, clientSize, corner, moveDistance, vertical, ...rest} = this.props;

		if (moveDistance) {
			return (
				<div className={componentCss.moveDistance} ref={this.moveDistanceRef}>
					<ScrollButtons
						{...rest}
						ref={this.scrollButtonsRef}
						vertical={vertical}
					/>
					<UiScrollbarBase
						corner={corner}
						clientSize={clientSize}
						css={componentCss}
						ref={this.scrollbarRef}
						style={{height: 'calc(100% - ' + (moveDistance + 120) + 'px)'}}
						vertical={vertical}
						childRenderer={({thumbRef}) => ( // eslint-disable-line react/jsx-no-bind
							<ScrollThumb
								cbAlertThumb={cbAlertThumb}
								key="thumb"
								ref={thumbRef}
								vertical={vertical}
							/>
						)}
					/>
				</div>
			);
		}

		return (
			<UiScrollbarBase
				corner={corner}
				clientSize={clientSize}
				css={componentCss}
				ref={this.scrollbarRef}
				vertical={vertical}
				childRenderer={({thumbRef}) => ( // eslint-disable-line react/jsx-no-bind
					<ScrollButtons
						{...rest}
						ref={this.scrollButtonsRef}
						vertical={vertical}
						thumbRenderer={() => ( // eslint-disable-line react/jsx-no-bind
							<ScrollThumb
								cbAlertThumb={cbAlertThumb}
								key="thumb"
								ref={thumbRef}
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
		'focusOnButton',
		'getContainerRef',
		'isOneOfScrollButtonsFocused',
		'showThumb',
		'startHidingThumb',
		'syncHeight',
		'update'
	]}, Skinnable(ScrollbarBase)
);
Scrollbar.displayName = 'Scrollbar';

export default Scrollbar;
export {
	Scrollbar,
	Scrollbar as ScrollbarBase
};
