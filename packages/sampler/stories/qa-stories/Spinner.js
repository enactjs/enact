import Spinner from '@enact/moonstone/Spinner';
import Button from '@enact/moonstone/Button';
import ri from '@enact/ui/resolution';
import React from 'react';
import {action, storiesOf} from '@kadira/storybook';
import {text, boolean, select} from '@kadira/storybook-addon-knobs';
import nullify from '../../src/utils/nullify.js';

// Set up some defaults for info and knobs
const
	prop = {
		longText:'SpinnerWithLongText SpinnerWithLongText SpinnerWithLongText'
	};

storiesOf('Spinner')
	.addWithInfo(
		'with long content',
		() => (
			<div>
				<div
					style={{
						height: ri.unit(420, 'rem'),
						border: ri.unit(3, 'rem') + ' dotted red'
					}}
				>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					<Button onClick={action('Inside Button events')}>Button</Button>
					<Spinner
						transparent={boolean('transparent', false)}
						centered={boolean('centered', false)}
						blockClickOn={nullify(select('blockClickOn', [null, 'container', 'screen']))}
						scrim={boolean('scrim', true)}
					>
						{text('content', prop.longText)}
					</Spinner>
				</div>
				<Button onClick={action('Outside Button events')}>Button</Button>
			</div>
		)
	)

	.addWithInfo(
		'blocking click events',
		() => (
			<div>
				<div
					style={{
						height: ri.unit(420, 'rem'),
						border: ri.unit(3, 'rem') + ' dotted red'
					}}
				>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					<Button onClick={action('Inside Button events')}>Button</Button>
					<Spinner
						transparent={boolean('transparent', false)}
						centered={boolean('centered', false)}
						blockClickOn={nullify(select('blockClickOn', [null, 'container', 'screen']))}
						scrim={boolean('scrim', true)}
					>
						{text('content')}
					</Spinner>
				</div>
				<Button onClick={action('Outside Button events')}>Button</Button>
			</div>
		)
	);
