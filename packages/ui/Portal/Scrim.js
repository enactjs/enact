/**
 * Exports the {@link module:@enact/ui/Portal~ScrimBase} component and {@link module:@enact/ui/Portal~ScrimLayer}
 * component. The default export is {@link module:@enact/ui/Portal~ScrimBase}.
 *
 * @module @enact/ui/Scrim
 */

import kind from '@enact/core/kind';
import React from 'react';

import css from './Scrim.less';

/**
 * {@link module:@enact/ui/Portal~ScrimBase} provides an overlay that will prevent taps from propagating
 * to the controls that it covers.
 *
 * @class ScrimBase
 * @ui
 * @private
 */
const ScrimBase = kind({
	name: 'ScrimBase',

	propTypes: {
		/**
		 * Types of scrim. It can be either `transparent` or `translucent`.
		 * @type {String}
		 * @default `translucent`
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
		className: ({type, styler}) => styler.append([type])
	},

	render: (props) => {
		delete props.type;

		return (
			<div {...props} />
		);
	}
});

/**
 * {@link module:@enact/ui/Portal~ScrimLayer} is a layer which adds scrim behind the children.
 * Children will always have one higher z-index than scrim.
 *
 * @class ScrimLayer
 * @ui
 * @private
 */
const ScrimLayer = kind({
	name: 'ScrimLayer',

	propTypes: {
		/**
		 * z-index of the layer. Scrim will have the z-index of layer, and the children will have
		 * one higher index to display on top of Scrim.
		 * @type {Number}
		 */
		zIndex: React.PropTypes.number.isRequired,

		/**
		 * Types of scrim. It can be either `transparent` or `translucent`.
		 * @type {String}
		 * @default `translucent`
		 */
		type: React.PropTypes.oneOf(['transparent', 'translucent']),

		/**
		 * When `true`, scrim will appear
		 * @type {Boolean}
		 * @default false
		 */
		visible: React.PropTypes.bool
	},

	defaultProps: {
		type: 'translucent',
		visible: false
	},

	computed: {
		children: ({children, zIndex, ...rest}) => {
			delete rest.type;
			delete rest.visible;

			const style = Object.assign({}, children.props.style, {zIndex: zIndex + 1});
			return React.cloneElement(children, {style, ...rest});
		},
		scrim: ({visible, zIndex, type}) => {
			if (visible) {
				return <ScrimBase type={type} style={{zIndex}} />;
			}
		}
	},

	render: ({scrim, children, ...rest}) => {
		delete rest.type;
		delete rest.visible;
		delete rest.zIndex;

		return (
			<div {...rest}>
				{children}
				{scrim}
			</div>
		);
	}
});

export default ScrimBase;
export {ScrimBase, ScrimLayer};
