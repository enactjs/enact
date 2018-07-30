import Button from '@enact/moonstone/Button';
import TooltipDecorator from '@enact/moonstone/TooltipDecorator';
import React from 'react';
import {storiesOf} from '@storybook/react';

const TooltipButton = TooltipDecorator(Button);

class TooltipTest extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			showButton: true
		};
	}

	handleClick = () => {
		this.setState({showButton: false});
	}

	render () {
		return (
			<div>
				Focus the button and click it before 5s has elapsed, and observe the console for errors
				{this.state.showButton ? (
					<TooltipButton
						onClick={this.handleClick}
						tooltipDelay={5000}
						tooltipText="Tooltip!"
					>
						Click me
					</TooltipButton>
				) : null}
			</div>
		);
	}
}

storiesOf('Tooltip', module)
	.add(
		'that shows after Button is unmounted (ENYO-3809)',
		() => (
			<TooltipTest />
		)
	);

