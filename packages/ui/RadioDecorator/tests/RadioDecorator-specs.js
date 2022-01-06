import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {RadioControllerDecorator, RadioDecorator} from '../RadioDecorator';

describe('RadioDecorator', () => {
	const Item = ({onClick, active}) => (
		<span data-testid="span-element" onClick={onClick}>
			{active ? 'Active' : 'Inactive'}
		</span>
	);

	const Controller = RadioControllerDecorator('main');

	test('should be activated when its prop is true on mount', () => {
		const Component = RadioDecorator({prop: 'active'}, Item);
		render(
			<Controller>
				<Component active />
			</Controller>
		);
		const component = screen.getByTestId('span-element');

		expect(component).toHaveTextContent('Active');
	});


	test('should not be activated when its prop is false on mount', () => {
		const Component = RadioDecorator({prop: 'active'}, Item);
		render(
			<Controller>
				<Component />
			</Controller>
		);
		const component = screen.getByTestId('span-element');

		expect(component).toHaveTextContent('Inactive');
	});

	test('should be activated when its prop is set to true after mount', () => {
		const Component = RadioDecorator({prop: 'active'}, Item);
		const Wrapper = ({active}) => (
			<Controller>
				<Component active={active} />
			</Controller>
		);

		const {rerender} = render(<Wrapper />);
		const component = screen.getByTestId('span-element');

		const expected = 'Inactive';

		expect(component).toHaveTextContent(expected);

		rerender(<Wrapper active />);

		const secondExpected = 'Active';

		expect(component).toHaveTextContent(secondExpected);
	});

	test('should fire `activate` event with type when become activated', () => {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const handleActivate = jest.fn();
		const Wrapper = () => (
			<Controller>
				<Component onClick={handleActivate}/>
			</Controller>
		);

		render(<Wrapper />);

		const component = screen.getByTestId('span-element');

		userEvent.click(component);

		const expected = 1;
		const expectedType = {type: 'onClick'};
		const actual = handleActivate.mock.calls.length && handleActivate.mock.calls[0][0];

		expect(handleActivate).toBeCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);

	});

	test('should fire `deactivate` event with type when become deactivated', () => {
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);
		const handleDeactivate = jest.fn();
		const Wrapper = () => (
			<Controller>
				<Component onClick={handleDeactivate}/>
			</Controller>
		);

		render(<Wrapper />);

		const component = screen.getByTestId('span-element');

		userEvent.click(component);

		const expected = 1;
		const expectedType = {type: 'onClick'};
		const actual = handleDeactivate.mock.calls.length && handleDeactivate.mock.calls[0][0];

		expect(handleDeactivate).toBeCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);

	});

	test('should not call deactivate callback on inactive items', () => {
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
		const {rerender} = render(
			<Wrapper />
		);

		// activate the second item via prop change
		rerender(
			<Wrapper active />
		);

		// verify that the deactivate handler wasn't called
		const expected = 0;
		const actual = handleDeactivate.mock.calls.length;

		expect(actual).toBe(expected);
	});

	// TODO This test is skipped because Component doesn't update its content text on click with React Testing Library
	test.skip('should be activated when the activated event fires', () => {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		render(
			<Controller>
				<Component />
			</Controller>
		);
		const component = screen.getByTestId('span-element');

		userEvent.click(component);

		expect(component).toHaveTextContent('Active');
	});

	// TODO This test is skipped because Component doesn't update its content text on click with React Testing Library
	test.skip('should be deactivated when the deactivated event fires', () => {
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);
		render(
			<Controller>
				<Component active />
			</Controller>
		);
		const component = screen.getByTestId('span-element');

		userEvent.click(component);

		expect(component).toHaveTextContent('Inactive');
	});

	// TODO This test is skipped because Component doesn't update its content text on click with React Testing Library
	test.skip('should be deactivated when the activated event fires on another instance', () => {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		render(
			<Controller>
				<Component active />
				<Component  />
			</Controller>
		);
		const activeComponent = screen.getByText('Active');
		const inactiveComponent = screen.getByText('Inactive');

		userEvent.click(inactiveComponent);

		expect(activeComponent).toHaveTextContent('Inactive');
	});

	// TODO This test is skipped because we can't have access to component instance with React Testing Library
	test.skip('should not deactivate items in a ancestor controller', () => {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		render(
			<Controller>
				<Component active />
				<Component />
				<Controller data-child-controller>
					<Component active />
					<Component />
				</Controller>
			</Controller>
		);
		const activeComponent = screen.getAllByText('Active');

		userEvent.click(activeComponent[0]);

		// Breaking the pattern of 1 expect per test in order to verify the expect change happened
		// (activating second component in child controller) and no unexpected change happened in
		// the parent controller (active component should remain the first component)

		expect(activeComponent[1]).toHaveTextContent('Active');
		expect(activeComponent[0]).toHaveTextContent('Active');
	});
});
