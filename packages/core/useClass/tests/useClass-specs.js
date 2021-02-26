/* eslint-disable enact/prop-types */

import {shallow} from 'enzyme';

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
			<div fromProps={props.arg} fromClass={instance.arg} />
		);
	}

	test('should pass arg to Class', () => {
		const arg = 'arg';
		const subject = shallow(<Component arg={arg} />);

		const expected = arg;
		const actual = subject.prop('fromClass');

		expect(actual).toBe(expected);
	});

	test('should use the same instance of Class across renders', () => {
		const arg = 'arg';
		const subject = shallow(<Component arg={arg} />);

		expect(subject.prop('fromProps')).toBe(arg);

		subject.setProps({arg: 'changed'});

		// verify that the children still reflects the class value set at construction but the prop
		// value was updated when props were updated
		expect(subject.prop('fromClass')).toBe(arg);
		expect(subject.prop('fromProps')).toBe('changed');
	});
});
