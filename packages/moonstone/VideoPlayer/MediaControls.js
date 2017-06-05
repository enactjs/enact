import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';

import $L from '../internal/$L';
import IconButton from '../IconButton';

import css from './VideoPlayer.less';

const buttonLabels = {
	pauseLabel: 'Pause',
	playLabel: 'Play',
	previousLabel: 'Previous',
	rewindLabel: 'Rewind',
	fastForwardLabel: 'Fast Forward',
	nextLabel: 'Next',
	backLabel: 'Back',
	moreLabel: 'More'
};

const Container = SpotlightContainerDecorator({enterTo: ''}, 'div');
const MediaButton = onlyUpdateForKeys([
	'children',
	'disabled',
	'onClick'
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
		leftComponents: PropTypes.node,
		mediaDisabled: PropTypes.bool,
		moreDisabled: PropTypes.bool,
		noJumpButtons: PropTypes.bool,
		noRateButtons: PropTypes.bool,
		onBackwardButtonClick: PropTypes.func,
		onForwardButtonClick: PropTypes.func,
		onJumpBackwardButtonClick: PropTypes.func,
		onJumpForwardButtonClick: PropTypes.func,
		onPlayButtonClick: PropTypes.func,
		onToggleMore: PropTypes.func,
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
		 * @default 'pause'
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
		 * @default 'play'
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
		rightComponents: PropTypes.node,
		showMoreComponents: PropTypes.bool
	},

	defaultProps: {
		backwardIcon: 'backward',
		forwardIcon: 'forward',
		jumpBackwardIcon: 'skipbackward',
		jumpForwardIcon: 'skipforward',
		pauseIcon: 'pause',
		pauseLabel: buttonLabels.pauseLabel,
		playIcon: 'play',
		playLabel: buttonLabels.playLabel
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
		mediaControlsDisabled: ({mediaDisabled, moreDisabled}) => (mediaDisabled || !moreDisabled),
		moreIcon: ({showMoreComponents}) => showMoreComponents ? 'arrowshrinkleft' : 'ellipsis',
		moreIconLabel: ({showMoreComponents}) => showMoreComponents ? buttonLabels.backLabel : buttonLabels.moreLabel,
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
			mediaControlsDisabled,
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
			...rest
		} = props;

		const {
			previousLabel,
			rewindLabel,
			fastForwardLabel,
			nextLabel
		} = buttonLabels;

		delete rest.pauseIcon;
		delete rest.paused;
		delete rest.pauseLabel;
		delete rest.playIcon;
		delete rest.playLabel;
		delete rest.mediaDisabled;
		delete rest.showMoreComponents;

		return (
			<div {...rest}>
				<div className={css.leftComponents}>{leftComponents}</div>
				<div className={css.centerComponentsContainer}>
					<div className={centerClassName}>
						<Container className={css.mediaControls} spotlightDisabled={mediaControlsDisabled}> {/* rtl={false} */}
							{noJumpButtons ? null : <MediaButton aria-label={$L(previousLabel)} backgroundOpacity="translucent" disabled={mediaControlsDisabled || jumpButtonsDisabled} onClick={onJumpBackwardButtonClick}>{jumpBackwardIcon}</MediaButton>}
							{noRateButtons ? null : <MediaButton aria-label={$L(rewindLabel)} backgroundOpacity="translucent" disabled={mediaControlsDisabled || rateButtonsDisabled} onClick={onBackwardButtonClick}>{backwardIcon}</MediaButton>}
							<MediaButton aria-label={$L(playPauseLabel)} className={spotlightDefaultClass} backgroundOpacity="translucent" onClick={onPlayButtonClick}>{playPauseIcon}</MediaButton>
							{noRateButtons ? null : <MediaButton aria-label={$L(fastForwardLabel)} backgroundOpacity="translucent" disabled={mediaControlsDisabled || rateButtonsDisabled} onClick={onForwardButtonClick}>{forwardIcon}</MediaButton>}
							{noJumpButtons ? null : <MediaButton aria-label={$L(nextLabel)} backgroundOpacity="translucent" disabled={mediaControlsDisabled || jumpButtonsDisabled} onClick={onJumpForwardButtonClick}>{jumpForwardIcon}</MediaButton>}
						</Container>
						<Container className={css.moreControls} spotlightDisabled={moreDisabled}>
							{children}
						</Container> {/* rtl={false} */}
					</div>
				</div>
				<div className={css.rightComponents}>
					{rightComponents}
					{children ? <MediaButton aria-label={$L(moreIconLabel)} backgroundOpacity="translucent" className={css.moreButton} onClick={onToggleMore}>{moreIcon}</MediaButton> : null}
				</div>
			</div>
		);
	}
});

export default MediaControls;
export {MediaControls};
