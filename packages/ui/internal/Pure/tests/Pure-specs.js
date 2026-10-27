import {checkPropTypes} from '@enact/core/util';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {Component, createRef} from 'react';
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
		checkPropTypes(this, props);
		this.countRenders = 0;
	}

	componentDidUpdate (prevProps) {
		checkPropTypes(this, this.props, prevProps);
	}

	render () {
		data = this.props;
		const {value} = this.props;
		this.countRenders++;

		return <div {...this.props} data-testid="baseComponent">Value: {value}, CountRenders: {this.countRenders}</div>;
	}
}

class LooseBase extends Component {
	constructor (props) {
		super(props);
		this.countRenders = 0;
	}

	render () {
		this.countRenders++;

		return <div data-testid="baseComponent">CountRenders: {this.countRenders}</div>;
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

	test('should use a custom prop comparator', () => {
		const CustomPure = Pure({
			propComparators: {
				value: (a, b) => a.id === b.id
			}
		}, LooseBase);
		const {rerender} = render(<CustomPure value={{id: 1}} />);

		rerender(<CustomPure value={{id: 1}} />);

		const actual = screen.getByTestId('baseComponent');
		expect(actual).toHaveTextContent('CountRenders: 1');

		rerender(<CustomPure value={{id: 2}} />);

		expect(actual).toHaveTextContent('CountRenders: 2');
	});

	test('should not forward ref to the wrapped component', () => {
		const ref = createRef();
		const {rerender} = render(<PureComponent ref={ref} value={1} />);

		rerender(<PureComponent ref={ref} value={1} />);

		const actual = screen.getByTestId('baseComponent');
		expect(actual).toHaveTextContent('CountRenders: 1');
		expect(data.ref).toBeUndefined();
	});

	test('should update wrapped component when the number of props changes', () => {
		const {rerender} = render(<PureComponent value={1} />);

		rerender(<PureComponent value={1} id="extra" />);

		const actual = screen.getByTestId('baseComponent');
		expect(actual).toHaveTextContent('CountRenders: 2');
	});
});
