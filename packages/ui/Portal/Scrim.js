/**
 * Exports the {@link module:@enact/ui/Portal~Scrim} component and {@link module:@enact/ui/Portal~ScrimLayer} component.
 *
 * @module @enact/ui/Scrim
 */

import kind from '@enact/core/kind';
import React from 'react';

import css from './Scrim.less';

/**
 * {@link module:@enact/ui/Portal~Scrim} provides an overlay that will prevent taps from propagating
 * to the controls that it covers.
 *
 * @class Scrim
 * @ui
 * @public
 */
const Scrim = kind({
	name: 'Scrim',

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
		className: 'enact-scrim enact-fit'
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
 * TBD
 *
 * @class ScrimLayer
 * @ui
 * @public
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
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent']),

		/**
		 * When `true`, scrim will appear
		 * @type {Boolean}
		 * @default false
		 */
		scrimVisible: React.PropTypes.bool
	},

	defaultProps: {
		scrimType: 'translucent',
		scrimVisible: false
	},

	computed: {
		children: ({children, zIndex, ...rest}) => {
			delete rest.scrimType;
			delete rest.scrimVisible;

			const style = Object.assign({}, children.props.style, {zIndex: zIndex + 1});
			return React.cloneElement(children, {style, ...rest});
		},
		scrim: ({scrimVisible, zIndex, scrimType}) => {
			if (scrimVisible) {
				return <Scrim type={scrimType} style={{zIndex}} />;
			}
		}
	},

	render: ({scrim, children}) => {
		return (
			<div>
				{children}
				{scrim}
			</div>
		);
	}
});

export default Scrim;
export {Scrim, ScrimLayer};
