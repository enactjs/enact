import {createContext, Component} from 'react';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Registry from '../Registry';

const SomeContext = createContext();

describe('Registry', () => {
	class NotifiesTree extends Component {
		static contextType = SomeContext;

		componentDidMount () {
			this.registry.parent = this.context;
		}

		registry = Registry.create();

		handleClick = () => {
			this.registry.notify({});
		};

		render () {
			return (
				<SomeContext.Provider value={this.registry.register}>
					<button {...this.props} onClick={this.handleClick}>Notify!</button>
					{this.props.children}
				</SomeContext.Provider>
			);
		}
	}

	class HandlesNotification extends Component {
		static contextType = SomeContext;

		state = {
			number: 0
		};

		componentDidMount () {
			if (this.context && typeof this.context === 'function') {
				this.registry = this.context(this.handleResize);
			}
		}

		componentWillUnmount () {
			if (this.registry) {
				this.registry.unregister();
			}
		}

		handleResize = () => {
			this.setState((prevState) => {
				const number = prevState.number + 1;

				return ({
					number
				});
			});
		};

		render () {
			return <div {...this.props}>{this.state.number}</div>;
		}
	}

	test('should increment child on click', () => {
		render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
			</NotifiesTree>
		);

		userEvent.click(screen.getByTestId('a-btn'));

		const expected = '1';
		const child = screen.getByTestId('a');

		expect(child).toHaveTextContent(expected);
	});

	test('should increment both children on top click', () => {
		render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
				<NotifiesTree data-testid="b-btn">
					<HandlesNotification data-testid="b" />
				</NotifiesTree>
			</NotifiesTree>
		);

		userEvent.click(screen.getByTestId('a-btn'));

		const expected = '1';
		const childA = screen.getByTestId('a');
		const childB = screen.getByTestId('b');

		expect(childA).toHaveTextContent(expected);
		expect(childB).toHaveTextContent(expected);
	});

	test('should increment the deepest child when we click child button', () => {
		render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
				<NotifiesTree data-testid="b-btn">
					<HandlesNotification data-testid="b" />
				</NotifiesTree>
			</NotifiesTree>
		);

		userEvent.click(screen.getByTestId('b-btn'));

		const expectedA = '0';
		const expectedB = '1';
		const childA = screen.getByTestId('a');
		const childB = screen.getByTestId('b');

		expect(childA).toHaveTextContent(expectedA);
		expect(childB).toHaveTextContent(expectedB);
	});

	test('should support removing children without error', () => {
		const {rerender} = render(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="a" />
				<HandlesNotification data-testid="b" />
			</NotifiesTree>
		);

		userEvent.click(screen.getByTestId('a-btn'));

		// changing children should be safe and not throw errors when notifying instances
		rerender(
			<NotifiesTree data-testid="a-btn">
				<HandlesNotification data-testid="c" />
			</NotifiesTree>
		);

		userEvent.click(screen.getByTestId('a-btn'));

		const expectedC = '1';
		const childC = screen.getByTestId('c');

		expect(childC).toHaveTextContent(expectedC);
	});
});
