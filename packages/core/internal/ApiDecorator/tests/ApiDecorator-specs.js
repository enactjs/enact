import {render} from '@testing-library/react';
import {createRef, Component as ReactComponent} from 'react';

import ApiDecorator from '../ApiDecorator';

describe('ApiDecorator', () => {
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
			return (<div />);
		}
	};

	const WrongApiProvider = class extends ReactComponent {
		static displayName = 'WrongApiProvider';

		constructor (props) {
			super();

			props.setApiProvider();
		}

		render () {
			return (<div />);
		}
	};

	test('should invoke arrow function on wrapped component', () => {
		const ref = createRef();

		const Component = ApiDecorator(
			{api: ['arrowFunction']},
			ApiProvider
		);

		render(<Component ref={ref} />);

		const expected = 'arrow';
		const actual = ref.current.arrowFunction();

		expect(actual).toBe(expected);
	});

	test('should invoke instance function on wrapped component', () => {
		const ref = createRef();

		const Component = ApiDecorator(
			{api: ['instanceFunction']},
			ApiProvider
		);

		render(<Component ref={ref} />);

		const expected = 'instance';
		const actual = ref.current.instanceFunction();

		expect(actual).toBe(expected);
	});

	test('should get an instance property on wrapped component', () => {
		const ref = createRef();

		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			ApiProvider
		);

		render(<Component ref={ref} />);

		const expected = 'property';
		const actual = ref.current.instanceProperty;

		expect(actual).toBe(expected);
	});

	test('should set an instance property on wrapped component', () => {
		const ref = createRef();

		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			ApiProvider
		);

		render(<Component ref={ref} />);

		ref.current.instanceProperty = 'updated';

		const expected = 'updated';
		const actual = ref.current.instanceProperty;

		expect(actual).toBe(expected);
	});

	test('should not get an instance property on wrapped component if the parameter of setApiProvider is missing', () => {
		const ref = createRef();

		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			WrongApiProvider
		);

		render(<Component ref={ref} />);

		// eslint-disable-next-line no-undefined
		const expected = undefined;
		const actual = ref.current.instanceProperty;

		expect(actual).toBe(expected);
	});

	test('should not set an instance property on wrapped component if the parameter of setApiProvider is missing', () => {
		const ref = createRef();

		const Component = ApiDecorator(
			{api: ['instanceProperty']},
			WrongApiProvider
		);

		render(<Component ref={ref} />);

		ref.current.instanceProperty = 'updated';

		// eslint-disable-next-line no-undefined
		const expected = undefined;
		const actual = ref.current.instanceProperty;

		expect(actual).toBe(expected);
	});
});
