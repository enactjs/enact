/**
 * Provides Moonstone-themed BodyText components and behaviors.
 *
 * @example
 * <BodyText centered>Hello Enact!</BodyText>
 *
 * @module moonstone/BodyText
 * @exports BodyText
 * @exports BodyTextBase
 * @exports BodyTextDecorator
 */

import kind from '@enact/core/kind';
import {BodyTextBase as UiButtonBase} from '@enact/ui/BodyText';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';

import Skinnable from '../Skinnable';

import componentCss from './BodyText.less';


/**
 * {@link moonstone/BodyText.BodyText} is a stateless BodyText with Moonstone styling
 * applied.
 *
 * @class BodyText
 * @memberof moonstone/BodyText
 * @ui
 * @public
 */
const BodyTextBase = kind({
	name: 'BodyText',

	propTypes: /** @lends moonstone/BodyText.BodyText.prototype */ {
		/**
		 * If `true`, text content is centered; otherwise, it is left-aligned.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `bodyText` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	defaultProps: {
		centered: false
	},

	styles: {
		css: componentCss,
		publicClassNames: ['bodyText']
	},

	render: ({css, ...rest}) => {
		return (
			<UiButtonBase
				{...rest}
				css={css}
			/>
		);
	}
});

const BodyTextDecorator = compose(
	Pure,
	Skinnable
);

const BodyText = BodyTextDecorator(BodyTextBase);

export default BodyText;
export {
	BodyText,
	BodyTextBase,
	BodyTextDecorator
};
