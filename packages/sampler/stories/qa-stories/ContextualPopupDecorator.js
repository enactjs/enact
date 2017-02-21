import {ContextualPopupDecorator} from '@enact/moonstone/ContextualPopupDecorator';
import Button from '@enact/moonstone/Button';
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
			<div style={{textAlign: 'center', marginTop: '100px'}}>
				<ContextualButton
					direction={select('direction', ['up', 'down', 'left', 'right'], 'down')}
					onClose={this.handleOpenToggle}
					onClick={this.handleOpenToggle}
					open={this.state.open}
					showCloseButton
					popupComponent={renderPopup}
					spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], 'self-only')}
				>
					Hello Contextual Button
				</ContextualButton>
			</div>
		);
	}
}

storiesOf('ContextualPopupDecorator')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with 5-way selectable activator',
		() => (
			<ContextualPopupWithActivator />
		)
	);
