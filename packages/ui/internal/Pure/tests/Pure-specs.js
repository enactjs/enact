import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {Component} from 'react';

import Pure from '../Pure.js';

const defaultConfig = {
	propKeys: [1],
	nextKeys: [1],
	propComparators: {
		'*': (a, b) => a === b
	},
	hasChanged: jest.fn()
};

let data = [];

class Base extends Component {
	constructor(props) {
		super(props);
	};

	render(props) {
		data = this.props;
		return <div {...this.props} data-testid="baseComponent">Value: {this.props.a}</div>
	}
}

const Component = Pure(Base);

describe('Pure', () => {
	test('should pass \'propKeys\' to wrapped component', () => {
		render(<Component propkeys={defaultConfig.propKeys} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1";

		expect(wrappedComponent).toHaveAttribute('propkeys', expected);
	});

	test('should pass \'nextKeys\' to wrapped component', () => {
		render(<Component nextkeys={defaultConfig.nextKeys} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1";

		expect(wrappedComponent).toHaveAttribute('nextkeys', expected);
	});

	test('should have a \'comparator\' function', () => {
		render(<Component comparators={defaultConfig.propComparators} />);

		expect(typeof data.comparators['*']).toBe('function');
	});

	// Pass the same prop in order to test `shouldComponentUpdate` lifecycle method
	test('should not updated wrapped component when passing different props', () => {
		const {rerender} = render(<Component a={1} onChange={defaultConfig.hasChanged} />);

		rerender(<Component a={1} onChange={defaultConfig.hasChanged} />)

		const component = screen.getByTestId('baseComponent');

		expect(component).toHaveTextContent('Value: 1');
	});

	// Pass a different prop in order to test `shouldComponentUpdate` lifecycle method
	test('should updated wrapped component when passing different props', () => {
		const {rerender} = render(<Component a={1} onChange={defaultConfig.hasChanged} />);

		rerender(<Component a={2} onChange={defaultConfig.hasChanged} />);

		const component = screen.getByTestId('baseComponent');

		expect(component).toHaveTextContent('Value: 2');
	});
});
