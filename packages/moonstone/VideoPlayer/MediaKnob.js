import kind from '@enact/core/kind';
import {Knob} from '@enact/ui/Slider';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Knob for the MediaSlider in {@link moonstone/VideoPlayer}.
 *
 * @class MediaKnob
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaKnob = kind({
	name: 'MediaKnob',

	propTypes: {
		proportion: PropTypes.number,
		tracking: PropTypes.bool,
		trackX: PropTypes.number,
		value: PropTypes.number
	},

	render: ({proportion, tracking, trackX, value, ...rest}) => {
		if (tracking) {
			proportion = value = trackX;
		}

		return (
			<Knob
				{...rest}
				value={value}
				proportion={proportion}
			/>
		);
	}
});

export default MediaKnob;
export {
	MediaKnob
};
