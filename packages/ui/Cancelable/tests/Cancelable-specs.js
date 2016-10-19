import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Cancelable from '../Cancelable';

describe('Cancelable', () => {

	// Suite-wide setup
	const Component = () => (
		<div>
			<button />
		</div>
	);

	const makeKeyEvent = (keyCode) => {
		return {
			keyCode,
			nativeEvent: {
				stopImmediatePropagation: sinon.spy()
			}
		};
	};

	it('should call onCancel from prop for escape key', function () {
		const handleCancel = sinon.spy();
		const Comp = Cancelable(
			{onCancel: 'onCustomEvent'},
			Component
		);

		const subject = shallow(
			<Comp onCustomEvent={handleCancel} />
		);

		subject.simulate('keyup', makeKeyEvent(27));

		const expected = true;
		const actual = handleCancel.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should only call onCancel for escape key', function () {
		const handleCancel = sinon.spy();
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(27));

		const expected = true;
		const actual = handleCancel.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not call onCancel for non-escape key', function () {
		const handleCancel = sinon.spy();
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(42));

		const expected = false;
		const actual = handleCancel.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should stop propagation for escape key', function () {
		const handleCancel = sinon.spy();
		const keyEvent = makeKeyEvent(27);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', keyEvent);

		const expected = true;
		const actual = keyEvent.nativeEvent.stopImmediatePropagation.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not stop propagation for non-escape key', function () {
		const handleCancel = sinon.spy();
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', keyEvent);

		const expected = false;
		const actual = keyEvent.nativeEvent.stopImmediatePropagation.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should forward to onKeyUp handler for any key', function () {
		const handleKeyUp = sinon.spy();
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: () => false},
			Component
		);

		const subject = shallow(
			<Comp onKeyUp={handleKeyUp} />
		);

		subject.simulate('keyup', keyEvent);

		const expected = true;
		const actual = handleKeyUp.calledOnce;

		expect(actual).to.equal(expected);
	});
});
