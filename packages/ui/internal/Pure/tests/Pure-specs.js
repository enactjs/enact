import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {Component} from 'react';
import PropTypes from 'prop-types';

import Pure from '../Pure';

const defaultConfig = {
	propComparators: {
		'*': (a, b) => a === b
	}
};

let data = [];

class Base extends Component {
	static propTypes = {
		value: PropTypes.number
	}

	constructor (props) {
		super(props);
	}

	render () {
		data = this.props;
		const {value} = this.props;

		return <div {...this.props} data-testid="baseComponent">Value: {value}</div>;
	}
}

const PureComponent = Pure(Base);

describe('Pure', () => {
	test('should have a \'comparator\' function', () => {
		render(<PureComponent comparators={defaultConfig.propComparators} />);

		expect(typeof data.comparators['*']).toBe('function');
	});

	// Pass the same prop in order to trigger `shouldComponentUpdate` lifecycle method [WRO-12371]
	test('should not update wrapped component when passing the same props', () => {
		const hasChanged = jest.fn();
		const {rerender} = render(<PureComponent value={1} onChange={hasChanged} />);

		rerender(<PureComponent value={1} onChange={hasChanged} />);

		expect(hasChanged).not.toHaveBeenCalled();
	});

	// Pass a different prop in order to trigger `shouldComponentUpdate` lifecycle method [WRO-12371]
	test('should update wrapped component when passing different props', () => {
		const hasChanged = jest.fn();
		const {rerender} = render(<PureComponent value={1} onChange={hasChanged} />);

		rerender(<PureComponent value={2} onChange={hasChanged} />);

		const actual = screen.getByTestId('baseComponent');

		expect(actual).toHaveTextContent('Value: 2');
	});
});
