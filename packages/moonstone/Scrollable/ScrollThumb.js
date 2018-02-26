import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ScrollThumb as UiScrollThumb} from '@enact/ui/Scrollable/Scrollbar';

const nop = () => {};

/**
 * The callback function which is called for linking alertThumb function.
 *
 * @class ScrollThumb
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
class ScrollThumb extends Component {
	static propTypes = /** @lends moonstone/Scrollable.ScrollThumb.prototype */ {
		/**
		 * The callback function which is called for linking alertThumb function.
		 *
		 * @type {Function}
		 * @private
		 */
		cbAlertThumb: PropTypes.func
	}

	static defaultPros = {
		cbAlertThumb: nop
	}

	componentDidUpdate () {
		if (this.props) {
			this.props.cbAlertThumb();
		}
	}

	render () {
		const props = Object.assign({}, this.props);

		delete props.cbAlertThumb;

		return <UiScrollThumb {...props} />;
	}
}

export default ScrollThumb;
export {
	ScrollThumb
};
