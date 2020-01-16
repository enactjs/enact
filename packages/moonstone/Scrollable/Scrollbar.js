// import ApiDecorator from '@enact/core/internal/ApiDecorator';
import {ScrollbarBase as UiScrollbarBase} from '@enact/ui/Scrollable/Scrollbar';
import PropTypes from 'prop-types';
import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';

import ScrollButtons from './ScrollButtons';
import ScrollThumb from './ScrollThumb';
// import Skinnable from '../Skinnable';

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
const ScrollbarBase = memo(forwardRef((props, ref) => {
	// Refs
	const scrollbarRef = useRef();
	const scrollButtonsRef = useRef();
	// render
	const {cbAlertThumb, clientSize, corner, vertical, ...rest} = props;

	useImperativeHandle(ref, () => {
		const {getContainerRef, showThumb, startHidingThumb, update: uiUpdate} = scrollbarRef.current;
		const {isOneOfScrollButtonsFocused, updateButtons, focusOnButton} = scrollButtonsRef.current;
		return {
			getContainerRef,
			showThumb,
			startHidingThumb,
			uiUpdate,
			isOneOfScrollButtonsFocused,
			update: (bounds) => {
				updateButtons(bounds);
				uiUpdate(bounds);
			},
			focusOnButton
		};
	}, [scrollbarRef, scrollButtonsRef]);

	return (
		<UiScrollbarBase
			corner={corner}
			clientSize={clientSize}
			css={componentCss}
			ref={scrollbarRef}
			vertical={vertical}
			childRenderer={({thumbRef}) => ( // eslint-disable-line react/jsx-no-bind
				<ScrollButtons
					{...rest}
					ref={scrollButtonsRef}
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
}));

ScrollbarBase.displayName = 'ScrollbarBase';

ScrollbarBase.propTypes = /** @lends moonstone/Scrollable.Scrollbar.prototype */ {
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
	// setApiProvider: PropTypes.func,

	/**
	 * The scrollbar will be oriented vertically.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 */
	vertical: PropTypes.bool
};

ScrollbarBase.defaultProps = {
	corner: false,
	vertical: true
};

/**
 * A Moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
/* TODO: Is it possible to use ApiDecorator?
const Scrollbar = ApiDecorator(
	{api: [
		'focusOnButton',
		'getContainerRef',
		'isOneOfScrollButtonsFocused',
		'showThumb',
		'startHidingThumb',
		'update'
	]}, Skinnable(ScrollbarBase)
);
*/
const Scrollbar = ScrollbarBase;
Scrollbar.displayName = 'Scrollbar';

export default Scrollbar;
export {
	Scrollbar,
	Scrollbar as ScrollbarBase
};
