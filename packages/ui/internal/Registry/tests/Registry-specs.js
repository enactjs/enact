import React from 'react';
import {mount} from 'enzyme';
import Registry from '../Registry';
import {ResizeContext} from '../../../Remeasurable';

describe('Registry', () => {
	class EmitsResize extends React.Component {
		static contextType = ResizeContext;

		componentDidMount () {
			this.resize.setParent(this.context);
		}

		resize = Registry.create();

		handleClick = () => {
			this.resize.notify({});
		};

		render () {
			return (
				<ResizeContext.Provider value={this.resize}>
					<button {...this.props} onClick={this.handleClick}>Notify!</button>
					{this.props.children}
				</ResizeContext.Provider>
			);
		}
	}

	class UsesResize extends React.Component {
		static contextType = ResizeContext;

		state = {
			number: 0
		};

		componentDidMount () {
			if (this.context) {
				this.context.register(this.handleResize);
			}
		}

		componentWillUnmount () {
			if (this.context) {
				this.context.unregister(this.handleResize);
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

	test('should increment child on click ', () => {
		const RegistryApp = mount(
			<EmitsResize id="a-btn">
				<UsesResize id="a" />
			</EmitsResize>
		);

		RegistryApp.find('button#a-btn').simulate('click');

		const expected = '1';
		const actual = RegistryApp.find('div#a').text();

		expect(expected).toBe(actual);
	});

	test('should increment both children on top click ', () => {
		const RegistryApp = mount(
			<EmitsResize id="a-btn">
				<UsesResize id="a" />
				<EmitsResize id="b-btn">
					<UsesResize id="b" />
				</EmitsResize>
			</EmitsResize>
		);

		RegistryApp.find('button#a-btn').simulate('click');

		const expected = '1';
		const actualA = RegistryApp.find('div#a').text();
		const actualB = RegistryApp.find('div#b').text();

		expect(expected).toBe(actualA);
		expect(expected).toBe(actualB);
	});

	test('should increment the deepest child when we click child button ', () => {
		const RegistryApp = mount(
			<EmitsResize id="a-btn">
				<UsesResize id="a" />
				<EmitsResize id="b-btn">
					<UsesResize id="b" />
				</EmitsResize>
			</EmitsResize>
		);

		RegistryApp.find('button#b-btn').simulate('click');

		const expectedA = '0';
		const expectedB = '1';
		const actualA = RegistryApp.find('div#a').text();
		const actualB = RegistryApp.find('div#b').text();

		expect(expectedA).toBe(actualA);
		expect(expectedB).toBe(actualB);
	});
});
