import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ScrollbarBase as UiScrollbarBase} from '@enact/ui/Scrollable/Scrollbar';

import componentCss from './Scrollbar.less';
import ScrollButtons from './ScrollButtons';
import ScrollThumb from './ScrollThumb';

/**
 * A moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
class Scrollbar extends Component {
	static propTypes = {
		cbAlertThumb: PropTypes.func,
		corner: PropTypes.bool,
		vertical: PropTypes.bool
	}

	render () {
		const {cbAlertThumb, corner, vertical, ...rest} = this.props;

		return (
			<UiScrollbarBase
				corner={corner}
				css={componentCss}
				vertical={vertical}
				render={({getScrollThumbRef, showThumb, startHidingThumb, update: uiUpdate}) => { // eslint-disable-line react/jsx-no-bind
					this.showThumb = showThumb;
					this.startHidingThumb = startHidingThumb;
					this.uiUpdate = uiUpdate;

					return (
						<ScrollButtons
							{...rest}
							vertical={vertical}
							render={({isOneOfScrollButtonsFocused, updateButtons}) => { // eslint-disable-line react/jsx-no-bind
								this.isOneOfScrollButtonsFocused = isOneOfScrollButtonsFocused;
								this.update = (bounds) => {
									updateButtons(bounds);
									this.uiUpdate(bounds);
								};

								return (
									<ScrollThumb
										cbAlertThumb={cbAlertThumb}
										getScrollThumbRef={getScrollThumbRef}
										key="thumb"
										vertical={vertical}
									/>
								);
							}}
						/>
					);
				}}
			/>
		);
	}
}

export default Scrollbar;
export {
	Scrollbar
};
