import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {Component} from 'react';

import Pure from '../Pure';

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

const PureComponent = Pure(Base);

describe('Pure', () => {
	test('should pass \'propKeys\' to wrapped component', () => {
		render(<PureComponent propkeys={defaultConfig.propKeys} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1";

		expect(wrappedComponent).toHaveAttribute('propkeys', expected);
	});

	test('should pass \'nextKeys\' to wrapped component', () => {
		render(<PureComponent nextkeys={defaultConfig.nextKeys} />);

		const wrappedComponent = screen.getByTestId('baseComponent');

		const expected = "1";

		expect(wrappedComponent).toHaveAttribute('nextkeys', expected);
	});

	test('should have a \'comparator\' function', () => {
		render(<PureComponent comparators={defaultConfig.propComparators} />);

		expect(typeof data.comparators['*']).toBe('function');
	});

	// Pass the same prop in order to trigger `shouldComponentUpdate` lifecycle method [WRO-12371]
	test('should not updated wrapped component when passing the same props', () => {
		const onChange = jest.fn();
		const {rerender} = render(<PureComponent a={1} onChange={defaultConfig.hasChanged} />);

		rerender(<PureComponent a={1} onChange={defaultConfig.hasChanged} />)

		expect(onChange).not.toHaveBeenCalled();
	});

	// Pass a different prop in order to trigger `shouldComponentUpdate` lifecycle method [WRO-12371]
	test('should updated wrapped component when passing different props', () => {
		const {rerender} = render(<PureComponent a={1} onChange={defaultConfig.hasChanged} />);

		rerender(<PureComponent a={2} onChange={defaultConfig.hasChanged} />)

		const actual = screen.getByTestId('baseComponent');

		expect(actual).toHaveTextContent('Value: 2');
	});
});
