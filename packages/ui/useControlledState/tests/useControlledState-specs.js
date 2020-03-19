import React from 'react';
import {shallow} from 'enzyme';
import useControlledState from '../useControlledState';

describe('useControlledState', () => {
	function Component (props) {
		// eslint-disable-next-line enact/prop-types
		const [value, setValue] = useControlledState(props.defaultValue, props.value, 'value' in props);
		return <div setValue={setValue}>{value}</div>;
	}

	test('should use the default value when the value is undefined', () => {
		const subject = shallow(<Component defaultValue="abc" />);

		const expected = 'abc';
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});

	test('should not change default value', () => {
		const subject = shallow(<Component defaultValue="abc" />);

		subject.setProps({defaultValue: 'def'});

		const expected = 'abc';
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});

	test('should not change uncontrolled setting', () => {
		const subject = shallow(<Component defaultValue="abc" />);

		subject.setProps({defaultValue: null, value: 'def'});

		const expected = 'abc';
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});

	test('should update controlled value', () => {
		const subject = shallow(<Component value="abc" />);

		subject.setProps({value: 'def'});

		const expected = 'def';
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});

	test('should not change controlled setting', () => {
		const subject = shallow(<Component value="abc" />);

		subject.setProps({defaultValue: 'def', value: 'ghi'});

		const expected = 'ghi';
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});

	test('should not allow setting a value when controlled', () => {
		const subject = shallow(<Component value="abc" />);

		subject.invoke('setValue')('ghi');
		subject.update();

		const expected = 'abc';
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});
});
