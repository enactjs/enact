import Marquee from '@enact/moonstone/Marquee';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select, text} from '../../src/enact-knobs';

Marquee.displayName = 'Marquee';

storiesOf('Moonstone', module)
	.add(
		'Marquee',
		withInfo({
			propTablesExclude: [Marquee],
			text: 'The basic MarqueeText'
		})(() => {
			const disabled = boolean('disabled', Marquee);
			return (
				<section>
					<Marquee
						alignment={select('alignment', [null, 'left', 'right', 'center'], Marquee)}
						disabled={disabled}
						forceDirection={select('forceDirection', [null, 'rtl', 'ltr'], Marquee)}
						marqueeDelay={number('marqueeDelay', Marquee, 1000)}
						marqueeDisabled={boolean('marqueeDisabled', Marquee)}
						marqueeOn={select('marqueeOn', ['hover', 'render'], Marquee, 'render')}
						marqueeOnRenderDelay={1000}
						marqueeResetDelay={number('marqueeResetDelay', Marquee, 1000)}
						marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
						style={{width: '400px'}}
					>
						{text('children', Marquee, 'The quick brown fox jumped over the lazy dog. The bean bird flies at sundown.')}
					</Marquee>
					{disabled ? <p style={{fontSize: '70%', fontStyle: 'italic'}}><sup>*</sup>Marquee does not visually respond to <code>disabled</code> state.</p> : <p />}
				</section>
			);
		})
	);
