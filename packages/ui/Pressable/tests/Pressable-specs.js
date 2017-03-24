/* eslint-disable enact/prop-types */
import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';

import Pressable from '../Pressable';

describe('Pressable', () => {
	const DivComponent = () => <div>Toggle</div>;

	describe('#config', function () {
		it('should pass \'pressed\' to the wrapped component', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'pressed' in wrapped.props();

			expect(actual).to.equal(expected);
		});

		it('should pass configured \'prop\' as the pressed state\'s key to the wrapped component', function () {
			const prop = 'data-pressed';
			const Component = Pressable({prop: prop}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = false;
			const actual = wrapped.prop(prop);

			expect(actual).to.equal(expected);
		});

		it('should pass \'onMouseDown\' handler to the wrapped component', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop('onMouseDown') === 'function');

			expect(actual).to.equal(expected);
		});

		it('should pass \'onMouseUp\' handler to the wrapped component', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop('onMouseUp') === 'function');

			expect(actual).to.equal(expected);
		});

		it('should pass \'onMouseLeave\' handler to the wrapped component', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop('onMouseLeave') === 'function');

			expect(actual).to.equal(expected);
		});

		it('should pass configured \'depress\' handler to the wrapped component', function () {
			const handle = 'onClick';
			const Component = Pressable({depress: handle}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop(handle) === 'function');

			expect(actual).to.equal(expected);
		});

		it('should pass configured \'leave\' handler to the wrapped component', function () {
			const handle = 'onClick';
			const Component = Pressable({leave: handle}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop(handle) === 'function');

			expect(actual).to.equal(expected);
		});

		it('should pass configured \'release\' handler to the wrapped component', function () {
			const handle = 'onClick';
			const Component = Pressable({release: handle}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop(handle) === 'function');

			expect(actual).to.equal(expected);
		});
	});

	describe('#prop', function () {
		it('should use defaultPressed prop when pressed prop is omitted', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				<Component defaultPressed />
			);

			const expected = true;
			const actual = subject.find(DivComponent).prop('pressed');

			expect(actual).to.equal(expected);
		});

		it('should use defaultPressed prop when pressed prop is null', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				<Component defaultPressed pressed={null} />
			);

			const expected = true;
			const actual = subject.find(DivComponent).prop('pressed');

			expect(actual).to.equal(expected);
		});

		it('should use defaultPressed prop when pressed prop is undefined', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				// eslint-disable-next-line no-undefined
				<Component defaultPressed pressed={undefined} />
			);

			const expected = true;
			const actual = subject.find(DivComponent).prop('pressed');

			expect(actual).to.equal(expected);
		});

		it('should use pressed prop when both pressed and defaultPressed are defined', function () {
			const Component = Pressable(DivComponent);
			const subject = shallow(
				<Component defaultPressed pressed={false} />
			);

			const expected = false;
			const actual = subject.find(DivComponent).prop('pressed');

			expect(actual).to.equal(expected);
		});
	});

	// test forwarding events

	it('should invoke passed \'onMouseDown\' handler', function () {
		const handleMouseDown = sinon.spy();
		const Component = Pressable(DivComponent);
		const subject = shallow(
			<Component onMouseDown={handleMouseDown} />
		);
		subject.prop('onMouseDown')();

		const expected = true;
		const actual = handleMouseDown.called;

		expect(actual).to.equal(expected);
	});

	it('should invoke passed \'onMouseUp\' handler', function () {
		const handleMouseUp = sinon.spy();
		const Component = Pressable(DivComponent);
		const subject = shallow(
			<Component onMouseUp={handleMouseUp} />
		);
		subject.prop('onMouseUp')();

		const expected = true;
		const actual = handleMouseUp.called;

		expect(actual).to.equal(expected);
	});

	it('should invoke passed \'onMouseLeave\' handler', function () {
		const handleMouseLeave = sinon.spy();
		const Component = Pressable(DivComponent);
		const subject = shallow(
			<Component onMouseLeave={handleMouseLeave} />
		);
		subject.prop('onMouseLeave')();

		const expected = true;
		const actual = handleMouseLeave.called;

		expect(actual).to.equal(expected);
	});

	// test updating state

	it('should update \'pressed\' when \'onMouseUp\' invoked and is not controlled', function () {
		const Component = Pressable(DivComponent);
		const subject = mount(
			<Component defaultPressed />
		);

		subject.find(DivComponent).prop('onMouseUp')();

		const expected = false;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' when \'onMouseUp\' invoked and is not controlled but disabled', function () {
		const Component = Pressable(DivComponent);
		const subject = mount(
			<Component defaultPressed disabled />
		);

		subject.find(DivComponent).prop('onMouseUp')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' when \'onMouseDown\' invoked and is not controlled but disabled', function () {
		const Component = Pressable({activate: 'onMouseDown'}, DivComponent);
		const subject = mount(
			<Component defaultPressed={false} disabled />
		);

		subject.find(DivComponent).prop('onMouseDown')();

		const expected = false;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' when \'onMouseUp\' invoked and is not controlled but disabled', function () {
		const Component = Pressable({deactivate: 'onMouseUp'}, DivComponent);
		const subject = mount(
			<Component defaultPressed disabled />
		);

		subject.find(DivComponent).prop('onMouseUp')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' when \'onMouseUp\' invoked and is controlled', function () {
		const Component = Pressable(DivComponent);
		const subject = mount(
			<Component pressed />
		);

		subject.find(DivComponent).prop('onMouseUp')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' when \'onMouseDown\' invoked and is controlled', function () {
		const Component = Pressable({activate: 'onMouseDown'}, DivComponent);
		const subject = mount(
			<Component pressed={false} />
		);

		subject.find(DivComponent).prop('onMouseDown')();

		const expected = false;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' when \'onMouseUp\' invoked and is controlled', function () {
		const Component = Pressable({deactivate: 'onMouseUp'}, DivComponent);
		const subject = mount(
			<Component pressed />
		);

		subject.find(DivComponent).prop('onMouseUp')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should update \'pressed\' with new props when controlled', function () {
		const Component = Pressable(DivComponent);
		const subject = mount(
			<Component pressed />
		);

		subject.setProps({pressed: false});

		const expected = false;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' with new props when not controlled', function () {
		const Component = Pressable(DivComponent);
		const subject = mount(
			<Component defaultPressed />
		);

		subject.setProps({pressed: false});

		const expected = true;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should not update \'pressed\' with new defaultProp when not controlled', function () {
		const Component = Pressable(DivComponent);
		const subject = mount(
			<Component defaultPressed />
		);

		subject.setProps({defaultPressed: false});

		const expected = true;
		const actual = subject.find(DivComponent).prop('pressed');

		expect(actual).to.equal(expected);
	});
});
