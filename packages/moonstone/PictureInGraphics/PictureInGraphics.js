import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import equals from 'ramda/src/equals';

import Slottable from '@enact/ui/Slottable';
import Spottable from '@enact/spotlight/Spottable';
import {forward} from '@enact/core/handle';

import Image from '../Image';
import Skinnable from '../Skinnable';
import {ItemBase} from '../Item';
import {MarqueeController, MarqueeText} from '../Marquee';

import css from './PictureInGraphics.less';

const Container = MarqueeController({marqueeOnFocus: true}, Spottable(ItemBase));

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

class PictureInGraphicsBase extends React.Component {
	static propTypes = {
		source: PropTypes.node.isRequired,
		captionComponent: PropTypes.node,
		imageOverlayShowing: PropTypes.bool,
		imageOverlaySrc: PropTypes.string,
		isIpChannel: PropTypes.bool,
		placeholder: PropTypes.string,
		spotlightDisabled: PropTypes.bool,
		textOverlayContent: PropTypes.string
	}

	static defaultProps = {
		imageOverlayShowing: false,
		placeholder: defaultPlaceholder,
		imageOverlaySrc: '',
		isIpChannel: false,
		spotlightDisabled: false
	}

	constructor (props) {
		super(props);
		this.video = null;
	}

	componentDidMount () {
		this.video.load();
	}

	componentDidUpdate (prevProps) {
		const {source} = this.props;
		const {source: prevSource} = prevProps;

		if (prevSource !== source && !equals(source, prevSource)) {
			this.video.load();
		}
	}

	handleLoadedMetadata = (ev) => {
		forward('onLoadedMetadata', ev, this.props);
	}

	setVideoRef = (video) => {
		this.video = video;
	}

	handleClick = (ev) => {
		if (!this.props.spotlightDisabled) {
			forward('onVideoClick', ev, this.props);
		}
	};

	render () {
		const {className, source, placeholder, imageOverlayShowing, imageOverlaySrc, textOverlayContent, captionComponent, isIpChannel, spotlightDisabled, ...rest} = this.props;
		const containerClassName = classNames(className, css['pictureInGraphics']);
		const textOverlayClassName = classNames(css.textOverlay, isIpChannel ? css.ipChannel : null);

		delete rest.onLoadedMetadata;
		delete rest.onReceivedVideoState;

		return (
			<Container className={containerClassName} spotlightDisabled={spotlightDisabled}>
				<div className={css['videoContainer']} onClick={this.handleClick} >
					<video
						className={css.video}
						autoPlay
						controls={false}
						ref={this.setVideoRef}
						onLoadedMetadata={this.handleLoadedMetadata}
					>
						{source}
					</video>
					{imageOverlayShowing ?
						<div>
							<Image placeholder={placeholder} className={css.image} src={imageOverlaySrc} />
							{textOverlayContent ? (<MarqueeText alignment="center" className={textOverlayClassName}>{textOverlayContent}</MarqueeText>) : null}
						</div> :
						null
					}
				</div>
				<div className={css['captionContainer']}>
					{captionComponent}
				</div>
			</Container>
		);
	}
}

const PictureInGraphics = Slottable(
	{slots: ['captionComponent', 'source']},
	Skinnable(PictureInGraphicsBase)
);

export default PictureInGraphics;
export {PictureInGraphics, PictureInGraphicsBase};
