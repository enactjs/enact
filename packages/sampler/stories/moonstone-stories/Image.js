import Image from '@enact/moonstone/Image';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

const src = {
	'hd':  'http://via.placeholder.com/200x200',
	'fhd': 'http://via.placeholder.com/300x300',
	'uhd': 'http://via.placeholder.com/600x600'
};

Image.displayName = 'Image';

storiesOf('Moonstone', module)
	.add(
		'Image',
		withInfo({
			propTablesExclude: [Image],
			text: 'The basic Image'
		})(() => (
			<Image
				src={src}
				sizing={select('sizing', ['fill', 'fit', 'none'], 'fill')}
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
