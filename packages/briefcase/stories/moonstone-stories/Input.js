import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

import IconList from 'enact-moonstone/Icon/IconList';
import Input, {InputBase} from 'enact-moonstone/Input/Input';

const InputStories = storiesOf('Input').addDecorator(withKnobs);

Input.propTypes = Object.assign({}, InputBase.propTypes, Input.propTypes);
Input.defaultProps = Object.assign({}, InputBase.defaultProps, Input.defaultProps);
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
				iconEnd={select('iconEnd', icons)}
				iconStart={select('iconStart', icons)}
			/>
		)
	)
;
