import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import {MarqueeText} from '../Marquee';

import css from './VideoPlayer.less';

const MediaTitleBase = kind({
	name: 'MediaTitle',

	propTypes: {
		children: React.PropTypes.node,
		title: React.PropTypes.string,
		visible: React.PropTypes.bool
	},

	styles: {
		css,
		className: 'titleFrame'
	},

	computed: {
		childrenClassName: ({visible, styler}) => styler.join(
			'infoComponents',
			visible ? 'visible' : 'hidden'
		),
		titleClassName: ({visible, styler}) => styler.join({
			title: true,
			withBadges: visible
		})
	},

	render: ({children, childrenClassName, title, titleClassName, ...rest}) => {
		delete rest.visible;

		return (
			<div {...rest}> {/* hidingDuration={1000} marqueeOnRender */}
				<MarqueeText className={titleClassName}>
					{title}
				</MarqueeText>
				<div className={childrenClassName}>  {/* showing={false} showingDuration={500} tabIndex={-1} mixins={[ShowingTransitionSupport]} */}
					{children}
				</div>
			</div>
		);
	}
});

const MediaTitle = onlyUpdateForKeys(['children', 'title', 'visible'])(MediaTitleBase);

export default MediaTitle;
export {
	MediaTitle,
	MediaTitleBase
};
