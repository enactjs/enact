import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createRef} from 'react';

import {RadioControllerDecorator, RadioDecorator} from '../RadioDecorator';

describe('RadioDecorator', () => {
	const Item = ({onClick, active}) => (
		<span data-testid="span-element" onClick={onClick}>
			{active ? 'Active' : 'Inactive'}
		</span>
	);

	const Controller = RadioControllerDecorator('main');

	const expectToBeActive = (controller, decorator) => {
		expect(controller.active).toBe(decorator && decorator.handleDeactivate);
	};

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

	test('should fire `activate` event with type when become activated', async () => {
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const handleActivate = jest.fn();
		const user = userEvent.setup();
		const Wrapper = () => (
			<Controller>
				<Component onClick={handleActivate} />
			</Controller>
		);

		render(<Wrapper />);

		const component = screen.getByTestId('span-element');

		await user.click(component);

		const expected = 1;
		const expectedType = {type: 'onClick'};
		const actual = handleActivate.mock.calls.length && handleActivate.mock.calls[0][0];

		expect(handleActivate).toBeCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);
	});

	test('should fire `deactivate` event with type when become deactivated', async () => {
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);
		const handleDeactivate = jest.fn();
		const user = userEvent.setup();
		const Wrapper = () => (
			<Controller>
				<Component onClick={handleDeactivate} />
			</Controller>
		);

		render(<Wrapper />);

		const component = screen.getByTestId('span-element');

		await user.click(component);

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

	test('should be activated when the activated event fires', async () => {
		const controllerRef = createRef();
		const decoratorRef = createRef();
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const user = userEvent.setup();
		render(
			<Controller ref={controllerRef}>
				<Component ref={decoratorRef} />
			</Controller>
		);
		const component = screen.getByTestId('span-element');

		await user.click(component);

		expectToBeActive(controllerRef.current, decoratorRef.current);
	});

	test('should be deactivated when the deactivated event fires', async () => {
		const controllerRef = createRef();
		const decoratorRef = createRef();
		const Component = RadioDecorator({deactivate: 'onClick', prop: 'active'}, Item);
		const user = userEvent.setup();
		render(
			<Controller ref={controllerRef}>
				<Component active ref={decoratorRef} />
			</Controller>
		);
		const component = screen.getByTestId('span-element');

		await user.click(component);

		expectToBeActive(controllerRef.current, null);
	});

	test('should be deactivated when the activated event fires on another instance', async () => {
		const controllerRef = createRef();
		const decoratorRef = createRef();
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const user = userEvent.setup();
		render(
			<Controller ref={controllerRef} >
				<Component active />
				<Component ref={decoratorRef} />
			</Controller>
		);

		const inactiveComponent = screen.getByText('Inactive');

		await user.click(inactiveComponent);

		expectToBeActive(controllerRef.current, decoratorRef.current);
	});

	test('should not deactivate items in a ancestor controller', async () => {
		const parentControllerRef = createRef();
		const parentDecoratorRef = createRef();
		const childControllerRef = createRef();
		const childDecoratorRef = createRef();
		const Component = RadioDecorator({activate: 'onClick', prop: 'active'}, Item);
		const user = userEvent.setup();
		render(
			<Controller ref={parentControllerRef}>
				<Component active ref={parentDecoratorRef} />
				<Component />
				<Controller data-child-controller ref={childControllerRef}>
					<Component active />
					<Component ref={childDecoratorRef} />
				</Controller>
			</Controller>
		);

		const inactiveComponents = screen.getAllByText('Inactive');

		await user.click(inactiveComponents[1]);

		// Breaking the pattern of 1 expect per test in order to verify the expect change happened
		// (activating second component in child controller) and no unexpected change happened in
		// the parent controller (active component should remain the first component)
		expectToBeActive(parentControllerRef, parentDecoratorRef);
		expectToBeActive(childControllerRef, childDecoratorRef);
	});
});
