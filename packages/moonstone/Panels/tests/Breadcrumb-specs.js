import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb', () => {

	test('should include {index} in the payload of {onSelect}', () => {
		const handleSelect = sinon.spy();
		const subject = mount(
			<Breadcrumb index={3} onSelect={handleSelect} />
		);

		subject.simulate('click', {});

		const expected = 3;
		const actual = handleSelect.firstCall.args[0].index;

		expect(actual).toBe(expected);
	});

	test(
		'should include call both the {onClick} and {onSelect} handlers on click',
		() => {
			const handleSelect = sinon.spy();
			const handleClick = sinon.spy();
			const subject = mount(
				<Breadcrumb index={3} onClick={handleClick} onSelect={handleSelect} />
			);

			subject.simulate('click', {});

			const expected = true;
			const actual = handleSelect.calledOnce && handleClick.calledOnce;

			expect(actual).toBe(expected);
		}
	);
});
