import {kind, hoc} from '@enact/core';
import {icons} from '@enact/moonstone/Icon';
import Input, {InputBase} from '@enact/moonstone/Input';
import Pickable from '@enact/ui/Pickable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

// Adapter to use Pickable until a suitable state HOC is added to @enact/ui
const MakePickable = hoc((config, Wrapped) => {
	return kind({
		name: 'MakePickable',

		computed: {
			onChange: ({onChange}) => (ev) => {
				onChange({
					value: ev.target.value
				});
			}
		},

		render: (props) => (
			<Wrapped {...props} />
		)
	});
});

const StatefulInput = Pickable({mutable: true}, MakePickable(Input));

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
