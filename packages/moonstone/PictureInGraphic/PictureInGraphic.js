import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Slottable from '@enact/ui/Slottable';
import Spottable from '@enact/spotlight/Spottable';
import ri from '@enact/ui/resolution';
import {forward} from '@enact/core/handle';

import Image from '../Image';
import Skinnable from '../Skinnable';
import {ItemBase} from '../Item';
import {MarqueeController, MarqueeText} from '../Marquee';

import {subscribeVideoState, launchApp} from '@enact/webos/PictureInGraphic';

import css from './PictureInGraphic.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

class PictureInGraphicBase extends React.Component {
	static propTypes = {
		source: PropTypes.string.isRequired,
		sourceType: PropTypes.oneOf(['broadcast', 'externalInput']).isRequired,
		captionComponent: PropTypes.node,
		imageOverlayShowing: PropTypes.bool,
		imageOverlaySrc: PropTypes.string,
		isIpChannel: PropTypes.bool,
		pigHeight: PropTypes.number,
		pigWidth: PropTypes.number,
		placeholder: PropTypes.string,
		textOverlayContent: PropTypes.string
	}

	static defaultProps = {
		imageOverlayShowing: true,
		placeholder: defaultPlaceholder,
		imageOverlaySrc: '',
		isIpChannel: false,
		pigWidth: 320,
		pigHeight: 186
	}

	constructor (props) {
		super(props);
		this.video = null;
	}

	componentDidMount () {
		this.video.load();
	}

	componentDidUpdate (prevProps) {
		const {sourceType, source} = this.props;
		const {sourceType: prevSourceType, source: prevSource} = prevProps;

		if (sourceType !== prevSourceType || source !== prevSource) {
			this.video.load();
		}
	}

	getExternalInputSource = (inputType = '') => {
		switch (inputType) {
			case 'HDMI_1':
				return 'ext://hdmi:1';
			case 'HDMI_2':
				return 'ext://hdmi:2';
			case 'HDMI_3':
				return 'ext://hdmi:3';
			case 'HDMI_4':
				return 'ext://hdmi:4';
			case 'COMPONENT':
				return 'ext://comp:1';
			case 'AV_1':
				return 'ext://av:1';
			case 'AV_2':
				return 'ext://av:2';
			default:
				return '';
		}
	};
	getBroadcastSource = (channelId = '') => {
		return 'tv://' + channelId;
	};

	handleLoadedMetadata = (ev) => {
		const {sourceType} = this.props;

		subscribeVideoState(ev.target.mediaId, sourceType, {
			onSuccess: (res) => {
				forward('onReceivedVideoState', res, this.props);
			},
			onFailure: (res) => {
				forward('onReceivedVideoState', res, this.props);
			}
		});
		forward('onLoadedMetadata', ev, this.props);
	}

	setVideoRef = (video) => {
		this.video = video;
	}

	handleClick = () => {
		const {sourceType, source} = this.props;
		let id = '';

		if (sourceType === 'broadcast') {
			id = 'com.webos.app.livetv';
		} else if (sourceType === 'externalInput') {
			switch (source) {
				case 'HDMI_1':
					id = 'com.webos.app.hdmi1';
					break;
				case 'HDMI_2':
					id = 'com.webos.app.hdmi2';
					break;
				case 'HDMI_3':
					id = 'com.webos.app.hdmi3';
					break;
				case 'HDMI_4':
					id = 'com.webos.app.hdmi4';
					break;
				case 'COMPONENT':
					id = 'com.webos.app.externalinput.component';
					break;
				case 'AV_1':
					id = 'com.webos.app.externalinput.av1';
					break;
				case 'AV_2':
					id = 'com.webos.app.externalinput.av2';
					break;
			}
		}
		launchApp(id);
	};

	render = () => {
		const {source, sourceType, placeholder, imageOverlayShowing, imageOverlaySrc, textOverlayContent, captionComponent, isIpChannel, pigWidth, pigHeight, ...rest} = this.props;
		const textOverlayClassName = classNames(css.textOverlay, isIpChannel ? css.ipChannel : null);
		const pigStyle = {width: ri.scale(pigWidth) + 'px', height: ri.scale(pigHeight) + 'px'};
		const containerWidth = {width: ri.scale(pigWidth) + 'px'};

		delete rest.onLoadedMetadata;
		delete rest.onReceivedVideoState;

		return (
			<div {...rest} style={containerWidth}>
				<SpottableItem className={css['pictureInGraphic']} style={pigStyle} onClick={this.handleClick}>
					<video
						className={css.video}
						autoPlay
						controls={false}
						ref={this.setVideoRef}
						onLoadedMetadata={this.handleLoadedMetadata}
					>
						{sourceType === 'broadcast' ?
							<source type="service/webos-broadcast" src={this.getBroadcastSource(source)} /> :
							<source type="service/webos-external" src={this.getExternalInputSource(source)} />}
					</video>
					{imageOverlayShowing ?
						<div>
							<Image placeholder={placeholder} className={css.image} src={imageOverlaySrc} />
							{textOverlayContent ? (<MarqueeText alignment="center" className={textOverlayClassName} marqueeOn="focus">{textOverlayContent}</MarqueeText>) : null}
						</div> :
						null
					}
				</SpottableItem>
				{captionComponent}

			</div>
		);
	}
}

const SpottableItem =  MarqueeController(
	{marqueeOnFocus: true},
	Spottable(
		Skinnable(
			ItemBase
		)
	)
);

const PictureInGraphic = Slottable(
	{slots: ['captionComponent']},
	PictureInGraphicBase
);

export default PictureInGraphic;
export {PictureInGraphic, PictureInGraphicBase};
