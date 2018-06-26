import Spinner from '@enact/moonstone/Spinner';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Spinner', Spinner);
Spinner.displayName = 'Spinner';

storiesOf('Moonstone', module)
	.add(
		'Spinner',
		withInfo({
			propTablesExclude: [Spinner],
			text: 'Basic usage of Spinner'
		})(() => (
			<div
				style={{
					outline: 'teal dashed 1px',
					position: 'relative',
					padding: ri.unit(90, 'rem'),
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
						height: ri.unit(180, 'rem')
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
							fontSize: ri.unit(15, 'rem')
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
						blockClickOn={select('blockClickOn', [null, 'container', 'screen'], Config)}
						centered={boolean('centered', Config)}
						scrim={boolean('scrim', Config)}
						transparent={boolean('transparent', Config)}
					>
						{text('content', Config, '')}
					</Spinner>
				</div>
			</div>
		))
	);
