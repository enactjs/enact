import React from 'react';
import {mount} from 'enzyme';

import SharedStateDecorator, {SharedState} from '../SharedStateDecorator';

describe('SharedStateDecorator Specs', () => {

	// const Base = () => <div />;

	test('should provide a set method via context', () => {
		const fn = jest.fn();
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					fn(value.set);

					return null;
				}}
			</SharedState.Consumer>
		));

		mount(<Component />);

		const expected = 'function';
		const actual = typeof fn.mock.calls[0][0];

		expect(actual).toBe(expected);
	});

	test('should provide a get method via context', () => {
		const fn = jest.fn();
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					fn(value.get);

					return null;
				}}
			</SharedState.Consumer>
		));

		mount(<Component />);

		const expected = 'function';
		const actual = typeof fn.mock.calls[0][0];

		expect(actual).toBe(expected);
	});

	test('should provide a delete method via context', () => {
		const fn = jest.fn();
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					fn(value.delete);

					return null;
				}}
			</SharedState.Consumer>
		));

		mount(<Component />);

		const expected = 'function';
		const actual = typeof fn.mock.calls[0][0];

		expect(actual).toBe(expected);
	});

	test('should supporting setting and getting a value by key when {id} is set', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component id="outer" />);

		const expected = 'value';
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should supporting setting and getting a value by key when {id} is set to a non-zero value', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component id={-1} />);

		const expected = 'value';
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should supporting setting and getting a value by key when {id} is set to zero', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component id={0} />);

		const expected = 'value';
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should not set or return values when {id} is not set', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component />);

		const expected = null;
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should not set or return values when {id} is set to an empty string', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component id="" />);

		const expected = null;
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should not set or return values when {id} is set to null', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component id={null} />);

		const expected = null;
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should not set or return values when {id} and {noSharedState} are set', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component id="outer" noSharedState />);

		const expected = null;
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should supporting deleting a value by key when {id} is set', () => {
		const Component = SharedStateDecorator(() => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');
					value.delete('key');

					return value.get('key');
				}}
			</SharedState.Consumer>
		));

		const subject = mount(<Component id="outer" />);

		const expected = null;
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should share data upstream when inside another SharedStateDecorator', () => {
		const Component = SharedStateDecorator(({children, ...rest}) => (
			<SharedState.Consumer>
				{value => {
					value.set('key', 'value');

					return (
						<div {...rest}>
							<span>{value.get('key')}</span>
							{children}
						</div>
					);
				}}
			</SharedState.Consumer>
		));

		const subject = mount(
			<Component id="outer">
				<Component id="inner" />
			</Component>
		);

		const expected = {
			// "data" is grouped by id so the top level key is the current id
			outer: {
				// this is set by value.set('key', 'value');
				key: 'value',
				// when a descendant is added, it pushes its data upstream stored by its id
				inner: {
					// like above, the data is grouped again by the id
					inner: {
						// from the descendant's set()
						key: 'value'
					}
				}
			}
		};
		const actual = subject.instance().data;

		expect(actual).toEqual(expected);
	});

	test('should restore shared state from ancestor', () => {
		class Base extends React.Component {
			static contextType = SharedState

			render () {
				// eslint-disable-next-line enact/prop-types
				const {children, value: propValue, ...rest} = this.props;

				if (propValue) {
					this.context.set('key', propValue);
				}

				return (
					<div {...rest}>
						<span>{this.context.get('key')}</span>
						{children}
					</div>
				);
			}
		}
		const Component = SharedStateDecorator({updateOnMount: true}, Base);

		const subject = mount(
			<Component id="outer" value="value">
				<Component id="inner" value="from-prop" />
			</Component>
		);

		// remove the children which drops inner's shared state
		subject.setProps({children: null});

		// recreate it with the same id but no initial value to validate the previous state is
		// restored. updateOnMount is used above to coerce a re-render on mount since the shared
		// state value is used in the render method and isn't available on first render otherwise.
		subject.setProps({children: <Component id="inner" />});

		const expected = 'from-prop';
		const actual = subject.find('div#inner').text();

		expect(actual).toBe(expected);
	});

});
