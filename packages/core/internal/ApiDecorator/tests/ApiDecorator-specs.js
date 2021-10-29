import {render} from '@testing-library/react';
import {Component as ReactComponent} from 'react';

import ApiDecorator from '../ApiDecorator';

describe('ApiDecorator', () => {
	let data = [];

	const ApiProvider = class extends ReactComponent {
		static displayName = 'ApiProvider';

		constructor (props) {
			super();

			props.setApiProvider(this);
		}

		arrowFunction = () => 'arrow';

		instanceFunction () {
			return 'instance';
		}

		instanceProperty = 'property';

		render () {
			data = {
				arrowFunction: this.arrowFunction,
				instanceFunction: this.instanceFunction,
				instanceProperty: this.instanceProperty
			};

			return (<div />);
		}
	};

	test('should invoke arrow function on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['arrowFunction']},
			ApiProvider
		);

		render(<Component />);

		const expected = 'arrow';
		const actual = data.arrowFunction();

		expect(actual).toBe(expected);
	});

	test('should invoke instance function on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['instanceFunction']},
			ApiProvider
		);

		render(<Component />);

		const expected = 'instance';
		const actual = data.instanceFunction();

		expect(actual).toBe(expected);
	});

	test('should get an instance property on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			ApiProvider
		);

		render(<Component />);

		const expected = 'property';
		const actual = data.instanceProperty;

		expect(actual).toBe(expected);
	});

	test('should set an instance property on wrapped component', () => {
		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			ApiProvider
		);

		render(<Component />);

		data.instanceProperty = 'updated';

		const expected = 'updated';
		const actual = data.instanceProperty;

		expect(actual).toBe(expected);
	});
});
