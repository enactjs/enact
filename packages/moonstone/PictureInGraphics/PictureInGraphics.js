import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import equals from 'ramda/src/equals';

import Slottable from '@enact/ui/Slottable';
import Spottable from '@enact/spotlight/Spottable';
import {forward} from '@enact/core/handle';

import Image from '../Image';
import Skinnable from '../Skinnable';
import {MarqueeController, MarqueeText} from '../Marquee';

import css from './PictureInGraphics.less';

const Container = MarqueeController({marqueeOnFocus: true}, Spottable('div'));

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

class PictureInGraphicsBase extends React.Component {
	static propTypes = {
		/**
		 * Any children `<source>` tag elements will
		 * be sent directly to the `<video>` element as video sources.
		 *
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.node.isRequired,
		/**
		 * Component is displayed below video area.
		 *
		 * @type {Node}
		 * @public
		 */
		captionComponent: PropTypes.node,
		/**
		 * Image path for image overlay
		 *
		 * @type {String}
		 * @public
		 */
		imageOverlaySrc: PropTypes.string,
		/**
		 *
		 * @type {Function}
		 * @public
		 */
		onLoadedMetadata: PropTypes.func,
		/**
		 * It is called when video area is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onVideoClick: PropTypes.func,
		/**
		 * Placeholder for image overlay
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,
		/**
		 * When `true`, spotlight is disabled and onVideoClick event does not occur.
		 *
		 * @type {Boolean}
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,
		/**
		 * Font color of text overlay. It is a hexadecimal string.
		 *
		 * @type {String}
		 * @public
		 */
		textOverlayColor: PropTypes.string,
		/**
		 * Text of text overlay
		 *
		 * @type {String}
		 * @public
		 */
		textOverlayContent: PropTypes.string
	}

	static defaultProps = {
		placeholder: defaultPlaceholder
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
		const {
			className,
			source,
			placeholder,
			imageOverlaySrc,
			textOverlayContent,
			captionComponent,
			spotlightDisabled,
			textOverlayColor,
			...rest} = this.props;

		delete rest.onLoadedMetadata;
		delete rest.onVideoClick;

		const containerClassName = classNames(className, css.pictureInGraphics);
		const textOverlayStyle = {color: textOverlayColor};

		return (
			<Container {...rest} className={containerClassName} spotlightDisabled={spotlightDisabled}>
				<div className={css.videoContainer} onClick={this.handleClick} >
					<video
						className={css.video}
						autoPlay
						controls={false}
						ref={this.setVideoRef}
						onLoadedMetadata={this.handleLoadedMetadata}
					>
						{source}
					</video>
					{imageOverlaySrc ? <Image placeholder={placeholder} className={css.image} src={imageOverlaySrc} /> : null}
					{textOverlayContent ? (<MarqueeText alignment="center" className={css.textOverlay} style={textOverlayStyle}>{textOverlayContent}</MarqueeText>) : null}
				</div>
				<div className={css.captionContainer}>
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
