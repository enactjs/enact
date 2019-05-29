/**
 * Text block component to be customized by a theme or application.
 *
 * @module ui/BodyText
 * @exports BodyText
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import ForwardRef from '../ForwardRef';

import componentCss from './BodyText.module.less';

/**
 * A simple, unstyled text block component, without
 * [BodyTextDecorator](ui/BodyText.BodyTextDecorator) applied.
 *
 * @class BodyTextBase
 * @memberof ui/BodyText
 * @ui
 * @public
 */
const BodyTextBase = kind({
	name: 'ui:BodyText',

	propTypes: /** @lends ui/BodyText.BodyTextBase.prototype */ {
		/**
		 * Centers the contents.
		 *
		 * Applies the `centered` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'p', etc.) or a custom component.
		 *
		 * @type {Component}
		 * @default 'p'
		 * @public
		 */
		component: EnactPropTypes.renderable,

		/**
		 * Called with a reference to [component]{@link ui/BodyText.BodyText#component}
		 *
		 * @private
		 */
		componentRef: PropTypes.func,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `bodyText` - The root class name
		 * * `centered` - Applied when `centered` prop is `true`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	defaultProps: {
		centered: false,
		component: 'p'
	},

	styles: {
		css: componentCss,
		className: 'bodyText',
		publicClassNames: true
	},

	computed: {
		className: ({centered, styler}) => styler.append({centered})
	},

	render: ({component: Component, componentRef, ...rest}) => {
		delete rest.centered;

		return (
			<Component
				ref={componentRef}
				{...rest}
			/>
		);
	}
});

/**
 * Applies BodyText behaviors.
 *
 * @hoc
 * @memberof ui/BodyText
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const BodyTextDecorator = ForwardRef({prop: 'componentRef'});

/**
 * A simple, unstyled text block component.
 *
 * @class BodyText
 * @memberof ui/BodyText
 * @ui
 * @public
 */
const BodyText = BodyTextDecorator(BodyTextBase);

export default BodyText;
export {
	BodyText,
	BodyTextBase,
	BodyTextDecorator
};
