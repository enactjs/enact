import Button from '@enact/moonstone/Button';
import TooltipDecorator from '@enact/moonstone/TooltipDecorator';
import Input from '@enact/moonstone/Input';
import IconButton from '@enact/moonstone/IconButton';
import ri from '@enact/ui/resolution';
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

class ChangeableTooltip extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			text: 'short',
			position: {
				top: 0,
				left: 0
			}
		};
	}

	changeTooltipText = () => {
		const {text} = this.state;
		if (text === 'short') {
			this.setState({text: 'long text'});
		} else if (text === 'long text') {
			this.setState({text: 'very loooooooooooong text'});
		} else {
			this.setState({text: 'short'});
		}
	}

	handleChangeLeft = (ev) => {
		this.setState(prevState => ({
			position: {
				...prevState.position,
				left: parseInt(ev.value)
			}
		}));
	}

	handleChangeTop = (ev) => {
		this.setState(prevState => ({
			position: {
				...prevState.position,
				top: parseInt(ev.value)
			}
		}));
	}

	render () {
		const {left, top} = this.state.position;
		const style = {
			position: 'absolute',
			width: ri.unit(390, 'rem'),
			left: '50%',
			transform: 'translateX(-50%)'
		};
		return (
			<div>
				<div style={style}>
					<div>LEFT : </div>
					<Input id="left" small type="number" onChange={this.handleChangeLeft} value={left} />
					<div>TOP : </div>
					<Input id="top" small type="number" onChange={this.handleChangeTop} value={top} />
				</div>
				<IconButton
					tooltipText={this.state.text}
					onClick={this.changeTooltipText}
					style={{
						position: 'absolute',
						left,
						top
					}}
				>
					{'drawer'}
				</IconButton>
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
	)
	.add(
		'tooltipDecorator with changeable tooltipText',
		() => (
			<ChangeableTooltip />
		)
	);
