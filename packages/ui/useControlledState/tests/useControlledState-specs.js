import React from 'react';
import {shallow} from 'enzyme';
import useControlledState from '../useControlledState';

describe('useControlledState', () => {
	function Component (props) {
		// eslint-disable-next-line enact/prop-types
		const [value] = useControlledState(props.defaultValue, props.value, 'value' in props);
		return <div>{value}</div>;
	}

	test('should use the default value when the value is undefined', () => {
		const subject = shallow(<Component defaultValue="abc" />);

		const expected = 'abc';
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});
});
