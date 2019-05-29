import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, text} from '../../src/enact-knobs';

BodyText.displayName = 'BodyText';

storiesOf('Moonstone', module)
	.add(
		'BodyText',
		withInfo({
			text: 'The basic BodyText'
		})(() => (
			<BodyText
				centered={boolean('centered', BodyText)}
				noWrap={boolean('noWrap', BodyText)}
			>
				{text('children', BodyText, 'This is Body Text')}
			</BodyText>
		))
	);
