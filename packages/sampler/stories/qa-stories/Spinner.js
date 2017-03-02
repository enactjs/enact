import Spinner from '@enact/moonstone/Spinner';
import Icon from '@enact/moonstone/Icon';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';

// Set up some defaults for info and knobs
const
	prop = {
		longText:'SpinnerWithLongText SpinnerWithLongText SpinnerWithLongText'
	},
	style = {
		spinnerDiv: {
			height: ri.scale(15) + 'em',
			border: '1px dotted red'
		}
	};

storiesOf('Spinner')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long content',
		() => (
			<div style={style.spinnerDiv}>
				<Spinner
					transparent={boolean('transparent', false)}
				>
					{text('content', prop.longText)}
				</Spinner>
			</div>
		)
	)

	.addWithInfo(
		'with components inside before text',
		() => (
			<div style={style.spinnerDiv}>
				<Spinner
					transparent={boolean('transparent', false)}
				>
					<Icon>hollowstar</Icon>
					<Icon>star</Icon>
					{text('content', prop.longText)}
				</Spinner>
			</div>
		)
	)

	.addWithInfo(
		'with components inside after text ',
		() => (
			<div style={style.spinnerDiv}>
				<Spinner
					transparent={boolean('transparent', false)}
				>
					{text('content', prop.longText)}
					<Icon>hollowstar</Icon>
					<Icon>star</Icon>
				</Spinner>
			</div>
		)
	)

	.addWithInfo(
		'with components inside before and after text ',
		() => (
			<div style={style.spinnerDiv}>
				<Spinner
					transparent={boolean('transparent', false)}
				>
					<Icon>hollowstar</Icon>
					<Icon>star</Icon>
					{text('content', 'Spinner')}
					<Icon>hollowstar</Icon>
					<Icon>star</Icon>
				</Spinner>
			</div>
		)
	);
