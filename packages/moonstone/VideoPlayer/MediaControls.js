import ApiDecorator from '@enact/core/internal/ApiDecorator';
import Cancelable from '@enact/ui/Cancelable';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {on, off} from '@enact/core/dispatcher';
import Pause from '@enact/spotlight/Pause';
import Slottable from '@enact/ui/Slottable';
import Spotlight from '@enact/spotlight';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import {forward} from '@enact/core/handle';

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import $L from '../internal/$L';
import IconButton from '../IconButton';

import {countReactChildren} from './util';

import css from './VideoPlayer.less';

const OuterContainer = SpotlightContainerDecorator({
	defaultElement: [
		`.${css.leftComponents} .${spotlightDefaultClass}`,
		`.${css.rightComponents} .${spotlightDefaultClass}`,
		`.${spotlightDefaultClass}`,
		`.${css.mediaControls} *`
	]
}, 'div');
const Container = SpotlightContainerDecorator({enterTo: ''}, 'div');
const MediaButton = onlyUpdateForKeys([
	'children',
	'className',
	'color',
	'disabled',
	'onClick',
	'spotlightDisabled'
])(IconButton);

const forwardToggleMore = forward('onToggleMore');

/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * @class MediaControlsBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaControlsBase = kind({
	name: 'MediaControls',

	// intentionally assigning these props to MediaControls instead of Base (which is private)
	propTypes: /** @lends moonstone/VideoPlayer.MediaControls.prototype */ {
		/**
		 * Reverse-playback [icon]{@link moonstone/Icon.Icon} name. Accepts any
		 * [icon]{@link moonstone/Icon.Icon} component type.
		 *
		 * @type {String}
		 * @default 'backward'
		 * @public
		 */
		backwardIcon: PropTypes.string,

		/**
		 * Forward [icon]{@link moonstone/Icon.Icon} name. Accepts any
		 * [icon]{@link moonstone/Icon.Icon} component type.
		 *
		 * @type {String}
		 * @default 'forward'
		 * @public
		 */
		forwardIcon: PropTypes.string,

		/**
		 * Jump backward [icon]{@link moonstone/Icon.Icon} name. Accepts any
		 * [icon]{@link moonstone/Icon.Icon} component type.
		 *
		 * @type {String}
		 * @default 'skipbackward'
		 * @public
		 */
		jumpBackwardIcon: PropTypes.string,

		/**
		 * Disables state on the media "jump" buttons; the outer pair.
		 *
		 * @type {Boolean}
		 * @public
		 */
		jumpButtonsDisabled: PropTypes.bool,

		/**
		 * Jump forward [icon]{@link moonstone/Icon.Icon} name. Accepts any
		 * [icon]{@link moonstone/Icon.Icon} component type.
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
		 * Disables the media buttons.
		 *
		 * @type {Boolean}
		 * @public
		 */
		mediaDisabled: PropTypes.bool,

		/**
		 * The label for the "more" button for when the "more" tray is open.
		 * This will show on the tooltip.
		 *
		 * @type {String}
		 * @default 'Back'
		 * @public
		 */
		moreButtonCloseLabel: PropTypes.string,

		/**
		 * The color of the underline beneath more icon button.
		 *
		 * This property accepts one of the following color names, which correspond with the
		 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`.
		 *
		 * @type {String}
		 * @see {@link moonstone/IconButton.IconButtonBase.color}
		 * @default 'blue'
		 * @public
		 */
		moreButtonColor: PropTypes.oneOf(['red', 'green', 'yellow', 'blue']),

		/**
		 * Disables the media "more" button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		moreButtonDisabled: PropTypes.bool,

		/**
		 * The label for the "more" button. This will show on the tooltip.
		 *
		 * @type {String}
		 * @default 'More'
		 * @public
		 */
		moreButtonLabel: PropTypes.string,

		/**
		 * A custom more button ID to use with Spotlight.
		 *
		 * @type {String}
		 * @public
		 */
		moreButtonSpotlightId: PropTypes.string,

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
		 * Called when the user clicks the Backward button.
		 *
		 * @type {Function}
		 * @public
		 */
		onBackwardButtonClick: PropTypes.func,

		/**
		 * Called when cancel/back key events are fired.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the user clicks the Forward button.
		 *
		 * @type {Function}
		 * @public
		 */
		onForwardButtonClick: PropTypes.func,

		/**
		 * Called when the user clicks the JumpBackward button
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpBackwardButtonClick: PropTypes.func,

		/**
		 * Called when the user clicks the JumpForward button.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpForwardButtonClick: PropTypes.func,

		/**
		 * Called when the user clicks the More button.
		 *
		 * @type {Function}
		 * @public
		 */
		onMoreClick: PropTypes.func,

		/**
		 * Called when the user clicks the Play button.
		 *
		 * @type {Function}
		 * @public
		 */
		onPlayButtonClick: PropTypes.func,

		/**
		 * `true` when the video is paused.
		 *
		 * @type {Boolean}
		 * @public
		 */
		paused: PropTypes.bool,

		/**
		 * A string which is sent to the `pause` icon of the player controls. This can be
		 * anything that is accepted by [Icon]{@link moonstone/Icon.Icon}. This will be temporarily replaced by
		 * the [playIcon]{@link moonstone/VideoPlayer.MediaControls.playIcon} when the
		 * [paused]{@link moonstone/VideoPlayer.MediaControls.paused} boolean is `false`.
		 *
		 * @type {String}
		 * @default 'pause'
		 * @public
		 */
		pauseIcon: PropTypes.string,

		/**
		 * A string which is sent to the `play` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon.Icon}. This will be temporarily replaced by
		 * the [pauseIcon]{@link moonstone/VideoPlayer.MediaControls.pauseIcon} when the
		 * [paused]{@link moonstone/VideoPlayer.MediaControls.paused} boolean is `true`.
		 *
		 * @type {String}
		 * @default 'play'
		 * @public
		 */
		playIcon: PropTypes.string,

		/**
		 * Disables the media "play"/"pause" button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		playPauseButtonDisabled: PropTypes.bool,

		/**
		 * Disables the media playback-rate control buttons; the inner pair.
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
		 * When `true`, more components are visible.
		 *
		 * @type {Boolean}
		 * @private
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
		 * The spotlight ID for the media controls container.
		 *
		 * @type {String}
		 * @public
		 * @default 'mediaControls'
		 */
		spotlightId: PropTypes.string,

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
		spotlightId: 'mediaControls',
		moreButtonColor: 'blue',
		pauseIcon: 'pause',
		playIcon: 'play',
		visible: true
	},

	styles: {
		css,
		className: 'controlsFrame'
	},

	computed: {
		className: ({visible, styler}) => styler.append({hidden: !visible}),
		centerClassName: ({showMoreComponents, styler}) => styler.join('centerComponents', {more: showMoreComponents}),
		playPauseClassName: ({showMoreComponents}) => showMoreComponents ? null : spotlightDefaultClass,
		moreButtonClassName: ({showMoreComponents, styler}) => styler.join('moreButton', {[spotlightDefaultClass]: showMoreComponents}),
		moreIconLabel: ({moreButtonCloseLabel = $L('Back'), moreButtonLabel = $L('More'), showMoreComponents}) => showMoreComponents ? moreButtonCloseLabel : moreButtonLabel,
		moreIcon: ({showMoreComponents}) => showMoreComponents ? 'arrowshrinkleft' : 'ellipsis'
	},

	render: ({
		backwardIcon,
		centerClassName,
		children,
		forwardIcon,
		jumpBackwardIcon,
		jumpButtonsDisabled,
		jumpForwardIcon,
		leftComponents,
		mediaDisabled,
		moreButtonClassName,
		moreButtonColor,
		moreButtonDisabled,
		moreButtonSpotlightId,
		moreIcon,
		moreIconLabel,
		noJumpButtons,
		noRateButtons,
		onBackwardButtonClick,
		onForwardButtonClick,
		onJumpBackwardButtonClick,
		onJumpForwardButtonClick,
		onMoreClick,
		onPlayButtonClick,
		paused,
		pauseIcon,
		playIcon,
		playPauseButtonDisabled,
		playPauseClassName,
		rateButtonsDisabled,
		rightComponents,
		showMoreComponents,
		spotlightDisabled,
		spotlightId,
		...rest
	}) => {
		delete rest.moreButtonCloseLabel;
		delete rest.moreButtonLabel;
		delete rest.onClose;
		delete rest.visible;

		return (
			<OuterContainer {...rest} spotlightId={spotlightId}>
				<div className={css.leftComponents}>{leftComponents}</div>
				<div className={css.centerComponentsContainer}>
					<div className={centerClassName}>
						<Container className={css.mediaControls} spotlightDisabled={showMoreComponents || spotlightDisabled}>
							{noJumpButtons ? null : <MediaButton aria-label={$L('Previous')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpBackwardButtonClick} spotlightDisabled={spotlightDisabled}>{jumpBackwardIcon}</MediaButton>}
							{noRateButtons ? null : <MediaButton aria-label={$L('Rewind')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onBackwardButtonClick} spotlightDisabled={spotlightDisabled}>{backwardIcon}</MediaButton>}
							<MediaButton aria-label={paused ? $L('Play') : $L('Pause')} className={playPauseClassName} backgroundOpacity="translucent" disabled={mediaDisabled || playPauseButtonDisabled} onClick={onPlayButtonClick} spotlightDisabled={spotlightDisabled}>{paused ? playIcon : pauseIcon}</MediaButton>
							{noRateButtons ? null : <MediaButton aria-label={$L('Fast Forward')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onForwardButtonClick} spotlightDisabled={spotlightDisabled}>{forwardIcon}</MediaButton>}
							{noJumpButtons ? null : <MediaButton aria-label={$L('Next')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpForwardButtonClick} spotlightDisabled={spotlightDisabled}>{jumpForwardIcon}</MediaButton>}
						</Container>
						<Container className={css.moreControls} spotlightDisabled={!showMoreComponents || spotlightDisabled}>
							{children}
						</Container>
					</div>
				</div>
				<div className={css.rightComponents}>
					{rightComponents}
					{countReactChildren(children) ? (
						<MediaButton
							aria-label={moreIconLabel}
							backgroundOpacity="translucent"
							className={moreButtonClassName}
							color={moreButtonColor}
							disabled={moreButtonDisabled}
							onClick={onMoreClick}
							tooltipProps={{role: 'dialog'}}
							tooltipText={moreIconLabel}
							spotlightId={moreButtonSpotlightId}
							spotlightDisabled={spotlightDisabled}
						>
							{moreIcon}
						</MediaButton>
					) : null}
				</div>
			</OuterContainer>
		);
	}
});

