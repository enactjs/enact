import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text, select} from '@kadira/storybook-addon-knobs';

const prop = {
	tallText: {'नरेंद्र मोदी': 'नरेंद्र मोदी', 'ฟิ้  ไั  ஒ  து': 'ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ': 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'}
};

storiesOf('Divider')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Long Text',
		() => (
			<Divider>
				{text('children', 'This long text is for the marquee test in divider component. This long text is for the marquee test in divider component. This long text is for the marquee test in divider component.')}
			</Divider>
		)
	)

	.addWithInfo(
		'Tall Text',
		() => (
			<Divider>
				{select('children', prop.tallText, 'नरेंद्र मोदी')}
			</Divider>
		)
	);
