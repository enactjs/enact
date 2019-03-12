import kind from '@enact/core/kind';
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import TooltipDecorator from '@enact/moonstone/TooltipDecorator';
import Input from '@enact/moonstone/Input';
import IconButton from '@enact/moonstone/IconButton';
import Scroller from '@enact/moonstone/Scroller';
import Layout, {Cell} from '@enact/ui/Layout';
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
		} else if (text === 'very loooooooooooong text') {
			this.setState({text: ''});
		} else {
			this.setState({text: 'short'});
		}
	}

	handleChangeLeft = ({value}) => {
		this.setState(prevState => ({
			position: {
				...prevState.position,
				left: value
			}
		}));
	}

	handleChangeTop = ({value}) => {
		this.setState(prevState => ({
			position: {
				...prevState.position,
				top: value
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
					<Button onClick={this.changeTooltipText}>Change Text</Button>
				</div>
				<IconButton
					tooltipText={this.state.text}
					onClick={this.changeTooltipText}
					style={{
						position: 'absolute',
						left: parseInt(left || 0),
						top: parseInt(top || 0)
					}}
				>
					drawer
				</IconButton>
			</div>
		);
	}
}

const IconButtonItem = kind({
	name: 'IconButtonItem',
	render: ({...rest}) => {
		return (
			<div style={{height: 100, border: 'solid 3px yellow'}}>
				<IconButton
					small
					tooltipText="tooltip"
					{...rest}
				>
					plus
				</IconButton>
				<IconButton
					style={{marginLeft: '450px'}}
					small
					tooltipText="tooltip"
					{...rest}
				>
					plus
				</IconButton>
			</div>
		);
	}
});

class TooltipFollow extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			left: 0,
			widthMinus: 180,
			widthPlus: 30
		};
	}

	handleWidthMinusClick = () => {
		this.setState((prevState) => {
			return {widthMinus: prevState.widthMinus - 30};
		});
	}

	handleWidthPlusClick = () => {
		this.setState((prevState) => {
			return {widthPlus: prevState.widthPlus + 30};
		});
	}

	handlePositionClick = () => {
		this.setState((prevState) => {
			return {left: prevState.left + 30};
		});
	}

	render = () => {
		return (
			<Layout orientation="vertical">
				<Cell shrink>
					<BodyText>Click icon buttons to resize or move</BodyText>
					<IconButton
						small
						tooltipText="tooltip"
						onClick={this.handleWidthMinusClick}
						style={{width: `${this.state.widthMinus}px`}}
					>
						minus
					</IconButton>
					<IconButton
						small
						tooltipText="tooltip"
						onClick={this.handleWidthPlusClick}
						style={{width: `${this.state.widthPlus}px`}}
					>
						plus
					</IconButton>
					<IconButton
						small
						tooltipText="tooltip"
						onClick={this.handlePositionClick}
						style={{left: `${this.state.left}px`}}
					>
						plus
					</IconButton>
				</Cell>
				<Cell component={Scroller}>
					<IconButtonItem tooltipPosition="above" />
					<IconButtonItem tooltipPosition="above center" />
					<IconButtonItem tooltipPosition="above left" />
					<IconButtonItem tooltipPosition="above right" />
					<IconButtonItem tooltipPosition="below" />
					<IconButtonItem tooltipPosition="below center" />
					<IconButtonItem tooltipPosition="below left" />
					<IconButtonItem tooltipPosition="below right" />
					<IconButtonItem tooltipPosition="left bottom" />
					<IconButtonItem tooltipPosition="left middle" />
					<IconButtonItem tooltipPosition="left top" />
					<IconButtonItem tooltipPosition="right bottom" />
					<IconButtonItem tooltipPosition="right middle" />
					<IconButtonItem tooltipPosition="right top" />
					<IconButtonItem />
				</Cell>
				<Cell shrink component={BodyText} centered>
					<em>This space left intentionally blank for bottom margin below scroller</em>
				</Cell>
			</Layout>
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
	).add(
		'tooltip to follow component when changed',
		() => (
			<TooltipFollow />
		)
	);
