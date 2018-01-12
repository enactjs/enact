import {ContextualPopupDecorator} from '@enact/moonstone/ContextualPopupDecorator';
import Button from '@enact/moonstone/Button';
import Divider from '@enact/moonstone/Divider';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {select} from '@kadira/storybook-addon-knobs';

const ContextualButton = ContextualPopupDecorator(Button);
ContextualButton.displayName = 'ContextualButton';

const renderPopup = () => (
	<div style={{width: ri.unit(600, 'rem')}}>
		<Button>First Button</Button>
		<Button>Hello Spottable Button</Button>
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
		const open = !this.state.open;
		this.setState({open});
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

storiesOf('ContextualPopupDecorator')
	.addWithInfo(
		'with 5-way selectable activator',
		() => (
			<div style={{textAlign: 'center', marginTop: ri.unit(99, 'rem')}}>
				<ContextualPopupWithActivator
					direction={select('direction', ['up', 'down', 'left', 'right'], 'down')}
					popupComponent={renderPopup}
					spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], 'self-only')}
				>
					Hello Contextual Button
				</ContextualPopupWithActivator>
			</div>
		)
	)
	.addWithInfo(
		'with overflows',
		() => (
			<div style={{position: 'relative', width: '100%', height: '100%'}}>
				<Divider>direction Up</Divider>
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
					<Divider style={{flexGrow: '1'}}>direction left </Divider>
					<Divider style={{flexGrow: '1'}}>direction right</Divider>
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
				<Divider>direction down</Divider>
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
	);
