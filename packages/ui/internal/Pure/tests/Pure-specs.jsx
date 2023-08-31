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
	};

	constructor (props) {
		super(props);
		this.countRenders = 0;
	}

	render () {
		data = this.props;
		const {value} = this.props;
		this.countRenders++;

		return <div {...this.props} data-testid="baseComponent">Value: {value}, CountRenders: {this.countRenders}</div>;
	}
}

const PureComponent = Pure(Base);

describe('Pure', () => {
	test('should have a \'comparator\' function', () => {
		render(<PureComponent comparators={defaultConfig.propComparators} />);

		expect(typeof data.comparators['*']).toBe('function');
	});

	test('should not update wrapped component when passing the same props', () => {
		const {rerender} = render(<PureComponent value={1} />);

		rerender(<PureComponent value={1} />);

		const actual = screen.getByTestId('baseComponent');
		expect(actual).toHaveTextContent('CountRenders: 1');
	});

	test('should update wrapped component when passing different props', () => {
		const {rerender} = render(<PureComponent value={1} />);

		rerender(<PureComponent value={2} />);

		const actual = screen.getByTestId('baseComponent');
		expect(actual).toHaveTextContent('CountRenders: 2');
	});
});
