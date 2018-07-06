import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';

import $L from '../internal/$L';
import IconButton from '../IconButton';

import css from './VideoPlayer.less';

const Container = SpotlightContainerDecorator({enterTo: ''}, 'div');
const MediaButton = onlyUpdateForKeys([
	'children',
	'disabled',
	'onClick',
	'spotlightDisabled',
	'tooltipHidden'
])(IconButton);

/**
 * MediaControls {@link moonstone/VideoPlayer}.
 *
 * @class MediaControls
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaControls = kind({
	name: 'MediaControls',

	propTypes: /** @lends moonstone/VideoPlayer.MediaControls.prototype */ {
		/**
		 * A string which is sent to the `backward` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'backward'
		 * @public
		 */
		backwardIcon: PropTypes.string,

		/**
		 * A string which is sent to the `forward` icon of the player controls. This can be anything
		 * that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'forward'
		 * @public
		 */
		forwardIcon: PropTypes.string,

		/**
		 * A string which is sent to the `jumpBackward` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'skipbackward'
		 * @public
		 */
		jumpBackwardIcon: PropTypes.string,

		/**
		 * Sets the `disabled` state on the media "jump" buttons; the outer pair.
		 *
		 * @type {Boolean}
		 * @public
		 */
		jumpButtonsDisabled: PropTypes.bool,

		/**
		 * A string which is sent to the `jumpForward` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'skipforward'
		 * @public
		 */
		jumpForwardIcon: PropTypes.string,

		/**
		 * These components are placed below the title. Typically these will be media descriptor
		 * icons, like how many audio channels, what codec the video uses, but can also be a
		 * description for the video or anything else that seems appropriate to provide information
		 * about the video to the user.
		 *
		 * @type {Node}
		 * @public
		 */
		leftComponents: PropTypes.node,

		/**
		 * Sets the `disabled` state on the media buttons.
		 *
		 * @type {Boolean}
		 * @public
		 */
		mediaDisabled: PropTypes.bool,

		/**
		 * The label for the "More" button for when the "More" tray is open.
		 * This will show on the tooltip.
		 *
		 * @type {String}
		 * @default 'Back'
		 * @public
		 */
		moreButtonCloseLabel: PropTypes.string,

		/**
		 * Sets the `disabled` state on the media "more" button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		moreButtonDisabled: PropTypes.bool,

		/**
		 * The label for the "More" button. This will show on the tooltip.
		 *
		 * @type {String}
		 * @default 'More'
		 * @public
		 */
		moreButtonLabel: PropTypes.string,

		/**
		 * `true` disables more components when they are not in view.
		 *
		 * @type {Boolean}
		 * @public
		 */
		moreDisabled: PropTypes.bool,

		/**
		 * Removes the "jump" buttons. The buttons that skip forward or backward in the video.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noJumpButtons: PropTypes.bool,

		/**
		 * Removes the "rate" buttons. The buttons that change the playback rate of the video.
		 * Double speed, half speed, reverse 4x speed, etc.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noRateButtons: PropTypes.bool,

		/**
		 * Function executed when the user clicks the Backward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onBackwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the Forward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onForwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the JumpBackward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpBackwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the JumpForward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpForwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the Play button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onPlayButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the More button.
		 *
		 * @type {Function}
		 * @public
		 */
		onToggleMore: PropTypes.func,

		/**
		 * `true` when the video is paused.
		 *
		 * @type {Boolean}
		 * @public
		 */
		paused: PropTypes.bool,

		/**
		 * A string which is sent to the `pause` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}. This will be temporarily replaced by
		 * the [playIcon]{@link moonstone/VideoPlayer.MediaControls.playIcon} when the
		 * [paused]{@link moonstone/VideoPlayer.MediaControls.paused} boolean is `false`.
		 *
		 * @type {String}
		 * @default 'pause'
		 * @public
		 */
		pauseIcon: PropTypes.string,

		/**
		 * A string thats sets the label for `pause`.
		 *
		 * @type {String}
		 * @public
		 */
		pauseLabel: PropTypes.string,

		/**
		 * A string which is sent to the `play` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}. This will be temporarily replaced by
		 * the [pauseIcon]{@link moonstone/VideoPlayer.MediaControls.pauseIcon} when the
		 * [paused]{@link moonstone/VideoPlayer.MediaControls.paused} boolean is `true`.
		 *
		 * @type {String}
		 * @default 'play'
		 * @public
		 */
		playIcon: PropTypes.string,

		/**
		 * A string thats sets the label for `play`.
		 *
		 * @type {String}
		 * @public
		 */
		playLabel: PropTypes.string,

		/**
		 * Sets the `disabled` state on the media playback-rate control buttons; the inner pair.
		 *
		 * @type {Boolean}
		 * @public
		 */
		rateButtonsDisabled: PropTypes.bool,

		/**
		 * These components are placed into the slot to the right of the media controls.
		 *
		 * @type {Node}
		 * @public
		 */
		rightComponents: PropTypes.node,

		/**
		 * `true` when more components are shown.
		 *
		 * @type {Boolean}
		 * @public
		 */
		showMoreComponents: PropTypes.bool,

		/**
		 * `true` controls are disabled from Spotlight.
		 *
		 * @type {Boolean}
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * The visibility of the component. When `false`, the component will be hidden.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		backwardIcon: 'backward',
		forwardIcon: 'forward',
		jumpBackwardIcon: 'skipbackward',
		jumpForwardIcon: 'skipforward',
		pauseIcon: 'pause',
		playIcon: 'play',
		visible: true
	},

	styles: {
		css,
		className: 'controlsFrame'
	},

	computed: {
		centerClassName: ({showMoreComponents, styler}) => styler.join({
			centerComponents: true,
			more: showMoreComponents
		}),
		className: ({styler, visible}) => styler.append({hidden: !visible}),
		moreIcon: ({showMoreComponents}) => showMoreComponents ? 'arrowshrinkleft' : 'ellipsis',
		moreIconLabel: ({moreButtonCloseLabel, moreButtonLabel, showMoreComponents}) => {
			if (showMoreComponents) {
				return moreButtonCloseLabel != null ? moreButtonCloseLabel : $L('Back');
			} else {
				return moreButtonLabel != null ? moreButtonLabel : $L('More');
			}
		},
		playPauseIcon: ({paused, pauseIcon, playIcon}) => (paused ? playIcon : pauseIcon),
		playPauseLabel: ({paused, pauseLabel, playLabel}) => (paused ? playLabel : pauseLabel)
	},

	render: (props) => {
		const {
			backwardIcon,
			centerClassName,
			children,
			forwardIcon,
			jumpBackwardIcon,
			jumpButtonsDisabled,
			jumpForwardIcon,
			leftComponents,
			moreButtonDisabled,
			mediaDisabled,
			moreDisabled,
			moreIcon,
			moreIconLabel,
			noJumpButtons,
			noRateButtons,
			onBackwardButtonClick,
			onForwardButtonClick,
			onJumpBackwardButtonClick,
			onJumpForwardButtonClick,
			onPlayButtonClick,
			onToggleMore,
			playPauseIcon,
			playPauseLabel,
			rateButtonsDisabled,
			rightComponents,
			spotlightDisabled,
			visible,
			...rest
		} = props;

		delete rest.moreButtonCloseLabel;
		delete rest.moreButtonLabel;
		delete rest.pauseIcon;
		delete rest.paused;
		delete rest.pauseLabel;
		delete rest.playIcon;
		delete rest.playLabel;
		delete rest.showMoreComponents;

		return (
			<div {...rest}>
				<div className={css.leftComponents}>{leftComponents}</div>
				<div className={css.centerComponentsContainer}>
					<div className={centerClassName}>
						<Container className={css.mediaControls} spotlightDisabled={!moreDisabled || spotlightDisabled}>
							{noJumpButtons ? null : <MediaButton aria-label={$L('Previous')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpBackwardButtonClick} spotlightDisabled={spotlightDisabled}>{jumpBackwardIcon}</MediaButton>}
							{noRateButtons ? null : <MediaButton aria-label={$L('Rewind')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onBackwardButtonClick} spotlightDisabled={spotlightDisabled}>{backwardIcon}</MediaButton>}
							<MediaButton aria-label={playPauseLabel} className={spotlightDefaultClass} backgroundOpacity="translucent" onClick={onPlayButtonClick} spotlightDisabled={spotlightDisabled}>{playPauseIcon}</MediaButton>
							{noRateButtons ? null : <MediaButton aria-label={$L('Fast Forward')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onForwardButtonClick} spotlightDisabled={spotlightDisabled}>{forwardIcon}</MediaButton>}
							{noJumpButtons ? null : <MediaButton aria-label={$L('Next')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpForwardButtonClick} spotlightDisabled={spotlightDisabled}>{jumpForwardIcon}</MediaButton>}
						</Container>
						<Container className={css.moreControls} spotlightDisabled={moreDisabled || spotlightDisabled}>
							{children}
						</Container>
					</div>
				</div>
				<div className={css.rightComponents}>
					{rightComponents}
					{React.Children.count(children) ? (
						<MediaButton
							aria-label={moreIconLabel}
							backgroundOpacity="translucent"
							className={css.moreButton}
							disabled={moreButtonDisabled}
							onClick={onToggleMore}
							tooltipHidden={!visible}
							tooltipProps={{role: 'dialog'}}
							tooltipText={moreIconLabel}
							spotlightDisabled={spotlightDisabled}
						>
							{moreIcon}
						</MediaButton>
					) : null}
				</div>
			</div>
		);
	}
});

export default MediaControls;
export {MediaControls};
