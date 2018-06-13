import Image, {ImageBase, ImageDecorator} from '@enact/moonstone/Image';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {object, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const src = {
	'hd':  'http://via.placeholder.com/200x200',
	'fhd': 'http://via.placeholder.com/300x300',
	'uhd': 'http://via.placeholder.com/600x600'
};

const Config = mergeComponentMetadata('Image', Image, ImageBase, ImageDecorator);
Image.displayName = 'Image';

storiesOf('Moonstone', module)
	.add(
		'Image',
		withInfo({
			propTablesExclude: [Image],
			text: 'The basic Image'
		})(() => (
			<Image
				src={object('src', Config, src)}
				sizing={select('sizing', ['fill', 'fit', 'none'], Config, 'fill')}
				onError={action('error')}
				onLoad={action('loaded')}
				style={{
					border: '#ffa500 dashed 1px'
				}}
			>
				<label
					style={{
						border: '#ffa500 dashed 1px',
						borderBottomWidth: 0,
						borderRadius: '6px 6px 0 0',
						backgroundColor: 'rgba(255, 165, 0, 0.5)',
						color: '#fff',
						position: 'absolute',
						transform: 'translateX(-1px) translateY(-100%)',
						padding: '0.1em 1em',
						fontWeight: 100,
						fontStyle: 'italic',
						fontSize: '16px'
					}}
				>
					Image Boundry
				</label>
			</Image>
		))
	);
