import {boolean, number, select, text} from '@enact/storybook-utils/addons/knobs';
import Marquee from '@enact/moonstone/Marquee';
import React from 'react';
import {storiesOf} from '@storybook/react';

Marquee.displayName = 'Marquee';

storiesOf('Moonstone', module)
	.add(
		'Marquee',
		() => {
			// fn to parse the padding value which is invoked later to keep the knob ordered
			const spacing = () => {
				const value = text('marqueeSpacing', Marquee, '50%');
				if (value && value.indexOf('%') > 0) {
					return value;
				}

				return Number.parseInt(value);
			};

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
						marqueeSpacing={spacing()}
						marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
						style={{width: '400px'}}
					>
						{text('children', Marquee, 'The quick brown fox jumped over the lazy dog. The bean bird flies at sundown.')}
					</Marquee>
					{disabled ? <p style={{fontSize: '70%', fontStyle: 'italic'}}><sup>*</sup>Marquee does not visually respond to <code>disabled</code> state.</p> : <p />}
				</section>
			);
		},
		{
			info: {
				text: 'The basic MarqueeText'
			}
		}
	);
