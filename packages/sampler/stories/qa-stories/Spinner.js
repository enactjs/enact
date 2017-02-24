import Spinner from '@enact/moonstone/Spinner';
import Button from '@enact/moonstone/Button';
import Icon from '@enact/moonstone/Icon';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

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
					centered={boolean('centered', false)}
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
					centered={boolean('centered', false)}
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
					centered={boolean('centered', false)}
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
					centered={boolean('centered', false)}
				>
					<Icon>hollowstar</Icon>
					<Icon>star</Icon>
					{text('content', 'Spinner')}
					<Icon>hollowstar</Icon>
					<Icon>star</Icon>
				</Spinner>
			</div>
		)
	)

	.addWithInfo(
		'blocking click events',
		() => (
			<div>
				<div style={Object.assign({}, style.spinnerDiv, {backgroundColor: '#222'})}>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Spinner
						transparent={boolean('transparent', false)}
						centered={boolean('centered', false)}
						blockClick={select('blockClick', [null, 'container', 'screen'])}
						scrim={boolean('scrim', true)}
					>
						{text('content')}
					</Spinner>
				</div>
				<Button>Button</Button>
				<Button>Button</Button>
				<Button>Button</Button>
			</div>
		)
	);
