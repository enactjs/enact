import Spinner from '@enact/moonstone/Spinner';
import React from 'react';
import {action, storiesOf} from '@kadira/storybook';
import {boolean, select, text, withKnobs} from '@kadira/storybook-addon-knobs';

storiesOf('Spinner')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Spinner',
		() => (
			<div
				style={{
					outline: 'teal dashed 1px',
					position: 'relative',
					padding: '90px',
					backgroundColor: 'rgba(0, 187, 187, 0.5)'
				}}
			>
				<div
					style={{
						position: 'absolute',
						height: '100%',
						width: '100%',
						top: 0,
						left: 0
					}}
					onClick={action('Outside container events')}
				/>
				<div
					style={{
						outline: 'teal dashed 1px',
						position: 'relative',
						height: '180px'
					}}
				>
					<label
						style={{
							outline: 'teal dashed 1px',
							backgroundColor: 'rgba(0, 128, 128, 0.5)',
							color: '#0bb',
							position: 'absolute',
							transform: 'translateY(-100%)',
							borderBottomWidth: 0,
							padding: '0.1em 1em',
							fontWeight: 100,
							fontStyle: 'italic',
							fontSize: '16px'
						}}
					>Container</label>
					<div
						style={{
							position: 'absolute',
							height: '100%',
							width: '100%'
						}}
						onClick={action('Inside container events')}
					/>
					<Spinner
						blockClick={select('blockClick', [null, 'container', 'screen'])}
						centered={boolean('centered', false)}
						scrim={boolean('scrim', false)}
						transparent={boolean('transparent', false)}
					>
						{text('content', '')}
					</Spinner>
				</div>
			</div>
		)
	);
