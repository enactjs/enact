import {mount} from 'enzyme';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';

import {RadioControllerDecorator, RadioDecorator} from '../RadioDecorator';

describe('RadioDecorator', () => {

	const Item = ({onClick, active}) => (
		<span onClick={onClick} data-testid="span-element">
			{active ? 'Active' : 'Inactive'}
		</span>
	);

	const Controller = RadioControllerDecorator('main');

	const expectToBeActive = (controller, decorator) => {
		expect(controller.instance().active).toBe(decorator && decorator.instance().handleDeactivate);
	};

	test('should be activated when its prop is true on mount', () => {
		const Component = RadioDecorator({prop: 'active'}, Item);
		render(
			<Controller>
				<Component active />
			</Controller>
		);

		expect(screen.getByTestId('span-element')).toHaveTextContent('Active');
	});


	test('should not be activated when its prop is false on mount', () => {
		const Component = RadioDecorator({prop: 'active'}, Item);
		render(
			<Controller>
				<Component />
			</Controller>
		);

		expect(screen.getByTestId('span-element')).toHaveTextContent('Inactive');
	});

	// NOTE: Can't change props with react testing library
	test.skip(
		'should be activated when its prop is set to true after mount',
		() => {
			const Component = RadioDecorator({prop: 'active'}, Item);
			const Wrapper = ({active}) => (
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

			const instance = subject.find('RadioDecorator');
			expectToBeActive(subject.find('RadioControllerDecorator'), instance);
		}
	);

	// NOTE: Component doesn't update on click with react testing library
	test.skip('should be activated when the activated event fires', () => {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component />
			</Controller>
		);

		subject.find('span').simulate('click');

		const instance = subject.find('RadioDecorator');
		expectToBeActive(subject, instance);
	});

	// NOTE: Component doesn't update on click with react testing library
	test.skip('should be deactivated when the deactivated event fires', () => {
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component active />
			</Controller>
		);

		subject.find('span').simulate('click');

		expectToBeActive(subject, null);
	});

	// NOTE: Component doesn't update on click with react testing library
	test.skip(
		'should be deactivated when the activated event fires on another instance',
		() => {
			const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
			const subject = mount(
				<Controller>
					<Component active />
					<Component />
				</Controller>
			);

			subject.find('span').at(1).simulate('click');

			const instance = subject.find('RadioDecorator').at(1);
			expectToBeActive(subject, instance);
		}
	);

	// NOTE: Component doesn't update on click with react testing library
	test.skip('should not deactivate items in a ancestor controller', () => {
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

		const childInstance = childController.find('RadioDecorator').at(1);
		expectToBeActive(childController, childInstance);

		const parentInstance = subject.find('RadioDecorator').at(0);
		expectToBeActive(subject, parentInstance);
	});

	// NOTE: Can't change props with react testing library
	test.skip('should not call deactivate callback on inactive items', () => {
		const handleDeactivate = jest.fn();
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);

		// deactivate() is only called when there was a previously active item
		const Wrapper = ({active}) => (
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
		const expected = 0;
		const actual = handleDeactivate.mock.calls.length;

		expect(actual).toBe(expected);
	});
});
