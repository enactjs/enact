import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Picker from '../Picker';
import PickerItem from '../PickerItem';
import css from '../Picker.less';

describe('Picker Specs', function () {

	it('should have a default \'value\' of 0', function () {
		const picker = mount(
			<Picker index={0} min={0} max={0} />
		);

		const expected = 0;
		const actual = picker.find('Picker').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should return an object \{value: Number\} that represents the next value of the Picker component when clicking the increment \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should return an object \{value: Number\} that represents the next value of the Picker component when clicking the decrement \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} />
		);

		picker.find(`.${css.decrementer}`).simulate('click');

		const expected = -1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should not run the onChange handler when disabled', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} disabled min={0} max={0} value={0} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = false;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should wrap to the beginning of the value range if \'wrap\' is true', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} wrap min={-1} max={0} value={0} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = -1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should wrap to the end of the value range if \'wrap\' is true', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} wrap min={0} max={1} value={0} index={0} />
		);

		picker.find(`.${css.decrementer}`).simulate('click');

		const expected = 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should increment by \'step\' value', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} step={3} min={0} max={6} value={0} index={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = 3;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should decrement by \'step\' value', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} step={3} min={0} max={3} value={3} index={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = 0;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should increment by \'step\' value and wrap successfully', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} wrap step={3} min={0} max={3} value={3} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = 0;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should decrement by \'step\' value and wrap successfully', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} wrap step={3} min={0} max={9} value={0} index={0} />
		);

		picker.find(`.${css.decrementer}`).simulate('click');

		const expected = 9;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should enable the increment button when there is a wrapped value to increment', function () {
		const picker = mount(
			<Picker wrap min={0} max={2} value={2} index={0} />
		);

		const expected = false;
		const actual = picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should enable the decrement button when there is a wrapped value to decrement', function () {
		const picker = mount(
			<Picker wrap min={0} max={2} value={2} index={0} />
		);

		const expected = false;
		const actual = picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should disable the increment button when there is no value to increment', function () {
		const picker = mount(
			<Picker min={0} max={2} value={2} index={0} />
		);

		const expected = true;
		const actual = picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should disable the decrement button when there is no value to decrement', function () {
		const picker = mount(
			<Picker min={0} max={2} value={0} index={0} />
		);

		const expected = true;
		const actual = picker.find(`.${css.decrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should disable the increment and decrement buttons when wrapped and there is a single value', function () {
		const picker = mount(
			<Picker wrap min={0} max={0} value={0} index={0} />
		);

		const expected = true;
		const actual = picker.find(`.${css.decrementer}`).prop('disabled') &&
			picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should allow keyboard decrement via left arrow keys when \'joined\' and \'horizontal\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined />
		);

		const expected = -1;
		picker.simulate('keyDown', {keyCode: 37});
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should allow keyboard increment via right arrow keys when \'joined\' and \'horizontal\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined />
		);

		const expected = 1;
		picker.simulate('keyDown', {keyCode: 39});
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should allow keyboard decrement via down arrow keys when \'joined\' and \'vertical\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined orientation="vertical" />
		);

		const expected = -1;
		picker.simulate('keyDown', {keyCode: 40});
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should allow keyboard decrement via up arrow keys when \'joined\' and \'vertical\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined orientation="vertical" />
		);

		const expected = 1;
		picker.simulate('keyDown', {keyCode: 38});
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should not allow keyboard decrement via left arrow keys when \'joined\' and \'vertical\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined orientation="vertical" />
		);

		const expected = false;
		picker.simulate('keyDown', {keyCode: 37});
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should not allow keyboard increment via right arrow keys when \'joined\' and \'vertical\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined orientation="vertical" />
		);

		const expected = false;
		picker.simulate('keyDown', {keyCode: 39});
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should not allow keyboard decrement via down arrow keys when \'joined\' and \'horizontal\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined orientation="horizontal" />
		);

		const expected = false;
		picker.simulate('keyDown', {keyCode: 40});
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should not allow keyboard increment via up arrow keys when \'joined\' and \'horizontal\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<Picker onChange={handleChange} min={-1} max={1} value={0} index={0} joined orientation="horizontal" />
		);

		const expected = false;
		picker.simulate('keyDown', {keyCode: 38});
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	describe('accessibility', function () {

		it('should set the aria-label attribute properly in the next icon button', function () {
			const picker = mount(
				<Picker index={1} value={1} min={0} max={3}>
					<PickerItem>1</PickerItem>
					<PickerItem>2</PickerItem>
					<PickerItem>3</PickerItem>
					<PickerItem>4</PickerItem>
				</Picker>
			);

			const expected = '2 next item';
			const actual = picker.find(`.${css.incrementer}`).prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should set the aria-label attribute properly in the previous icon button', function () {
			const picker = mount(
				<Picker index={1} value={1} min={0} max={3}>
					<PickerItem>1</PickerItem>
					<PickerItem>2</PickerItem>
					<PickerItem>3</PickerItem>
					<PickerItem>4</PickerItem>
				</Picker>
			);

			const expected = '2 previous item';
			const actual = picker.find(`.${css.decrementer}`).prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should set the aria-valuetext attribute properly to read it when changing the value', function () {
			const picker = mount(
				<Picker index={1} value={1} min={0} max={3}>
					<PickerItem>1</PickerItem>
					<PickerItem>2</PickerItem>
					<PickerItem>3</PickerItem>
					<PickerItem>4</PickerItem>
				</Picker>
			);

			const expected = '2';
			const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

			expect(actual).to.equal(expected);
		});

		it('should have aria-hidden=true when \'joined\' and not active', function () {
			const picker = mount(
				<Picker index={1} value={1} min={0} max={3} joined>
					<PickerItem>1</PickerItem>
					<PickerItem>2</PickerItem>
					<PickerItem>3</PickerItem>
					<PickerItem>4</PickerItem>
				</Picker>
			);

			const expected = true;
			const actual = picker.find(`.${css.valueWrapper}`).prop('aria-hidden');

			expect(actual).to.equal(expected);
		});

		it('should be aria-hidden=false when \'joined\' and active', function () {
			const picker = mount(
				<Picker index={1} value={1} min={0} max={3} joined>
					<PickerItem>1</PickerItem>
					<PickerItem>2</PickerItem>
					<PickerItem>3</PickerItem>
					<PickerItem>4</PickerItem>
				</Picker>
			);

			picker.simulate('focus');

			const expected = false;
			const actual = picker.find(`.${css.valueWrapper}`).prop('aria-hidden');

			expect(actual).to.equal(expected);
		});
	});
});
