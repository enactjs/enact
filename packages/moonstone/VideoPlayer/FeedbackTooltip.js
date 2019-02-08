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

import css from './FeedbackTooltip.module.less';

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
		 * Invoke action to display or hide tooltip.
		 *
		 * @type {String}
		 * @default 'idle'
		 */
		action: PropTypes.oneOf(['focus', 'blur', 'idle']),

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
		 * If the current `playbackState` allows this component's visibility to be changed,
		 * this component will be hidden. If not, setting this property will have no effect.
		 * All `playbackState`s respond to this property except the following:
		 * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hidden: PropTypes.bool,

		/**
		 * Part of the API required by `ui/Slider` but not used by FeedbackTooltip which only
		 * supports horizontal orientation
		 *
		 * @type {String}
		 * @private
		 */
		orientation: PropTypes.string,

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
		 * version; hiding and showing according to the state of `action`.
		 *
		 * This can be a tag name as a string, a rendered DOM node, a component, or a component
		 * instance.
		 *
		 * @type {Component|Element}
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
		 * Required by the interface for moonstone/Slider.tooltip but not used here
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		action: 'idle',
		thumbnailDeactivated: false,
		hidden: false
	},

	styles: {
		css,
		className: 'feedbackTooltip'
	},

	computed: {
		children: ({children, duration, formatter}) => {
			return secondsToTime(children * duration, formatter);
		},
		className: ({hidden, playbackState: s, proportion, thumbnailDeactivated, styler}) => {
			return styler.append({
				afterMidpoint: proportion > 0.5,
				hidden: hidden && states[s] && states[s].allowHide,
				thumbnailDeactivated
			});
		},
		feedbackVisible: ({action, playbackState}) => {
			return (action !== 'focus' || action === 'idle') && !(action === 'blur' && playbackState === 'play');
		},
		thumbnailComponent: ({action, thumbnailComponent, thumbnailSrc}) => {
			if (action === 'focus') {
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

	render: ({children, feedbackVisible, playbackState, playbackRate, thumbnailComponent, ...rest}) => {
		delete rest.action;
		delete rest.duration;
		delete rest.formatter;
		delete rest.hidden;
		delete rest.orientation;
		delete rest.proportion;
		delete rest.thumbnailDeactivated;
		delete rest.thumbnailSrc;
		delete rest.visible;

		return (
			<div {...rest}>
				{thumbnailComponent}
				<FeedbackContent
					className={css.content}
					feedbackVisible={feedbackVisible}
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
	['action', 'children', 'hidden', 'playbackState', 'playbackRate', 'thumbnailComponent', 'thumbnailDeactivated', 'thumbnailSrc', 'visible']
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
