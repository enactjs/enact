import {ExpandableInput as ExpInput, ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import Changeable from '@enact/ui/Changeable';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const iconNames = ['', ...Object.keys(icons)];
const ExpandableInput = Changeable(ExpInput);
ExpandableInput.displayName = 'Changeable(ExpandableInput)';

const Config = mergeComponentMetadata('ExpandableInput', ExpInput, ExpandableInputBase);

storiesOf('ExpandableInput')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableInput',
		() => (
			<ExpandableInput
				disabled={boolean('disabled', false)}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				noneText={text('noneText', 'nothing inputted')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', 'title')}
				placeholder={text('placeholder')}
				type={text('type')}
			/>
		),
		{propTables: [Config]}
	);
