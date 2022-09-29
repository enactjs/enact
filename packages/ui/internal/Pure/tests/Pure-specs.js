import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import React from 'react';

import Pure from '../Pure.js';

const defaultConfig = {
	propKeys: [1, 2, 3],
	nextKeys: [1, 2, 3],
	propComparators: {
		'*': (a, b) => a === b
	},
	hasChanged: jest.fn()
};

let data = [];

class Base extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			a: 1,
			b: 2,
			c: 3
		};
	};

	render(props) {
		data = this.props;
		return <div {...this.props} data-testid="baseComponent">Values: {this.state.a}, {this.state.b}, {this.state.c}</div>
	}
}

const Component = Pure(defaultConfig, Base);

describe('Pure', () => {
	test('should pass \'propKeys\' to wrapped component', () => {
		render(<Component propkeys={defaultConfig.propKeys} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1,2,3";

		expect(wrappedComponent).toHaveAttribute('propkeys', expected);
	});

	test('should pass \'nextKeys\' to wrapped component', () => {
		render(<Component nextkeys={defaultConfig.nextKeys} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1,2,3";

		expect(wrappedComponent).toHaveAttribute('nextkeys', expected);
	});

	test('should have a \'comparator\' function', () => {
		render(<Component comparators={defaultConfig.propComparators} />);

		expect(typeof data.comparators['*']).toBe('function');
	});

	test('should not updated wrapped component when passing different props', () => {
		const onChange = jest.fn();
		const {rerender} = render(<Component onChange={defaultConfig.hasChanged} />);

		rerender(<Component onChange={defaultConfig.hasChanged} d={4} e={5} f={6} />)

		expect(onChange).not.toHaveBeenCalled();
	});
});
