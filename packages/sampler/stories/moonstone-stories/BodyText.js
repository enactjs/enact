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
			propTablesExclude: [BodyText],
			text: 'The basic BodyText'
		})(() => (
			<BodyText
				centered={boolean('centered', BodyText, false)}
			>
				{text('children', BodyText, 'This is Body Text')}
			</BodyText>
		))
	);
