import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {RadioControllerDecorator, RadioDecorator} from '../RadioDecorator';

describe('RadioDecorator', () => {

	// eslint-disable-next-line enact/prop-types
	const Item = ({onClick, active}) => (
		<span onClick={onClick}>
			{active ? 'Active' : 'Inactive'}
		</span>
	);

	const Controller = RadioControllerDecorator('main');

	it('should be activated when its prop is true on mount', function () {
		const Component = RadioDecorator({prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component active />
			</Controller>
		);

		const expected = subject.find('RadioDecorator').instance();
		const actual = subject.instance().active;

		expect(actual).to.equal(expected);
	});

	it('should not be activated when its prop is false on mount', function () {
		const Component = RadioDecorator({prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component />
			</Controller>
		);

		const expected = null;
		const actual = subject.instance().active;

		expect(actual).to.equal(expected);
	});

	it('should be activated when its prop is set to true after mount', function () {
		const Component = RadioDecorator({prop: 'active'}, Item);
		const Wrapper = ({active}) => (	// eslint-disable-line enact/prop-types
			<Controller>
				<Component active={active} />
			</Controller>
		);
		const subject = mount(
			<Wrapper />
		);

		subject.setProps({
			active: true
		});

		const expected = subject.find('RadioDecorator').instance();
		const actual = subject.find('RadioControllerDecorator').instance().active;

		expect(actual).to.equal(expected);
	});

	it('should be activated when the activated event fires', function () {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component />
			</Controller>
		);

		subject.find('span').simulate('click');

		const expected = subject.find('RadioDecorator').instance();
		const actual = subject.instance().active;

		expect(actual).to.equal(expected);
	});

	it('should be deactivated when the deactivated event fires', function () {
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component active />
			</Controller>
		);

		subject.find('span').simulate('click');

		const expected = null;
		const actual = subject.instance().active;

		expect(actual).to.equal(expected);
	});

	it('should be deactivated when the activated event fires on another instance', function () {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component active />
				<Component />
			</Controller>
		);

		subject.find('span').at(1).simulate('click');

		const expected = subject.find('RadioDecorator').at(1).instance();
		const actual = subject.instance().active;

		expect(actual).to.equal(expected);
	});

	it('should not deactivate items in a ancestor controller', function () {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component active />
				<Component />
				<Controller data-child-controller>
					<Component active />
					<Component />
				</Controller>
			</Controller>
		);

		const childController = subject.find('RadioControllerDecorator').at(1);
		childController.find('span').at(1).simulate('click');

		// Breaking the pattern of 1 expect per test in order to verify the expect change happened
		// (activating second component in child controller) and no unexpected change happened in
		// the parent controller (active component should remain the first component)

		const childExpected = childController.find('RadioDecorator').at(1).instance();
		const childActual = childController.at(0).instance().active;
		expect(childActual).to.equal(childExpected);

		const parentExpected = subject.find('RadioDecorator').at(0).instance();
		const parentActual = subject.at(0).instance().active;
		expect(parentActual).to.equal(parentExpected);
	});


	it('should not call deactivate callback on inactive items', function () {
		const handleDeactivate = sinon.spy();
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);

		// deactivate() is only called when there was a previously active item
		const Wrapper = ({active}) => (	// eslint-disable-line enact/prop-types
			<Controller>
				<Component active={!active} />
				<Component active={active} />
				<Component onClick={handleDeactivate} />
			</Controller>
		);

		// create a controller with no active item
		const subject = mount(
			<Wrapper />
		);

		// activate the second item via prop change
		subject.setProps({
			active: true
		});

		// verify that the deactivate handler wasn't called
		const expected = false;
		const actual = handleDeactivate.called;

		expect(actual).to.equal(expected);
	});
});
