import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import IdProvider from '../IdProvider';

describe('IdProvider', () => {
	test('should pass id to wrapped component', () => {
		const Base = (props) => <div role="button" {...props} />;

		const Component = IdProvider({generateProp: null, prefix: 'custom_'}, Base);

		render(<Component />);
		const wrappedDiv = screen.getByRole('button');

		const expected = 'custom_1';

		expect(wrappedDiv).toHaveAttribute('id', expected);
	});

	test('should create a generation function with a name indicated by \'generateProp\'', () => {
		const expected = 'customProp';
		let actual;

		const Base = (props) => {
			actual = props;
			return <div />;
		};

		const Component = IdProvider({generateProp: expected, prefix: 'custom_'}, Base);

		render(<Component />);

		// eslint-disable-next-line no-undefined
		expect(actual[expected]).not.toBe(undefined);
		expect(typeof actual[expected]).toBe('function');
	});
});
