import React from 'react';
import PropTypes from 'prop-types';

import css from './Scrim.module.less';

const transparentClassName = css.scrim + ' enact-fit ' + css.transparent;
const translucentClassName = css.scrim + ' enact-fit ' + css.translucent;

// Stores references to any Scrim instances whose type is translucent to ensure that only the top-
// most Scrim is visible to avoid stacking scrims.
const scrimStack = [];

/**
 * Pushes a translucent scrim to the top of the stack and hiding the previously top
 *
 * @param {ui/FloatingLayer.Scrim} scrim A scrim instance to add
 * @returns {undefined}
 * @private
 */
function pushTranslucentScrim (scrim) {
	const last = scrimStack.length - 1;
	if (last >= 0) {
		// if there are other translucent scrims, hide the topmost one assuming the others have been
		// hidden correctly by previous calls
		scrimStack[last].hide();
	}

	scrimStack.push(scrim);
}

/**
 * Removes a translucent scrim from the stack. If the scrim was the top-most, removing it will show
 * the next scrim. If not, it will just be removed
 *
 * @param {ui/FloatingLayer.Scrim} scrim A scrim instance to remove
 * @returns {undefined}
 * @private
 */
function removeTranslucentScrim (scrim) {
	const index = scrimStack.indexOf(scrim);
	const last = scrimStack.length - 1;
	if (index === last) {
		// if scrim is the top of the stack (most likely case), show the one below it then pop it
		scrimStack.pop();
		if (scrimStack.length) {
			scrimStack[scrimStack.length - 1].show();
		}
	} else {
		// if it's in the middle of the stack, just remove it
		scrimStack.splice(index, 1);
	}
}

/**
 * {@link ui/FloatingLayer.Scrim} provides an overlay that will prevent taps from propagating
 * to the controls that it covers.
 *
 * @class Scrim
 * @memberof ui/FloatingLayer
 * @ui
 * @private
 */
class Scrim extends React.Component {
	static propTypes = /** @lends ui/FloatingLayer.Scrim.prototype */ {
		/**
		 * Types of scrim. It can be either `'transparent'` or `'translucent'`.
		 *
		 * @type {String}
		 * @default `translucent`
		 * @public
		 */
		type: PropTypes.oneOf(['transparent', 'translucent'])
	}

	static defaultProps = {
		type: 'translucent'
	}

	constructor (props) {
		super(props);

		this.state = {
			visible: true
		};
	}

	UNSAFE_componentWillMount () {
		if (this.props.type === 'translucent') {
			pushTranslucentScrim(this);
		}
	}

	UNSAFE_componentWillReceiveProps (nextProps) {
		if (this.props.type === 'translucent' && nextProps.type !== 'translucent') {
			removeTranslucentScrim(this);
			this.setState({visible: true});
		}
	}

	componentWillUnmount () {
		if (this.props.type === 'translucent') {
			removeTranslucentScrim(this);
		}
	}

	show = () => this.setState({visible: true})

	hide = () => this.setState({visible: false})

	render () {
		if (this.state.visible) {
			const {type, ...rest} = this.props;
			const className = type === 'transparent' ? transparentClassName : translucentClassName;

			return (
				<div {...rest} className={className} />
			);
		}

		return null;
	}
}

export default Scrim;
export {Scrim};
