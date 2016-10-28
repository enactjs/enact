/**
 * Exports the {@link module:@enact/moonstone/BodyText~BodyText} and {@link module:@enact/moonstone/BodyText~BodyTextBase}
 * components.  The default export is {@link module:@enact/moonstone/BodyText~BodyTextBase}.
 *
 * @module @enact/moonstone/BodyText
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import css from './BodyText.less';

/**
 * {@link module:@enact/moonstone/BodyText~BodyText} is a stateless BodyText with Moonstone styling
 * applied.
 *
 * @class BodyText
 * @ui
 * @public
 */
const BodyTextBase = kind({
	name: 'BodyText',

	propTypes: {
		/**
		 * If `true`, text content is centered; otherwise, it is left-aligned.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool,

		children: PropTypes.node
	},

	defaultProps: {
		centered: false
	},

	styles: {
		css,
		className: 'bodyText'
	},

	computed: {
		className: ({centered, styler}) => styler.append({centered})
	},

	render: (props) => {
		delete props.centered;

		return (
			<p {...props} />
		);
	}
});

export default BodyTextBase;
export {BodyTextBase as BodyText, BodyTextBase};
