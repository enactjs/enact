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
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		infoVisible: React.PropTypes.bool,

		/**
		 * A title string to identify the media's title.
		 *
		 * @type {String}
		 * @public
		 */
		title: React.PropTypes.string,

		/**
		 * Setting this to false effectively hides the entire component. Setting it to `false` after
		 * the control has rendered causes a fade-out transition. Setting to `true` after or during
		 * the transition makes the component immediately visible again, without delay or transition.
		 *
		 * @type {String}
		 * @default true
		 * @public
		 */
		// This property uniquely defaults to true, because it doesn't make sense to have it false
		// and have the control be initially invisible, and is named "visible" to match the other
		// props (current and possible future). Having an `infoVisible` and a `hidden` prop seems weird.
		visible: React.PropTypes.bool
	},

	defaultProps: {
		infoVisible: false,
		visible: true
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
		className: ({visible, styler}) => styler.append(
			visible ? 'visible' : 'hidden'
		),
		titleClassName: ({infoVisible, styler}) => styler.join({
			title: true,
			infoVisible
		})
	},

	render: ({children, childrenClassName, title, titleClassName, ...rest}) => {
		delete rest.infoVisible;
		delete rest.visible;

		return (
			<div {...rest}>
				<MarqueeText className={titleClassName} marqueeOn="render">
					{title}
				</MarqueeText>
				<div className={childrenClassName}>  {/* tabIndex={-1} */}
					{children}
				</div>
			</div>
		);
	}
});

const MediaTitle = onlyUpdateForKeys(['children', 'title', 'infoVisible', 'visible'])(MediaTitleBase);

export default MediaTitle;
export {
	MediaTitle,
	MediaTitleBase
};
