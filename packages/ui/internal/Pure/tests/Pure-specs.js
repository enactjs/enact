import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import React from 'react';

import Pure from '../Pure.js';

const defaultConfig = {
	propKeys: [1, 2, 3],
	nextKeys: [1, 2, 3],
	propComparators: {
		'*': (a, b) => a === b
	}
};

let data = [];

class Base extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			a: 5
		};
	};

	render(props) {
		data = this.props;
		return <div {...this.props} data-testid="baseComponent">Value: {this.state.a}</div>
	}
}

const Component = Pure(defaultConfig, Base);

describe('Pure', () => {
	test('should pass \'propKeys\' to wrapped component', () => {
		render(<Component propkeys={defaultConfig.propKeys} nextkeys={defaultConfig.nextKeys} comparators={defaultConfig.propComparators} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1,2,3";

		expect(wrappedComponent).toHaveAttribute('propkeys', expected);
	});

	test('nshould pass \'nextKeys\' to wrapped component', () => {
		render(<Component propkeys={defaultConfig.propKeys} nextkeys={defaultConfig.nextKeys} comparators={defaultConfig.propComparators} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1,2,3";

		expect(wrappedComponent).toHaveAttribute('nextkeys', expected);
	});

	test('should have a \'comparator\' function', () => {
		render(<Component propkeys={defaultConfig.propKeys} nextkeys={defaultConfig.nextKeys} comparators={defaultConfig.propComparators} />);

		expect(typeof data.comparators['*']).toBe('function');
	});
});
