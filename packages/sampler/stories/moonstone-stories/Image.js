import Image from '@enact/moonstone/Image';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, select, withKnobs} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

const src = {
	'hd': 'http://lorempixel.com/128/128/city/1/',
	'fhd': 'http://lorempixel.com/256/256/city/1/',
	'uhd': 'http://lorempixel.com/512/512/city/1/'
};

storiesOf('Image')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Image',
		() => (
			<Image
				disabled={nullify(boolean('disabled', false))}
				sizing={select('sizing', ['fill', 'fit', 'none'], 'fill')}
				src={src}
			/>
		)
	);
