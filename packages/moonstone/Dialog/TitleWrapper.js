import kind from '@enact/core/kind';
import React from 'react';

import {controlContextTypes, MarqueeController} from '../Marquee';

import css from './Dialog.less';

const TitleWrapperBase = kind({
	name: 'TitleWrapper',

	styles: {
		css,
		className: 'titleWrapper'
	},

	handlers: {
		onMouseEnter: (ev, props, {start}) => start()
	},

	render: (props) => (
		<div {...props} />
	)
});

TitleWrapperBase.contextTypes = controlContextTypes;

const TitleWrapper = MarqueeController(
	TitleWrapperBase
);

export default TitleWrapper;
export {
	TitleWrapper,
	TitleWrapperBase
};
