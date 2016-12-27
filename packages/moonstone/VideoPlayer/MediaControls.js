import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import {SpotlightContainerDecorator} from '@enact/spotlight';

import IconButton from '../IconButton';

import css from './VideoPlayer.less';

const Container = SpotlightContainerDecorator('div');
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

	propTypes: {
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
		rightComponents: React.PropTypes.node
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
		moreIcon: ({showMoreComponents}) => showMoreComponents ? 'arrowhookleft' : 'ellipsis'
	},

	render: (props) => {
		const {
			centerClassName,
			children,
			leftComponents,
			mediaDisabled,
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

		delete rest.showMoreComponents;

		return (
			<div {...rest}>
				<div className={css.leftComponents}>{leftComponents}</div>
				<div className={css.centerComponentsContainer}>
					<div className={centerClassName}>
						<Container className={css.mediaControls} data-container-disabled={mediaDisabled}> {/* rtl={false} */}
							{noJumpButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaDisabled} onClick={onJumpBackwardButtonClick}>skipbackward</MediaButton>}
							{noRateButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaDisabled} onClick={onBackwardButtonClick}>backward</MediaButton>}
							<MediaButton backgroundOpacity="translucent" disabled={mediaDisabled} onClick={onPlayButtonClick}>{playPauseIcon}</MediaButton>
							{noRateButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaDisabled} onClick={onForwardButtonClick}>forward</MediaButton>}
							{noJumpButtons ? null : <MediaButton backgroundOpacity="translucent" disabled={mediaDisabled} onClick={onJumpForwardButtonClick}>skipforward</MediaButton>}
						</Container>
						<Container className={css.moreControls} data-container-disabled={moreDisabled}>
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
