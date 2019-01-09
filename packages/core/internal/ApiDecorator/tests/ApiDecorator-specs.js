import React from 'react';
import {mount} from 'enzyme';
import ApiDecorator from '../ApiDecorator';

describe('ApiDecorator', () => {

	const ApiProvider = class extends React.Component {
		static displayName = 'ApiProvider';

		constructor (props) {
			super();

			// eslint-disable-next-line
			props.setApiProvider(this);
		}

		arrowFunction = () => 'arrow'

		instanceFunction () {
			return 'instance';
		}

		instanceProperty = 'property'

		render () {
			return (
				<div />
			);
		}
	};

	test('should invoke arrow function on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['arrowFunction']},
			ApiProvider
		);

		const subject = mount(
			<Component />
		);

		const expected = 'arrow';
		const actual = subject.instance().arrowFunction();

		expect(actual).toBe(expected);
	});

	test('should invoke instance function on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['instanceFunction']},
			ApiProvider
		);

		const subject = mount(
			<Component />
		);

		const expected = 'instance';
		const actual = subject.instance().instanceFunction();

		expect(actual).toBe(expected);
	});

	test('should get an instance property on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			ApiProvider
		);

		const subject = mount(
			<Component />
		);

		const expected = 'property';
		const actual = subject.instance().instanceProperty;

		expect(actual).toBe(expected);
	});

	test('should set an instance property on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			ApiProvider
		);

		const subject = mount(
			<Component />
		);

		subject.instance().instanceProperty = 'updated';

		const expected = 'updated';
		const actual = subject.instance().instanceProperty;

		expect(actual).toBe(expected);
	});
});
