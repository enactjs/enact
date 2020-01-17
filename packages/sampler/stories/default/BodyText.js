import BodyText, {BodyTextBase} from '@enact/moonstone/BodyText';
import {boolean, text, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';
import UiBodyText, {BodyTextBase as UiBodyTextBase} from '@enact/ui/BodyText';

BodyText.displayName = 'BodyText';
const Config = mergeComponentMetadata('BodyText', UiBodyTextBase, UiBodyText, BodyTextBase, BodyText);

storiesOf('Moonstone', module)
	.add(
		'BodyText',
		() => (
			<BodyText
				centered={boolean('centered', Config)}
				noWrap={boolean('noWrap', Config)}
				size={select('size', ['', 'large', 'small'], Config)}
			>
				{text('children', Config, 'This is Body Text')}
			</BodyText>
		),
		{
			info: {
				text: 'The basic BodyText'
			}
		}
	);
