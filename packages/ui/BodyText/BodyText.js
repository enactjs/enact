/**
 * Exports the {@link moonstone/BodyText.BodyText} and {@link moonstone/BodyText.BodyTextBase}
 * components.  The default export is {@link moonstone/BodyText.BodyTextBase}.
 *
 * @module moonstone/BodyText
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './BodyText.less';

/**
 * {@link ui/BodyText.BodyTextBaseFactory} is Factory wrapper around {@link ui/BodyText.BodyTextBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class BodyTextBaseFactory
 * @memberof ui/BodyText
 * @factory
 * @ui
 * @public
 */
const BodyTextBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link moonstone/BodyText.BodyText} is a stateless BodyText with Moonstone styling
	 * applied.
	 *
	 * @class BodyText
	 * @memberof moonstone/BodyText
	 * @ui
	 * @public
	 */
	return kind({
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
});

const BodyTextBase = BodyTextBaseFactory();

export default BodyTextBase;
export {
	BodyTextBase as BodyText,
	BodyTextBase,
	BodyTextBaseFactory as BodyTextFactory,
	BodyTextBaseFactory
};
