import Marquee from '@enact/moonstone/Marquee';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, number, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

storiesOf('Marquee')
	.addWithInfo(
		' ',
		'The basic MarqueeText',
		() => {
			const disabled = nullify(boolean('disabled', false));
			return (
				<section>
					<Marquee
						alignment={nullify(select('alignment', [null, 'left', 'right', 'center']))}
						disabled={disabled}
						forceDirection={nullify(select('forceDirection', [null, 'rtl', 'ltr']))}
						marqueeDelay={number('marqueeDelay', 1000)}
						marqueeDisabled={nullify(boolean('marqueeDisabled', false))}
						marqueeOn={select('marqueeOn', ['hover', 'render'], 'render')}
						marqueeOnRenderDelay={1000}
						marqueeResetDelay={number('marqueeResetDelay', 1000)}
						marqueeSpeed={number('marqueeSpeed', 60)}
						style={{width: '400px'}}
					>
						{text('children', 'The quick brown fox jumped over the lazy dog. The bean bird flies at sundown.')}
					</Marquee>
					{disabled ? <p style={{fontSize: '70%', fontStyle: 'italic'}}><sup>*</sup>Marquee does not visually respond to <code>disabled</code> state.</p> : <p />}
				</section>
			);
		}
	);
