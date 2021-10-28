import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import useClass from '../useClass';

describe('useClass', () => {
	class Class {
		constructor (arg) {
			this.arg = arg;
		}
	}

	function Component (props) {
		const instance = useClass(Class, props.arg);

		return (
			<div data-testid="div" data-fromclass={instance.arg} data-fromprops={props.arg} />
		);
	}

	test('should pass arg to Class', () => {
		const arg = 'arg';
		render(<Component arg={arg} />);

		const div = screen.getByTestId('div');

		expect(div).toHaveAttribute('data-fromclass', arg);
	});

	test('should use the same instance of Class across renders', () => {
		const arg = 'arg';
		const {rerender} = render(<Component arg={arg} />);

		const div = screen.getByTestId('div');

		expect(div).toHaveAttribute('data-fromprops', arg);

		rerender(<Component arg="changed" />);

		// verify that the children still reflects the class value set at construction but the prop
		// value was updated when props were updated
		expect(div).toHaveAttribute('data-fromclass', arg);
		expect(div).toHaveAttribute('data-fromprops', 'changed');
	});
});
