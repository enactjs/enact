import React from 'react';
import {storiesOf} from '@storybook/react';
import Transition, {TransitionBase} from '@enact/ui/Transition';

import {mergeComponentMetadata, riSafe} from '../../src/utils';
import {boolean, select} from '../../src/enact-knobs';
import {action} from '@storybook/addon-actions';

const Config = mergeComponentMetadata('Transition', TransitionBase, Transition);
Config.displayName = 'Transition';

// Set up some defaults for info and knobs
const prop = {
	directions: ['up', 'right', 'down', 'left'],
	durations: {'short (250ms)': 'short', 'medium (500ms)': 'medium', 'long (1s)': 'long'},
	types: ['clip', 'slide', 'fade'],
	timingFunctions: [
		'ease',
		'ease-in',
		'ease-out',
		'ease-in-out',
		'ease-in-quart',
		'ease-out-quart',
		'linear'
	]
};

storiesOf('UI', module)
	.add(
		'Transition',
		() => {
			const direction = select('direction', prop.directions, Config);
			return (
				<div
					style={{
						position: 'relative',
						width: riSafe(501),
						height: riSafe(297),
						border: `${riSafe(3)} dashed`
					}}
				>
					<div style={{position: 'absolute', width: riSafe(501), bottom: (direction === 'down' ? 0 : null)}}>
						<div style={{padding: '0.5em 2ex', boxSizing: 'border-box', backgroundColor: 'rgba(40, 30, 220, 0.50)', height: riSafe(99)}}>
							Content Before
						</div>
						<Transition
							direction={direction}
							duration={select('duration', prop.durations, Config)}
							onHide={action('onHide')}
							onShow={action('onShow')}
							type={select('type', prop.types, Config)}
							timingFunction={select('timingFunction', prop.timingFunctions, Config)}
							visible={!!boolean('visible', Config)}
							noAnimation={boolean('noAnimation', Config)}
						>
							<div style={{padding: '0.5em 2ex', boxSizing: 'border-box', backgroundColor: 'rgba(220, 40, 30, 0.50)', height: riSafe(99)}}>
								Transitionable Content
							</div>
						</Transition>
						<div style={{padding: '0.5em 2ex', boxSizing: 'border-box', backgroundColor: 'rgba(40, 220, 30, 0.50)', height: riSafe(99)}}>
							Content After
						</div>
					</div>
				</div>
			);
		},
		{
			info: {
				text: 'Used for bringing something off-screen, on-screen, and the reverse. Toggle the `visible` knob to show/hide the red box.'
			}
		}
	);
