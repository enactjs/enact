/**
 * Exports the {@link moonstone/BodyText.BodyText} and {@link moonstone/BodyText.BodyTextBase}
 * components.  The default export is {@link moonstone/BodyText.BodyTextBase}.
 *
 * @module moonstone/BodyText
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Skinnable from '../Skinnable';

import css from './BodyText.less';

/**
 * {@link moonstone/BodyText.BodyText} is a stateless BodyText with Moonstone styling
 * applied.
 *
 * @class BodyText
 * @memberof moonstone/BodyText
 * @ui
 * @public
 */
const BodyTextBare = kind({
	name: 'BodyText',

	propTypes: /** @lends moonstone/BodyText.BodyText.prototype */ {
		/**
		 * If `true`, text content is centered; otherwise, it is left-aligned.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool
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

const BodyTextBase = Skinnable(BodyTextBare);

export default BodyTextBase;
export {BodyTextBase as BodyText, BodyTextBase};
