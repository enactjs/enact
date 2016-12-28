import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import {MarqueeText} from '../Marquee';

import css from './VideoPlayer.less';

/**
 * MediaTitle {@link moonstone/VideoPlayer}.
 *
 * @class MediaTitle
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaTitleBase = kind({
	name: 'MediaTitle',

	propTypes: /** @lends moonstone/VideoPlayer.MediaTitle.prototype */ {
		/**
		 * Anything supplied to `children` will be rendered. Typically this will be informational
		 * badges indicating aspect ratio, audio channels, etc., but it could also be a description.
		 *
		 * @type {Node}
		 * @public
		 */
		children: React.PropTypes.node,

		/**
		 * Control whether the children (infoComponents) are displayed.
		 *
		 * @type {Object}
		 * @public
		 */
		infoVisible: React.PropTypes.bool,

		/**
		 * A title string to identify the media's title.
		 *
		 * @type {String}
		 * @public
		 */
		title: React.PropTypes.string
	},

	styles: {
		css,
		className: 'titleFrame'
	},

	computed: {
		childrenClassName: ({infoVisible, styler}) => styler.join(
			'infoComponents',
			infoVisible ? 'visible' : 'hidden'
		),
		titleClassName: ({infoVisible, styler}) => styler.join({
			title: true,
			infoVisible
		})
	},

	render: ({children, childrenClassName, title, titleClassName, ...rest}) => {
		delete rest.infoVisible;

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

const MediaTitle = onlyUpdateForKeys(['children', 'title', 'infoVisible'])(MediaTitleBase);

export default MediaTitle;
export {
	MediaTitle,
	MediaTitleBase
};
