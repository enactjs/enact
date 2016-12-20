import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import {SliderFactory} from '../Slider';

import css from './VideoPlayer.less';

const Slider = SliderFactory({css});

const MediaSliderBase = kind({
	name: 'MediaSlider',

	propTypes: {
		backgroundPercent: React.PropTypes.number,
		onChange: React.PropTypes.func,
		value: React.PropTypes.number
	},

	render: ({backgroundPercent, onChange, value}) => {
		return (
			<div className={css.sliderFrame}>
				<Slider
					className={css.mediaSlider}
					backgroundPercent={backgroundPercent}
					detachedKnob
					min={0}
					max={1}
					value={value}
					step={0.00001}
					onChange={onChange}
				/>
			</div>
		);
	}
});

const MediaSlider = onlyUpdateForKeys(['backgroundPercent', 'value'])(MediaSliderBase);

export default MediaSlider;
export {
	MediaSlider,
	MediaSliderBase
};
