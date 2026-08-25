import {createContext, Component, type ComponentPropsWithoutRef} from 'react';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Registry from '../Registry';
import type {RegisterFunction, RegistryController, RegistryEvent, RegistryHandle} from '../Registry';

const SomeContext = createContext<RegisterFunction | null>(null);

describe('Registry', () => {
	class NotifiesTree extends Component<ComponentPropsWithoutRef<'button'>> {
		static contextType = SomeContext;

		constructor (props: ComponentPropsWithoutRef<'button'>) {
			super(props);
			this.registry = Registry.create(this.handleNotify);
		}

		componentDidMount () {
			this.registry.parent = this.context as RegisterFunction | null;
		}

		registry: RegistryHandle;

		handleNotify = ({action}: RegistryEvent) => {
			if (action === 'update') {
				this.registry.parent = this.context as RegisterFunction | null;
			}
		};

		handleClick = () => {
			this.registry.notify({action: 'notify'});
		};

		render () {
			return (
				<SomeContext value={this.registry.register}>
					<button {...this.props} onClick={this.handleClick}>Notify!</button>
					{this.props.children}
				</SomeContext>
			);
		}
	}

	class HandlesNotification extends Component<ComponentPropsWithoutRef<'div'>, {number: number}> {
		static contextType = SomeContext;

		state = {
			number: 0
		};

		componentDidMount () {
			const register = this.context as RegisterFunction | null;
			if (register && typeof register === 'function') {
				this.registry = register(this.handleResize);
			}
		}

		componentWillUnmount () {
			if (this.registry) {
				this.registry.unregister();
			}
		}

		registry?: RegistryController;

		handleResize = () => {
			this.setState((prevState) => {
				const number = prevState.number + 1;

				this.registry?.notify({action: 'update'});

				return ({
					number
				});
			});
		};

		render () {
			return <div {...this.props}>{this.state.number}</div>;
		}
	}

	test('should increment child on click', async () => {
		const user = userEvent.setup();
		render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
			</NotifiesTree>
		);

		await user.click(screen.getByTestId('a-btn'));

		const expected = '1';
		const child = screen.getByTestId('a');

		expect(child).toHaveTextContent(expected);
	});

	test('should increment both children on top click', async () => {
		const user = userEvent.setup();
		render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
				<NotifiesTree data-testid="b-btn">
					<HandlesNotification data-testid="b" />
				</NotifiesTree>
			</NotifiesTree>
		);

		await user.click(screen.getByTestId('a-btn'));

		const expected = '1';
		const childA = screen.getByTestId('a');
		const childB = screen.getByTestId('b');

		expect(childA).toHaveTextContent(expected);
		expect(childB).toHaveTextContent(expected);
	});

	test('should increment the deepest child when we click child button', async () => {
		const user = userEvent.setup();
		render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
				<NotifiesTree data-testid="b-btn">
					<HandlesNotification data-testid="b" />
				</NotifiesTree>
			</NotifiesTree>
		);

		await user.click(screen.getByTestId('b-btn'));

		const expectedA = '0';
		const expectedB = '1';
		const childA = screen.getByTestId('a');
		const childB = screen.getByTestId('b');

		expect(childA).toHaveTextContent(expectedA);
		expect(childB).toHaveTextContent(expectedB);
	});

	test('should support removing children without error', async () => {
		const user = userEvent.setup();
		const {rerender} = render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
				<HandlesNotification data-testid="b" />
			</NotifiesTree>
		);

		await user.click(screen.getByTestId('a-btn'));

		// changing children should be safe and not throw errors when notifying instances
		rerender(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="c" />
			</NotifiesTree>
		);

		await user.click(screen.getByTestId('a-btn'));

		const expectedC = '1';
		const childC = screen.getByTestId('c');

		expect(childC).toHaveTextContent(expectedC);
	});
});
