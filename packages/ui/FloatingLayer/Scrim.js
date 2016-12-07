import kind from '@enact/core/kind';
import React from 'react';

import css from './Scrim.less';

/**
 * {@link ui/FloatingLayer.Scrim} provides an overlay that will prevent taps from propagating
 * to the controls that it covers.
 *
 * @class Scrim
 * @memberof ui/FloatingLayer
 * @ui
 * @private
 */
const Scrim = kind({
	name: 'Scrim',

	propTypes: /** @lends ui/FloatingLayer.Scrim.prototype */ {
		/**
		 * Types of scrim. It can be either `'transparent'` or `'translucent'`.
		 *
		 * @type {String}
		 * @default `translucent`
		 * @public
		 */
		type: React.PropTypes.oneOf(['transparent', 'translucent'])
	},

	defaultProps: {
		type: 'translucent'
	},

	styles: {
		css,
		className: 'scrim enact-fit'
	},

	computed: {
		className: ({type, styler}) => styler.append(type)
	},

	render: (props) => {
		delete props.type;

		return (
			<div {...props} />
		);
	}
});



export default Scrim;
export {Scrim};
