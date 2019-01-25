import React from 'react';
import {mount} from 'enzyme';
import Cancelable from '@enact/ui/Cancelable';

import Notification from '../Notification';
import MoonstoneDecorator from '../../MoonstoneDecorator';

class TestPanel extends React.Component {
	state = {
		open: true
	}

	handlePopup = () => this.setState((state) => ({open: !state.open}))

	render () {
		return (
			<Notification open={this.state.open} onClose={this.handlePopup}>
				test
			</Notification>
		);
	}
}

const handleCancel = (ev, props) => props.onClose();

const CancelTestPanel = Cancelable({modal: true, onCancel: handleCancel}, TestPanel);

// eslint-disable-next-line enact/prop-types
const App = ({close, ...rest}) => (
	<div {...rest}>
		<CancelTestPanel onClose={close} />
	</div>
);

const MoonApp = MoonstoneDecorator(App);

describe('Notification', () => {
	const makeKeyboardEvent = (keyCode) => {
		return new window.KeyboardEvent('keyup', {keyCode, code: keyCode, bubbles: true});
	};

	test('should not call handle onClose in CancelTestPanel', () => {
		const handleClose = jest.fn();

		mount(
			<MoonApp close={handleClose} />
		);

		document.dispatchEvent(makeKeyboardEvent(27));

		const expected = 0;
		const actual = handleClose.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should call handle onClose in CancelTestPanel when notification is closed', () => {
		const handleClose = jest.fn();

		mount(
			<MoonApp close={handleClose} />
		);

		document.dispatchEvent(makeKeyboardEvent(27));
		document.dispatchEvent(makeKeyboardEvent(27));

		const expected = 1;
		const actual = handleClose.mock.calls.length;

		expect(actual).toBe(expected);
	});
});
