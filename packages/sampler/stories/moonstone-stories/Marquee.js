import {MarqueeText} from '@enact/moonstone/Marquee';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, number, select, text} from '@kadira/storybook-addon-knobs';

storiesOf('Marquee')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic MarqueeText',
		() => (
			<MarqueeText
				style={{width: '400px'}}
				disabled={boolean('disabled', false)}
				marqueeCentered={boolean('marqueeCentered', false)}
				marqueeDelay={number('marqueeDelay', 1000)}
				marqueeDisabled={boolean('marqueeDisabled', false)}
				marqueeOn={select('marqueeOn', ['hover', 'render'], 'render')}
				marqueeOnRenderDelay={number('marqueeOnRenderDelay', 1000)}
				marqueeResetDelay={number('marqueeResetDelay', 1000)}
				marqueeSpeed={number('marqueeSpeed', 60)}
			>
				{text('children', 'The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.')}
			</MarqueeText>
		)
	);
