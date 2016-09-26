import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {kind, hoc} from 'enact-core';
import IconList from 'enact-moonstone/Icon/IconList';
import Input$, {InputBase} from 'enact-moonstone/Input/Input';
import Pickable from 'enact-ui/Pickable';

const InputStories = storiesOf('Input').addDecorator(withKnobs);

// Potentially reusable HOC to adapt a native onChange event to a pickable event
const MakePickable = hoc((config, Wrapped) => {
	return kind({
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

const Input = Pickable({mutable: true}, MakePickable(Input$));

Input.propTypes = Object.assign({}, InputBase.propTypes, Input$.propTypes);
Input.defaultProps = Object.assign({}, InputBase.defaultProps, Input$.defaultProps);
Input.displayName = 'Input';

const icons = Object.keys(IconList);

InputStories
	.addWithInfo(
		'',
		'The basic Input.',
		() => (
			<Input
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconEnd={select('iconEnd', ['', ...icons])}
				iconStart={select('iconStart', ['', ...icons])}
				placeholder={text('placeholder')}
				type={text('type')}
				value={text('value', '')}
			/>
		)
	)
;
