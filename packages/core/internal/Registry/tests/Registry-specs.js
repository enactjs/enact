import React from 'react';
import {mount} from 'enzyme';
import Registry from '../Registry';

const SomeContext = React.createContext();

describe('Registry', () => {
	class NotifiesTree extends React.Component {
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

	class HandlesNotification extends React.Component {
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
		const RegistryApp = mount(
			<NotifiesTree id="a-btn">
				<HandlesNotification id="a" />
			</NotifiesTree>
		);

		RegistryApp.find('button#a-btn').simulate('click');

		const expected = '1';
		const actual = RegistryApp.find('div#a').text();

		expect(expected).toBe(actual);
	});

	test('should increment both children on top click', () => {
		const RegistryApp = mount(
			<NotifiesTree id="a-btn">
				<HandlesNotification id="a" />
				<NotifiesTree id="b-btn">
					<HandlesNotification id="b" />
				</NotifiesTree>
			</NotifiesTree>
		);

		RegistryApp.find('button#a-btn').simulate('click');

		const expected = '1';
		const actualA = RegistryApp.find('div#a').text();
		const actualB = RegistryApp.find('div#b').text();

		expect(expected).toBe(actualA);
		expect(expected).toBe(actualB);
	});

	test('should increment the deepest child when we click child button', () => {
		const RegistryApp = mount(
			<NotifiesTree id="a-btn">
				<HandlesNotification id="a" />
				<NotifiesTree id="b-btn">
					<HandlesNotification id="b" />
				</NotifiesTree>
			</NotifiesTree>
		);

		RegistryApp.find('button#b-btn').simulate('click');

		const expectedA = '0';
		const expectedB = '1';
		const actualA = RegistryApp.find('div#a').text();
		const actualB = RegistryApp.find('div#b').text();

		expect(expectedA).toBe(actualA);
		expect(expectedB).toBe(actualB);
	});

	test('should support removing children without error', () => {
		const RegistryApp = mount(
			<NotifiesTree id="a-btn">
				<HandlesNotification id="a" />
				<HandlesNotification id="b" />
			</NotifiesTree>
		);

		RegistryApp.find('button#a-btn').simulate('click');

		// changing children should be safe and not throw errors when notifying instances
		RegistryApp.setProps({
			children: <HandlesNotification id="c" />
		});

		RegistryApp.find('button#a-btn').simulate('click');

		const expectedC = '1';
		const actualC = RegistryApp.find('div#c').text();

		expect(expectedC).toBe(actualC);
	});
});
