import PropTypes from 'prop-types';
import {PureComponent} from 'react';

class RefDecorator extends PureComponent {
	static propTypes = /** @lends ui/RefDecorator.RefDecorator.prototype */ {
		/**
		 * A referenced instance
		 *
		 * @type {Object}
		 * @private
		 */
		context: PropTypes.obj,

		/**
		 * Initialize a referenced instance
		 *
		 * @type {Function}
		 * @private
		 */
		setRef: PropTypes.func
	}

	constructor (props) {
		const {context, setRef} = props;

		super();

		if (setRef) {
			setRef(context);
		}
	}

	render = () => (this.props.children)
}

export default RefDecorator;
export {
	RefDecorator
};
