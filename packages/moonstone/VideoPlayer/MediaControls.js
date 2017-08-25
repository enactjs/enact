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
	'spotlightDisabled'
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
		moreButtonCloseLabel: PropTypes.string,
		moreButtonDisabled: PropTypes.bool,
		moreButtonLabel: PropTypes.string,
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
		rightComponents: PropTypes.node,
		showMoreComponents: PropTypes.bool,
		spotlightDisabled: PropTypes.bool
	},

	defaultProps: {
		backwardIcon: 'backward',
		forwardIcon: 'forward',
		jumpBackwardIcon: 'skipbackward',
		jumpForwardIcon: 'skipforward',
		pauseIcon: 'pause',
		playIcon: 'play'
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
						<Container className={css.mediaControls} spotlightDisabled={!moreDisabled || spotlightDisabled}> {/* rtl={false} */}
							{noJumpButtons ? null : <MediaButton aria-label={$L('Previous')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpBackwardButtonClick} spotlightDisabled={spotlightDisabled}>{jumpBackwardIcon}</MediaButton>}
							{noRateButtons ? null : <MediaButton aria-label={$L('Rewind')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onBackwardButtonClick} spotlightDisabled={spotlightDisabled}>{backwardIcon}</MediaButton>}
							<MediaButton aria-label={playPauseLabel} className={spotlightDefaultClass} backgroundOpacity="translucent" onClick={onPlayButtonClick} spotlightDisabled={spotlightDisabled}>{playPauseIcon}</MediaButton>
							{noRateButtons ? null : <MediaButton aria-label={$L('Fast Forward')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onForwardButtonClick} spotlightDisabled={spotlightDisabled}>{forwardIcon}</MediaButton>}
							{noJumpButtons ? null : <MediaButton aria-label={$L('Next')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpForwardButtonClick} spotlightDisabled={spotlightDisabled}>{jumpForwardIcon}</MediaButton>}
						</Container>
						<Container className={css.moreControls} spotlightDisabled={moreDisabled || spotlightDisabled}>
							{children}
						</Container> {/* rtl={false} */}
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
