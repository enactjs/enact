import {icons} from '@enact/moonstone/Icon';
import Input, {InputBase} from '@enact/moonstone/Input';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';


const StatefulInput = Changeable(Input);
StatefulInput.displayName = 'Changeable(Input)';

const Config = {
	propTypes: Object.assign({}, InputBase.propTypes, Input.propTypes),
	defaultProps: Object.assign({}, InputBase.defaultProps, Input.defaultProps),
	displayName: 'Input'
};

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
