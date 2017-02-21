import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight';

import IconButton from '../IconButton';

import css from './VideoPlayer.less';

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
		leftComponents: React.PropTypes.node,
		mediaDisabled: React.PropTypes.bool,
		moreDisabled: React.PropTypes.bool,
		noJumpButtons: React.PropTypes.bool,
		noRateButtons: React.PropTypes.bool,
		onBackwardButtonClick: React.PropTypes.func,
		onForwardButtonClick: React.PropTypes.func,
		onJumpBackwardButtonClick: React.PropTypes.func,
		onJumpForwardButtonClick: React.PropTypes.func,
		onPlayButtonClick: React.PropTypes.func,
		onToggleMore: React.PropTypes.func,
		playPauseIcon:React.PropTypes.node,
		rightComponents: React.PropTypes.node,
		showMoreComponents: React.PropTypes.bool
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
		moreIcon: ({showMoreComponents}) => showMoreComponents ? 'arrowhookleft' : 'ellipsis'
	},

	render: (props) => {
		const {
			centerClassName,
			children,
			leftComponents,
			mediaControlsDisabled,
			moreDisabled,
			moreIcon,
			noJumpButtons,
			noRateButtons,
			onBackwardButtonClick,
			onForwardButtonClick,
			onJumpBackwardButtonClick,
			onJumpForwardButtonClick,
			onPlayButtonClick,
			onToggleMore,
			playPauseIcon,
			rightComponents,
			...rest
		} = props;

		delete rest.mediaDisabled;
		delete rest.showMoreComponents;

		return (
			<div {...rest}>
				<div className={css.leftComponents}>{leftComponents}</div>
				<div className={css.centerComponentsContainer}>
					<div className={centerClassName}>
						<Container className={css.mediaControls} spotlightDisabled={mediaControlsDisabled}> {/* rtl={false} */}
							{noJumpButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaControlsDisabled} onClick={onJumpBackwardButtonClick}>skipbackward</MediaButton>}
							{noRateButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaControlsDisabled} onClick={onBackwardButtonClick}>backward</MediaButton>}
							<MediaButton className={spotlightDefaultClass} backgroundOpacity="translucent" disabled={mediaControlsDisabled} onClick={onPlayButtonClick}>{playPauseIcon}</MediaButton>
							{noRateButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaControlsDisabled} onClick={onForwardButtonClick}>forward</MediaButton>}
							{noJumpButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaControlsDisabled} onClick={onJumpForwardButtonClick}>skipforward</MediaButton>}
						</Container>
						<Container className={css.moreControls} spotlightDisabled={moreDisabled}>
							{children}
						</Container> {/* rtl={false} */}
					</div>
				</div>
				<div className={css.rightComponents}>
					{rightComponents}
					{children ? <MediaButton backgroundOpacity="translucent" className={css.moreButton} onClick={onToggleMore}>{moreIcon}</MediaButton> : null}
				</div>
			</div>
		);
	}
});

export default MediaControls;
export {MediaControls};
