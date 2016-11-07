import {icons} from '@enact/moonstone/Icon';
import Input, {InputBase} from '@enact/moonstone/Input';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';


const StatefulInput = Changeable({mutable: true}, Input);

StatefulInput.propTypes = Object.assign({}, InputBase.propTypes, Input.propTypes);
StatefulInput.defaultProps = Object.assign({}, InputBase.defaultProps, Input.defaultProps);
StatefulInput.displayName = 'Input';

const iconNames = ['', ...Object.keys(icons)];

storiesOf('Input')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Input',
		() => (
			<StatefulInput
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				dismissOnEnter={boolean('dismissOnEnter')}
				iconEnd={select('iconEnd', iconNames)}
				iconStart={select('iconStart', iconNames)}
				placeholder={text('placeholder')}
				type={text('type')}
				value={text('value', '')}
			/>
		)
	);
