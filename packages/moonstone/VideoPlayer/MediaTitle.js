import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import Marquee from '../Marquee';

import css from './VideoPlayer.module.less';

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
		 * DOM id for the component. Also define ids for the title and node wrapping the `children`
		 * in the forms `${id}_title` and `${id}_info`, respectively.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		id: PropTypes.string.isRequired,

		/**
		 * Anything supplied to `children` will be rendered. Typically this will be informational
		 * badges indicating aspect ratio, audio channels, etc., but it could also be a description.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Control whether the children (infoComponents) are displayed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		infoVisible: PropTypes.bool,

		/**
		 * A title string to identify the media's title.
		 *
		 * @type {Node}
		 * @public
		 */
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

		/**
		 * Setting this to false effectively hides the entire component. Setting it to `false` after
		 * the control has rendered causes a fade-out transition. Setting to `true` after or during
		 * the transition makes the component immediately visible again, without delay or transition.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		// This property uniquely defaults to true, because it doesn't make sense to have it false
		// and have the control be initially invisible, and is named "visible" to match the other
		// props (current and possible future). Having an `infoVisible` and a `hidden` prop seems weird.
		visible: PropTypes.bool
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

	render: ({children, childrenClassName, id, title, titleClassName, ...rest}) => {
		delete rest.infoVisible;
		delete rest.visible;

		return (
			<div {...rest} id={id}>
				<Marquee id={id + '_title'} className={titleClassName} marqueeOn="render">
					{title}
				</Marquee>
				<div id={id + '_info'} className={childrenClassName}>  {/* tabIndex={-1} */}
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
