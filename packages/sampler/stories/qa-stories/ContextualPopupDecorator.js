import {ContextualPopupDecorator} from '@enact/moonstone/ContextualPopupDecorator';
import Button from '@enact/moonstone/Button';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, select} from '@kadira/storybook-addon-knobs';

const ContextualButton = ContextualPopupDecorator(Button);
ContextualButton.displayName = 'ContextualButton';

const renderPopup = () => (
	<div style={{width: '600px'}}>
		<Button>First Button</Button>
		<Button>Hello Spottable Button</Button>
	</div>
);

const renderWidePopup = () => (
	<div style={{width: '500px'}}>
		This is a wide popup
	</div>
);

const renderTallPopup = () => (
	<div style={{height: '200px'}}>
		This is a tall popup
	</div>
);

const renderSuperTallPopup = () => (
	<div style={{height: '550px'}}>
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
	.addDecorator(withKnobs)
	.addWithInfo(
		'with 5-way selectable activator',
		() => (
			<div style={{textAlign: 'center', marginTop: '100px'}}>
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
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
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
				<div style={{display: 'flex', marginBottom: '20px'}}>
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
				<div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
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
