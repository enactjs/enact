import {ContextualPopupDecorator} from '@enact/moonstone/ContextualPopupDecorator';

import Button from '@enact/moonstone/Button';
import Heading from '@enact/moonstone/Heading';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

import CheckboxItem from '@enact/moonstone/CheckboxItem';
import {IconButton} from '@enact/moonstone/IconButton';

import {Group} from '@enact/ui/Group';

const ContextualButton = ContextualPopupDecorator(Button);
const Config = mergeComponentMetadata('ContextualButton', ContextualButton);
ContextualButton.displayName = 'ContextualButton';
const ContextualPopup = ContextualPopupDecorator(IconButton);

const buttonMargin = () => ({margin: ri.unit(12, 'rem')});

const renderPopup = () => (
	<div style={{width: ri.unit(600, 'rem')}}>
		<Button style={buttonMargin()}>First Button</Button>
		<Button style={buttonMargin()}>Hello Spottable Button</Button>
	</div>
);

const renderWidePopup = () => (
	<div style={{width: ri.unit(501, 'rem')}}>
		This is a wide popup
	</div>
);

const renderTallPopup = () => (
	<div style={{height: ri.unit(201, 'rem')}}>
		This is a tall popup
	</div>
);

const renderSuperTallPopup = () => (
	<div style={{height: ri.unit(570, 'rem')}}>
		This is a super tall popup.
		Note: this popup does not overflow in full screen mode.
	</div>
);

class ContextualPopupWithActivator extends React.Component {
	constructor (props) {
		super(props);

		this.state = {open: false};
	}

	handleOpenToggle = () => {
		this.setState(({open}) => ({open: !open}));
	}

	render () {
		return (
			<ContextualButton
				{...this.props}
				onClose={this.handleOpenToggle}
				onClick={this.handleOpenToggle}
				open={this.state.open}
				showCloseButton
			/>
		);
	}
}

// PLAT-77119
class ContextualPopupWithArrowFunction extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isOpen: false,
			twoGroup: false
		};
	}

	componentDidUpdate (prevProps, prevState) {
		if (this.ref && this.state.twoGroup !== prevState.twoGroup) {
			this.ref.positionContextualPopup();
		}
	}

	handleOnClick = () => {
		this.setState({isOpen: true});
	}

	handleItemClick = () => {
		this.setState((state) => {
			return {twoGroup: !state.twoGroup};
		});
	}

	setRef = (node) => {
		this.ref = node;
	}

	popupComponent = () => {
		return (
			<div style={{display: 'flex'}}>
				<div style={{display: 'flex'}}>
					<Group
						childComponent={CheckboxItem}
						select="multiple"
						selectedProp="selected"
						onClick={this.handleItemClick}
					>
						{['click to change layout']}
					</Group>
				</div>
				{this.state.twoGroup ?
					<div style={{display: 'flex'}}>
						<Group
							childComponent={CheckboxItem}
							select="multiple"
							selectedProp="selected"
						>
							{['dummy item']}
						</Group>
					</div> : null
				}
			</div>
		);
	};
	render () {
		const {...rest} = this.props;

		return (
			<div {...rest} style={{display: 'flex', justifyContent: 'flex-end'}}>
				<ContextualPopup
					ref={this.setRef}
					popupComponent={this.popupComponent}
					open={this.state.isOpen}
					onClick={this.handleOnClick}
				/>
			</div>
		);
	}
}

storiesOf('ContextualPopupDecorator', module)
	.add(
		'with 5-way selectable activator',
		() => (
			<div style={{textAlign: 'center', marginTop: ri.unit(180, 'rem')}}>
				<ContextualPopupWithActivator
					direction={select('direction', ['up', 'down', 'left', 'right'], Config, 'down')}
					popupComponent={renderPopup}
					spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], Config, 'self-only')}
				>
					Hello Contextual Button
				</ContextualPopupWithActivator>
			</div>
		)
	)
	.add(
		'with overflows',
		() => (
			<div style={{position: 'relative', width: '100%', height: '100%'}}>
				<Heading showLine>direction Up</Heading>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: ri.unit(12, 'rem')}}>
					<ContextualPopupWithActivator
						direction="up"
						popupComponent={renderWidePopup}
					>
						Overflows Left
					</ContextualPopupWithActivator>
					<ContextualPopupWithActivator
						direction="up"
						popupComponent={renderTallPopup}
					>
						Overflows Top
					</ContextualPopupWithActivator>
					<ContextualPopupWithActivator
						direction="up"
						popupComponent={renderWidePopup}
					>
						Overflows Right
					</ContextualPopupWithActivator>
				</div>
				<div style={{display: 'flex'}}>
					<Heading showLine style={{flexGrow: '1'}}>direction left </Heading>
					<Heading showLine style={{flexGrow: '1'}}>direction right</Heading>
				</div>
				<div style={{display: 'flex', marginBottom: ri.unit(24, 'rem')}}>
					<div style={{flexGrow: '1', display: 'flex', justifyContent: 'space-between'}}>
						<ContextualPopupWithActivator
							direction="left"
							popupComponent={renderWidePopup}
						>
							Overflows Left
						</ContextualPopupWithActivator>
						<ContextualPopupWithActivator
							direction="left"
							popupComponent={renderSuperTallPopup}
						>
							Overflows Top
						</ContextualPopupWithActivator>
					</div>
					<div style={{flexGrow: '1', display: 'flex', justifyContent: 'space-between'}}>
						<ContextualPopupWithActivator
							direction="right"
							popupComponent={renderSuperTallPopup}
						>
							Overflows Top
						</ContextualPopupWithActivator>
						<ContextualPopupWithActivator
							direction="right"
							popupComponent={renderWidePopup}
						>
							Overflows Right
						</ContextualPopupWithActivator>
					</div>
				</div>
				<div style={{display: 'flex', justifyContent: 'center', marginBottom: ri.unit(24, 'rem')}}>
					<ContextualPopupWithActivator
						direction="left"
						popupComponent={renderSuperTallPopup}
					>
						Overflows Bottom
					</ContextualPopupWithActivator>
					<ContextualPopupWithActivator
						direction="right"
						popupComponent={renderSuperTallPopup}
					>
						Overflows Bottom
					</ContextualPopupWithActivator>
				</div>
				<Heading showLine>direction down</Heading>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<ContextualPopupWithActivator
						direction="down"
						popupComponent={renderWidePopup}
					>
						Overflows Left
					</ContextualPopupWithActivator>
					<ContextualPopupWithActivator
						direction="down"
						popupComponent={renderTallPopup}
					>
						Overflows Bottom
					</ContextualPopupWithActivator>
					<ContextualPopupWithActivator
						direction="down"
						popupComponent={renderWidePopup}
					>
						Overflows Right
					</ContextualPopupWithActivator>
				</div>
			</div>
		)
	)
	.add(
		'with arrow function',
		() => (
			<ContextualPopupWithArrowFunction />
		)
	);
