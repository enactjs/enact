import {icons} from '@enact/moonstone/Icon';
import Input, {InputBase} from '@enact/moonstone/Input';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const StatefulInput = Changeable(Input);
StatefulInput.displayName = 'Changeable(Input)';

const Config = mergeComponentMetadata('Input', InputBase, Input);

const iconNames = ['', ...Object.keys(icons)];

storiesOf('Input')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Input',
		() => (
			<StatefulInput
				onChange={action('onChange')}
				disabled={boolean('disabled', StatefulInput.defaultProps.disabled)}
				dismissOnEnter={boolean('dismissOnEnter', StatefulInput.defaultProps.dismissOnEnter)}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				placeholder={text('placeholder')}
				type={text('type')}
			/>
		),
		{propTables: [Config]}
	);
