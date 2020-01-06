
import {forKey, handle} from '@enact/core/handle';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import Cancelable from '@enact/ui/Cancelable';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {on, off} from '@enact/core/dispatcher';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
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

import css from './VideoPlayer.module.less';
import Icon from '../Icon/Icon';

const OuterContainer = SpotlightContainerDecorator({
	defaultElement: [
		`.${spotlightDefaultClass}`
	]
}, 'div');
const Container = SpotlightContainerDecorator({enterTo: ''}, 'div');
const MediaButton = onlyUpdateForKeys([
	'children',
	'className',
	'color',
	'disabled',
	'flip',
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
		 * @default 'jumpbackward'
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
		 * @default 'jumpforward'
		 * @public
		 */
		jumpForwardIcon: PropTypes.string,

		/**
		 * Disables the media buttons.
		 *
		 * @type {Boolean}
		 * @public
		 */
		mediaDisabled: PropTypes.bool,

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
		onKeyDownFromMediaControls: PropTypes.func,

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
		 * Indicates rtl locale.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * When `true`, more components are visible.
		 *
		 * @type {Boolean}
		 * @private
		 */
		showBottomComponents: PropTypes.bool,

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
		jumpBackwardIcon: 'jumpbackward',
		jumpForwardIcon: 'jumpforward',
		spotlightId: 'mediaControls',
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
		childrenContainerClassName: ({styler}) => styler.append('mediaControls', 'childrenContainerComponents'),
		guideClassName: ({styler, showBottomComponents}) => styler.join('guideComponents', {hidden: showBottomComponents}),
		bottomClassName: ({styler, showBottomComponents}) => styler.join('bottomContainerComponents', {lift: showBottomComponents}),
		playPauseClassName: ({showBottomComponents}) => showBottomComponents ? null : spotlightDefaultClass
	},

	render: ({
		backwardIcon,
		children,
		forwardIcon,
		jumpBackwardIcon,
		jumpButtonsDisabled,
		bottomClassName,
		jumpForwardIcon,
		bottomComponents,
		mediaDisabled,
		moreButtonDisabled,
		moreButtonSpotlightId,
		noJumpButtons,
		noRateButtons,
		onBackwardButtonClick,
		onForwardButtonClick,
		onJumpBackwardButtonClick,
		onJumpForwardButtonClick,
		onKeyDownFromMediaControls,
		onPlayButtonClick,
		paused,
		pauseIcon,
		playIcon,
		playPauseButtonDisabled,
		playPauseClassName,
		rateButtonsDisabled,
		showBottomComponents,
		bottomComponentRendered,
		childrenContainerClassName,
		guideClassName,
		spotlightDisabled,
		spotlightId,
		...rest
	}) => {
		delete rest.moreButtonLabel;
		delete rest.onClose;
		delete rest.visible;

		return (
			<OuterContainer {...rest} spotlightId={spotlightId}>
				<Container className={css.mediaControls} spotlightDisabled={spotlightDisabled} onKeyDown={onKeyDownFromMediaControls}>
					{noJumpButtons ? null : <MediaButton aria-label={$L('Previous')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpBackwardButtonClick} size="large" spotlightDisabled={spotlightDisabled}>{jumpBackwardIcon}</MediaButton>}
					{noRateButtons ? null : <MediaButton aria-label={$L('Rewind')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onBackwardButtonClick} size="large" spotlightDisabled={spotlightDisabled}>{backwardIcon}</MediaButton>}
					<MediaButton aria-label={paused ? $L('Play') : $L('Pause')} className={playPauseClassName} backgroundOpacity="translucent" disabled={mediaDisabled || playPauseButtonDisabled} onClick={onPlayButtonClick} size="large" spotlightDisabled={spotlightDisabled}>{paused ? playIcon : pauseIcon}</MediaButton>
					{noRateButtons ? null : <MediaButton aria-label={$L('Fast Forward')} backgroundOpacity="translucent" disabled={mediaDisabled || rateButtonsDisabled} onClick={onForwardButtonClick} size="large" spotlightDisabled={spotlightDisabled}>{forwardIcon}</MediaButton>}
					{noJumpButtons ? null : <MediaButton aria-label={$L('Next')} backgroundOpacity="translucent" disabled={mediaDisabled || jumpButtonsDisabled} onClick={onJumpForwardButtonClick} size="large" spotlightDisabled={spotlightDisabled}>{jumpForwardIcon}</MediaButton>}
				</Container>
				{countReactChildren(children) || bottomComponents ?
					<div className={guideClassName} >
						<Icon>arrowlargedown</Icon>
						<div>Scroll or Press V Button</div>
					</div> :
					null
				}
				{bottomComponentRendered || showBottomComponents ?
					<Container className={bottomClassName} spotlightDisabled={!showBottomComponents}>
						{countReactChildren(children) ?
							<Container className={childrenContainerClassName} >
								{children}
							</Container> :
							null
						}
						{bottomComponents ?
							<div className={css.bottomComponent} >
								{bottomComponents}
							</div> : null
						}
					</Container> :
					null
				}
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
			 * Disables the media buttons.
			 *
			 * @type {Boolean}
			 * @public
			 */
			mediaDisabled: PropTypes.bool,

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
				showBottomComponents: false,
				moreComponentRendered: false
			};

			if (props.setApiProvider) {
				props.setApiProvider(this);
			}
		}

		static getDerivedStateFromProps (props) {
			if (!props.visible) {
				return {
					showBottomComponents: false
				};
			}
			return null;
		}

		componentDidMount () {
			on('keydown', this.handleKeyDown);
			on('keyup', this.handleKeyUp);
			on('blur', this.handleBlur, window);
		}

		componentDidUpdate (prevProps, prevState) {
			if (!prevState.showBottomComponents && this.state.showBottomComponents) {
				// eslint-disable-next-line
				this.setState({
					bottomComponentRendered: true
				});
				this.mediaControlsNode.style.setProperty('--guideComponentHeight', `${this.getHeightForElement('guideComponents')}px`);
			}

			if (this.state.showBottomComponents !== prevState.showBottomComponents) {
				forwardToggleMore({showBottomComponents: this.state.showBottomComponents}, this.props);
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
			off('blur', this.handleBlur, window);
			this.stopListeningForPulses();
		}

		handleControlsKeyUp = (e) => {
			if (is('down', e.keyCode) && !this.state.showBottomComponents) {
				this.showBottomComponents();
				e.stopPropagation();
			}
		}

		getHeightForElement = (elementName) => {
			const element = this.mediaControlsNode.querySelector(`.${css[elementName]}`);
			if (element) {
				return element.offsetHeight;
			} else {
				return 0;
			}
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
				moreButtonDisabled,
				no5WayJump,
				noRateButtons,
				playPauseButtonDisabled,
				rateButtonsDisabled,
				visible
			} = this.props;

			if (mediaDisabled) return;

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

		handleBlur = () => {
			this.stopListeningForPulses();
			this.paused.resume();
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

		getMediaControls = (node) => {
			this.mediaControlsNode = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node
		}

		areMoreComponentsAvailable = () => {
			return this.state.showBottomComponents;
		}

		showBottomComponents = () => {
			this.setState({showBottomComponents: true});
		}

		hideMoreComponents = () => {
			this.setState({showBottomComponents: false});
		}

		toggleMoreComponents () {
			this.setState((prevState) => {
				return {
					showBottomComponents: !prevState.showBottomComponents
				};
			});
		}

		handleClose = (ev) => {
			if (this.props.visible) {
				forward('onClose', ev, this.props);
			}
		}

		handleTransitionEnd = (ev) => {
			if (ev.propertyName === 'transform') {
				if (this.state.showBottomComponents) {
					Spotlight.move('down');
				}
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
					bottomComponentRendered={this.state.bottomComponentRendered}
					onClose={this.handleClose}
					onKeyDownFromMediaControls={this.handleControlsKeyUp}
					onPlayButtonClick={this.handlePlayButtonClick}
					onTransitionEnd={this.handleTransitionEnd}
					showBottomComponents={this.state.showBottomComponents}
				/>
			);
		}
	}

	return Slottable({slots: ['bottomComponents']}, MediaControlsDecoratorHOC);
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
		'showBottomComponents',
		'hideMoreComponents'
	]},
	MediaControlsDecorator(
		Cancelable({modal: true, onCancel: handleCancel},
			I18nContextDecorator({rtlProp: 'rtl'}, MediaControlsBase)
		)
	)
);

MediaControls.defaultSlot = 'mediaControlsComponent';

export default MediaControls;
export {
	MediaControlsBase,
	MediaControls,
	MediaControlsDecorator
};
