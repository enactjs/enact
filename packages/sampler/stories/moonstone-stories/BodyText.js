import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {text, boolean} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

storiesOf('BodyText', module)
	.add(
		' ',
		withInfo('The basic BodyText')(() => (
			<BodyText
				centered={nullify(boolean('centered', false))}
			>
				{text('children', 'This is Body Text')}
			</BodyText>
		))
	);
