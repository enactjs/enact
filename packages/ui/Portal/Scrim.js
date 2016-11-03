/**
 *
 */

import kind from '@enact/core/kind';
import React from 'react';

import css from './Scrim.less';

let childrenZIndex = 121;
const defaultZIndex = 120;

const Scrim = kind({
	name: 'Scrim',

	propTypes: {
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

const ScrimLayer = kind({
	name: 'ScrimLayer',

	propTypes: {
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent'])
	},

	defaultProps: {
		scrimType: 'translucent'
	},

	computed: {
		children: ({children, ...rest}) => {
			delete rest.scrimType;

			const style = Object.assign({}, children.props.style, {zIndex: childrenZIndex++});
			return React.cloneElement(children, {style, ...rest});
		}
	},

	render: ({scrimType, children}) => {
		return (
			<div>
				{children}
				<Scrim type={scrimType} style={{zIndex: defaultZIndex}} />
			</div>
		);
	}
});

export default Scrim;
export {Scrim, ScrimLayer};
