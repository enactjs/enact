import {ExpandableInput as ExpInput, ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const ExpandableInput = Changeable({mutable: true}, ExpInput);

ExpandableInput.propTypes = Object.assign({}, ExpInput.propTypes, ExpandableInputBase.propTypes);
ExpandableInput.defaultProps = Object.assign({}, ExpInput.defaultProps, ExpandableInputBase.defaultProps);

delete ExpandableInput.propTypes.onInputChange;
delete ExpandableInput.propTypes.defaultOpen;
delete ExpandableInput.defaultProps.onInputChange;
delete ExpandableInput.defaultProps.defaultOpen;

storiesOf('ExpandableInput')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableInput',
		() => (
			<ExpandableInput
				disabled={boolean('disabled', false)}
				noneText={text('noneText', 'nothing inputted')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				title={text('title', 'title')}
				value={text('value', '')}
			/>
		)
	);
