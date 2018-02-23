import lifecycle from 'recompose/lifecycle';
import {ScrollThumb as UiScrollThumb} from '@enact/ui/Scrollable/Scrollbar';

/**
 * The callback function which is called for linking alertThumb function.
 *
 * @type {Function}
 * @private
 */

const ScrollThumb = lifecycle({
	componentWillMount () {
		if (this.props) {
			this.props.cbAlertThumb();
		}
	}
})(UiScrollThumb);

export default ScrollThumb;
export {
	ScrollThumb
};