/**
 * Media control behaviors to apply to [MediaControlsBase]{@link moonstone/VideoPlayer.MediaControlsBase}.
 * Provides built-in support for showing more components and key handling for basic playback
 * controls.
 *
 * @class MediaControlsDecorator
 * @memberof moonstone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @hoc
 * @private
 */
const MediaControlsDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars
	class MediaControlsDecoratorHOC extends React.Component {
		static displayName = 'MediaControlsDecorator'

		static propTypes = /** @lends moonstone/VideoPlayer.MediaControlsDecorator.prototype */ {
			/**
			 * The number of milliseconds that the player will pause before firing the
			 * first jump event on a right or left pulse.
			 *
			 * @type {Number}
			 * @default 400
			 * @public
			 */
			initialJumpDelay: PropTypes.number,

			/**
			 * The number of milliseconds that the player will throttle before firing a
			 * jump event on a right or left pulse.
			 *
			 * @type {Number}
			 * @default 200
			 * @public
			 */
			jumpDelay: PropTypes.number,

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
			 * Disables the media buttons.
			 *
			 * @type {Boolean}
			 * @public
			 */
			mediaDisabled: PropTypes.bool,

			/**
			 * The color of the underline beneath more icon button.
			 *
			 * This property accepts one of the following color names, which correspond with the
			 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
			 *
			 * @type {String}
			 * @see {@link moonstone/IconButton.IconButtonBase.color}
			 * @default 'blue'
			 * @public
			 */
			moreButtonColor: PropTypes.oneOf(['red', 'green', 'yellow', 'blue']),

			/**
			 * Disables the media "more" button.
			 *
			 * @type {Boolean}
			 * @public
			 */
			moreButtonDisabled: PropTypes.bool,

			/**
			 * A custom more button ID to use with Spotlight.
			 *
			 * @type {String}
			 * @default 'mediaButton'
			 * @public
			 */
			moreButtonSpotlightId: PropTypes.string,

			/**
			 * Setting this to `true` will disable left and right keys for seeking.
			 *
			 * @type {Boolean}
			 * @public
			 */
			no5WayJump: PropTypes.bool,

			/**
			 * Removes the "rate" buttons. The buttons that change the playback rate of the video.
			 * Double speed, half speed, reverse 4x speed, etc.
			 *
			 * @type {Boolean}
			 * @public
			 */
			noRateButtons: PropTypes.bool,

			/**
			 * Called when media fast forwards.
			 *
			 * @type {Function}
			 * @public
			 */
			onFastForward: PropTypes.func,

			/**
			 * Called when media jumps.
			 *
			 * @type {Function}
			 * @public
			 */
			onJump: PropTypes.func,

			/**
			 * Called when media gets paused.
			 *
			 * @type {Function}
			 * @public
			 */
			onPause: PropTypes.func,

			/**
			 * Called when media starts playing.
			 *
			 * @type {Function}
			 * @public
			 */
			onPlay: PropTypes.func,

			/**
			 * Called when media rewinds.
			 *
			 * @type {Function}
			 * @public
			 */
			onRewind: PropTypes.func,

			/**
			 * Called when the user clicks the More button.
			 *
			 * @type {Function}
			 * @public
			 */
			onToggleMore: PropTypes.func,

			/**
			 * The video pause state.
			 *
			 * @type {Boolean}
			 * @public
			 */
			paused: PropTypes.bool,

			/**
			 * Disables state on the media "play"/"pause" button
			 *
			 * @type {Boolean}
			 * @public
			 */
			playPauseButtonDisabled: PropTypes.bool,

			/**
			 * Disables the media playback-rate control buttons; the inner pair.
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
			 * Registers the MediaControls component with an
			 * [ApiDecorator]{@link core/internal/ApiDecorator.ApiDecorator}.
			 *
			 * @type {Function}
			 * @private
			 */
			setApiProvider: PropTypes.func,

			/**
			 * The visibility of the component. When `false`, the component will be hidden.
			 *
			 * @type {Boolean}
			 * @public
			 */
			visible: PropTypes.bool
		}

		static defaultProps = {
			initialJumpDelay: 400,
			jumpDelay: 200,
			moreButtonColor: 'blue',
			moreButtonSpotlightId: 'moreButton'
		}

		constructor (props) {
			super(props);
			this.mediaControlsNode = null;

			this.keyLoop = null;
			this.pulsingKeyCode = null;
			this.pulsing = null;
			this.paused = new Pause('VideoPlayer');

			this.state = {
				showMoreComponents: false
			};

			if (props.setApiProvider) {
				props.setApiProvider(this);
			}
		}

		componentDidMount () {
			this.calculateMaxComponentCount(
				countReactChildren(this.props.leftComponents),
				countReactChildren(this.props.rightComponents),
				countReactChildren(this.props.children)
			);
			on('keydown', this.handleKeyDown);
			on('keyup', this.handleKeyUp);
		}

		componentWillReceiveProps (nextProps) {
			// Detect if the number of components has changed
			const leftCount = countReactChildren(nextProps.leftComponents),
				rightCount = countReactChildren(nextProps.rightComponents),
				childrenCount = countReactChildren(nextProps.children);

			if (
				countReactChildren(this.props.leftComponents) !== leftCount ||
				countReactChildren(this.props.rightComponents) !== rightCount ||
				countReactChildren(this.props.children) !== childrenCount
			) {
				this.calculateMaxComponentCount(leftCount, rightCount, childrenCount);
			}

			if (this.props.visible && !nextProps.visible) {
				this.setState(() => {
					return {
						showMoreComponents: false
					};
				});
			}
		}

		componentDidUpdate (prevProps, prevState) {
			if (this.state.showMoreComponents !== prevState.showMoreComponents) {
				forwardToggleMore({showMoreComponents: this.state.showMoreComponents}, this.props);
			}

			// if media controls disabled, reset key loop
			if (!prevProps.mediaDisabled && this.props.mediaDisabled) {
				this.stopListeningForPulses();
				this.paused.resume();
			}
		}

		componentWillUnmount () {
			off('keydown', this.handleKeyDown);
			off('keyup', this.handleKeyUp);
			this.stopListeningForPulses();
		}

		handleMoreClick = () => {
			this.toggleMoreComponents();
		}

		handleKeyDown = (ev) => {
			const {
				mediaDisabled,
				no5WayJump,
				visible
			} = this.props;

			const current = Spotlight.getCurrent();

			if (!no5WayJump &&
					!visible &&
					!mediaDisabled &&
					(!current || current.classList.contains(css.controlsHandleAbove)) &&
					(is('left', ev.keyCode) || is('right', ev.keyCode))) {
				this.paused.pause();
				this.startListeningForPulses(ev.keyCode);
			}
		}

		handleKeyUp = (ev) => {
			const {
				mediaDisabled,
				moreButtonColor,
				moreButtonDisabled,
				no5WayJump,
				noRateButtons,
				playPauseButtonDisabled,
				rateButtonsDisabled,
				visible
			} = this.props;

			if (mediaDisabled) return;

			if (visible && moreButtonColor && !moreButtonDisabled && is(moreButtonColor, ev.keyCode)) {
				this.toggleMoreComponents();
			}

			if (!playPauseButtonDisabled) {
				if (is('play', ev.keyCode)) {
					forward('onPlay', ev, this.props);
				} else if (is('pause', ev.keyCode)) {
					forward('onPause', ev, this.props);
				}
			}

			if (!no5WayJump && (is('left', ev.keyCode) || is('right', ev.keyCode))) {
				this.stopListeningForPulses();
				this.paused.resume();
			}

			if (!noRateButtons && !rateButtonsDisabled) {
				if (is('rewind', ev.keyCode)) {
					forward('onRewind', ev, this.props);
				} else if (is('fastForward', ev.keyCode)) {
					forward('onFastForward', ev, this.props);
				}
			}
		}

		startListeningForPulses = (keyCode) => {
			// Ignore new pulse calls if key code is same, otherwise start new series if we're pulsing
			if (this.pulsing && keyCode !== this.pulsingKeyCode) {
				this.stopListeningForPulses();
			}
			if (!this.pulsing) {
				this.pulsingKeyCode = keyCode;
				this.pulsing = true;
				this.keyLoop = setTimeout(this.handlePulse, this.props.initialJumpDelay);
				forward('onJump', {keyCode}, this.props);
			}
		}

		handlePulse = () => {
			forward('onJump', {keyCode: this.pulsingKeyCode}, this.props);
			this.keyLoop = setTimeout(this.handlePulse, this.props.jumpDelay);
		}

		handlePlayButtonClick = (ev) => {
			forward('onPlayButtonClick', ev, this.props);
			if (this.props.paused) {
				forward('onPlay', ev, this.props);
			} else {
				forward('onPause', ev, this.props);
			}
		}

		stopListeningForPulses () {
			this.pulsing = false;
			if (this.keyLoop) {
				clearTimeout(this.keyLoop);
				this.keyLoop = null;
			}
		}

		calculateMaxComponentCount = (leftCount, rightCount, childrenCount) => {
			// If the "more" button is present, automatically add it to the right's count.
			if (childrenCount) {
				rightCount += 1;
			}

			const max = Math.max(leftCount, rightCount);

			this.mediaControlsNode.style.setProperty('--moon-video-player-max-side-components', max);
		}

		getMediaControls = (node) => {
			this.mediaControlsNode = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node
		}

		areMoreComponentsAvailable () {
			return this.state.showMoreComponents;
		}

		showMoreComponents () {
			this.setState({showMoreComponents: true});
		}

		hideMoreComponents () {
			this.setState({showMoreComponents: false});
		}

		toggleMoreComponents () {
			this.setState((prevState) => {
				return {
					showMoreComponents: !prevState.showMoreComponents
				};
			});
		}

		handleClose = (ev) => {
			if (this.state.showMoreComponents) {
				this.toggleMoreComponents();
				ev.stopPropagation();
			} else if (this.props.visible) {
				forward('onClose', ev, this.props);
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.initialJumpDelay;
			delete props.jumpDelay;
			delete props.no5WayJump;
			delete props.onFastForward;
			delete props.onJump;
			delete props.onPause;
			delete props.onPlay;
			delete props.onRewind;
			delete props.onToggleMore;
			delete props.setApiProvider;

			return (
				<Wrapped
					ref={this.getMediaControls}
					{...props}
					onClose={this.handleClose}
					onMoreClick={this.handleMoreClick}
					onPlayButtonClick={this.handlePlayButtonClick}
					showMoreComponents={this.state.showMoreComponents}
				/>
			);
		}
	}

	return Slottable({slots: ['leftComponents', 'rightComponents']}, MediaControlsDecoratorHOC);
});

const handleCancel = (ev, {onClose}) => {
	if (onClose) {
		onClose(ev);
	}
};

/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * This uses [Slottable]{@link ui/Slottable} to accept the custom tags, `<leftComponents>`
 * and `<rightComponents>`, to add components to the left and right of the media
 * controls. Any additional children will be rendered into the "more" controls area causing the
 * "more" button to appear. Showing the additional components is handled by `MediaControls` when the
 * user taps the "more" button.
 *
 * @class MediaControls
 * @memberof moonstone/VideoPlayer
 * @mixes ui/Cancelable.Cancelable
 * @ui
 * @public
 */
const MediaControls = ApiDecorator(
	{api: [
		'areMoreComponentsAvailable',
		'showMoreComponents',
		'hideMoreComponents'
	]},
	MediaControlsDecorator(
		Cancelable({modal: true, onCancel: handleCancel}, MediaControlsBase)
	)
);

MediaControls.defaultSlot = 'mediaControlsComponent';

export default MediaControls;
export {
	MediaControlsBase,
	MediaControls,
	MediaControlsDecorator
};
