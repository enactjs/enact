import Image from '@enact/moonstone/Image';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

const src = {
	'hd': 'http://lorempixel.com/128/128/city/1/',
	'fhd': 'http://lorempixel.com/256/256/city/1/',
	'uhd': 'http://lorempixel.com/512/512/city/1/'
};

storiesOf('Moonstone', module)
	.add(
		'Image',
		withInfo('The basic Image')(() => (
			<Image
				src={src}
				sizing={select('sizing', ['fill', 'fit', 'none'], 'fill')}
				onError={action('error')}
				onLoad={action('loaded')}
			/>
		))
	);
