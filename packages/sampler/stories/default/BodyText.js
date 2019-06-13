import BodyText, {BodyTextBase} from '@enact/moonstone/BodyText';
import UiBodyText, {BodyTextBase as UiBodyTextBase} from '@enact/ui/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, text, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

BodyText.displayName = 'BodyText';
const Config = mergeComponentMetadata('BodyText', UiBodyTextBase, UiBodyText, BodyTextBase, BodyText);

storiesOf('Moonstone', module)
	.add(
		'BodyText',
		withInfo({
			text: 'The basic BodyText'
		})(() => (
			<BodyText
				centered={boolean('centered', Config)}
				noWrap={boolean('noWrap', Config)}
				size={select('size', ['', 'large', 'small'], Config)}
			>
				{text('children', Config, 'This is Body Text')}
			</BodyText>
		))
	);
