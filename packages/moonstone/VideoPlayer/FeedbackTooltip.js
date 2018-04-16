import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';
import ComponentOverride from '@enact/ui/ComponentOverride';

import Image from '../Image';
import Skinnable from '../Skinnable';

import FeedbackContent from './FeedbackContent';
import states from './FeedbackIcons.js';
import {secondsToTime} from './util';

import css from './FeedbackTooltip.less';

/**
 * FeedbackTooltip {@link moonstone/VideoPlayer}. This displays the media's playback rate and
 * time information.
 *
 * @class FeedbackTooltip
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackTooltipBase = kind({
	name: 'FeedbackTooltip',

	propTypes: /** @lends moonstone/VideoPlayer.FeedbackTooltip.prototype */ {
		/**
		 * Duration of the curent media in seconds
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		duration: PropTypes.number,

		/**
		 * Instance of `NumFmt` to format the time
		 *
		 * @type {Objct}
		 * @public
		 */
		formatter: PropTypes.object,

		/**
		 * When `true`, only time would appear in tooltip.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noFeedback: PropTypes.bool,

		/**
		 * Value of the feedback playback rate
		 *
		 * @type {String|Number}
		 * @public
		 */
		playbackRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

		/**
		 * Refers to one of the following possible media playback states.
		 * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
		 * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
		 *
		 * Each state understands where its related icon should be positioned, and whether it should
		 * respond to changes to the `visible` property.
		 *
		 * This string feeds directly into {@link moonstone/FeedbackIcon.FeedbackIcon}.
		 *
		 * @type {String}
		 * @public
		 */
		playbackState: PropTypes.oneOf(Object.keys(states)),

		/**
		 * A number between 0 and 1 representing the proportion of the `value` in terms of `min`
		 * and `max` props of the slider
		 *
		 * @type {Boolean}
		 * @public
		 */
		proportion: PropTypes.number,

		/**
		 * This component will be used instead of the built-in version. The internal thumbnail style
		 * will be applied to this component. This component follows the same rules as the built-in
		 * version; hiding and showing according to the state of `noFeedback`.
		 *
		 * This can be a tag name as a string, a rendered DOM node, a component, or a component
		 * instance.
		 *
		 * @type {Component}
		 * @public
		 */
		thumbnailComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),

		/**
		 * `true` if Slider knob is scrubbing.
		 *
		 * @type {Boolean}
		 * @public
		 */
		thumbnailDeactivated: PropTypes.bool,

		/**
		 * Set a thumbnail image source to show on VideoPlayer's Slider knob. This is a standard
		 * {@link moonstone/Image} component so it supports all of the same options for the `src`
		 * property. If no `thumbnailSrc` is set, no tooltip will display.
		 *
		 * @type {String|Object}
		 * @public
		 */
		thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * If the current `playbackState` allows this component's visibility to be changed,
		 * this component will be hidden. If not, setting this property will have no effect.
		 * All `playbackState`s respond to this property except the following:
		 * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		noFeedback: false,
		thumbnailDeactivated: false,
		visible: true
	},

	styles: {
		css,
		className: 'feedbackTooltip'
	},

	computed: {
		children: ({children, duration, formatter}) => {
			return secondsToTime(children * duration, formatter);
		},
		className: ({playbackState: s, proportion, thumbnailDeactivated, styler, visible}) => {
			return styler.append({
				afterMidpoint: proportion > 0.5,
				hidden: !visible && states[s] && states[s].allowHide,
				thumbnailDeactivated
			});
		},
		thumbnailComponent: ({noFeedback, thumbnailComponent, thumbnailSrc}) => {
			// noFeedback is effectively "tooltip mode", one mode being whether the time and icon are visible,
			// the other being the thumbnail and time are visible.
			if (noFeedback) {
				if (thumbnailComponent) {
					return <ComponentOverride
						component={thumbnailComponent}
						className={css.thumbnail}
					/>;
				} else if (thumbnailSrc) {
					return (
						<div className={css.thumbnail}>
							<Image src={thumbnailSrc} className={css.image} />
						</div>
					);
				}
			}
		}
	},

	render: ({children, noFeedback, playbackState, playbackRate, thumbnailComponent, ...rest}) => {
		delete rest.duration;
		delete rest.formatter;
		delete rest.thumbnailDeactivated;
		delete rest.thumbnailSrc;
		delete rest.visible;

		return (
			<div {...rest}>
				{thumbnailComponent}
				<FeedbackContent
					className={css.content}
					feedbackVisible={!noFeedback}
					playbackRate={playbackRate}
					playbackState={playbackState}
				>
					{children}
				</FeedbackContent>
			</div>
		);
	}
});

const FeedbackTooltip = onlyUpdateForKeys(
	['children', 'noFeedback', 'playbackState', 'playbackRate', 'thumbnailComponent', 'thumbnailDeactivated', 'thumbnailSrc', 'visible']
)(
	Skinnable(
		FeedbackTooltipBase
	)
);

FeedbackTooltip.defaultSlot = 'tooltip';

export default FeedbackTooltip;
export {
	FeedbackTooltip,
	FeedbackTooltipBase
};
