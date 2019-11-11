import Button from '@enact/moonstone/Button';
import Input from '@enact/moonstone/Input';
import Spinner from '@enact/moonstone/Spinner';
import React from 'react';
import ri from '@enact/ui/resolution';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {action} from '../../src/utils';

Spinner.displayName = 'Spinner';

// Set up some defaults for info and knobs
const
	prop = {
		longText:'SpinnerWithLongText SpinnerWithLongText SpinnerWithLongText'
	};

class FocusOnSpinner extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			txt: '',
			isLoading: false
		};
	}

	handleChange = (e) => {
		this.setState({
			txt: e.value
		});
	}

	handleDeactivate = () => {
		this.setState({
			isLoading: true
		});
	}

	render () {
		return (
			<div>
				<ol>
					<li> Focus and Click on the Input field.</li>
					<li> Click Enter key on the VKB. </li>
				</ol>
				<Input dismissOnEnter value={this.state.txt} onChange={this.handleChange} onDeactivate={this.handleDeactivate} />
				{this.state.isLoading ? <Spinner blockClickOn="screen" /> : null}
			</div>
		);
	}
}

storiesOf('Spinner', module)
	.add(
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
						transparent={boolean('transparent', Spinner, false)}
						centered={boolean('centered', Spinner, false)}
						blockClickOn={select('blockClickOn', [null, 'container', 'screen'], Spinner)}
						scrim={boolean('scrim', Spinner, true)}
					>
						{text('content', Spinner, prop.longText)}
					</Spinner>
				</div>
				<Button onClick={action('Outside Button events')}>Button</Button>
			</div>
		)
	)

	.add(
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
						transparent={boolean('transparent', Spinner, false)}
						centered={boolean('centered', Spinner, false)}
						blockClickOn={select('blockClickOn', [null, 'container', 'screen'], Spinner)}
						scrim={boolean('scrim', Spinner, true)}
					>
						{text('content', Spinner)}
					</Spinner>
				</div>
				<Button onClick={action('Outside Button events')}>Button</Button>
			</div>
		)
	)
	.add(
		'with input',
		() => (
			<FocusOnSpinner />
		)
	);
