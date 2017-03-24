/* eslint-disable enact/prop-types */
import React from 'react';
import {mount, shallow} from 'enzyme';
import sinon from 'sinon';
import Toggleable from '../Toggleable';

describe('Toggleable', () => {
	const DivComponent = () => <div>Toggle</div>;

	describe('#config', function () {
		it('should pass \'active\' to the wrapped component', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'active' in wrapped.props();

			expect(actual).to.equal(expected);
		});

		it('should pass configured \'prop\' as the toggled state\'s key to the wrapped component', function () {
			const prop = 'selected';
			const Component = Toggleable({prop: prop}, DivComponent);
			const subject = shallow(
				<Component defaultSelected />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = wrapped.prop(prop);

			expect(actual).to.equal(expected);
		});

		it('should pass \'onToggle\' handler to the wrapped component', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop('onToggle') === 'function');

			expect(actual).to.equal(expected);
		});

		it('should pass configured \'toggle\' handler to the wrapped component', function () {
			const handle = 'onClick';
			const Component = Toggleable({toggle: handle}, DivComponent);
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
		it('should use defaultActive prop when active prop is omitted', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component defaultActive />
			);

			const expected = true;
			const actual = subject.find(DivComponent).prop('active');

			expect(actual).to.equal(expected);
		});

		it('should use defaultActive prop when active prop is null', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component defaultActive active={null} />
			);

			const expected = true;
			const actual = subject.find(DivComponent).prop('active');

			expect(actual).to.equal(expected);
		});

		it('should use defaultActive prop when active prop is undefined', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				// eslint-disable-next-line no-undefined
				<Component defaultActive active={undefined} />
			);

			const expected = true;
			const actual = subject.find(DivComponent).prop('active');

			expect(actual).to.equal(expected);
		});

		it('should use active prop when both active and defaultActive are defined', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component defaultActive active={false} />
			);

			const expected = false;
			const actual = subject.find(DivComponent).prop('active');

			expect(actual).to.equal(expected);
		});
	});

	// test forwarding events

	it('should invoke passed \'onToggle\' handler', function () {
		const handleToggle = sinon.spy();
		const Component = Toggleable(DivComponent);
		const subject = shallow(
			<Component onToggle={handleToggle} />
		);
		subject.prop('onToggle')();

		const expected = true;
		const actual = handleToggle.called;

		expect(actual).to.equal(expected);
	});

	it('should invoke passed \'onActivate\' handler', function () {
		const handleActivate = sinon.spy();
		const Component = Toggleable({activate: 'onActivate'}, DivComponent);
		const subject = shallow(
			<Component onActivate={handleActivate} />
		);
		subject.prop('onActivate')();

		const expected = true;
		const actual = handleActivate.called;

		expect(actual).to.equal(expected);
	});

	it('should invoke passed \'onDeactivate\' handler', function () {
		const handleDeactivate = sinon.spy();
		const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
		const subject = shallow(
			<Component onDeactivate={handleDeactivate} />
		);
		subject.prop('onDeactivate')();

		const expected = true;
		const actual = handleDeactivate.called;

		expect(actual).to.equal(expected);
	});

	it('should not invoke passed \'onToggle\' handler when disabled', function () {
		const handleToggle = sinon.spy();
		const Component = Toggleable(DivComponent);
		const subject = shallow(
			<Component onToggle={handleToggle} disabled />
		);
		subject.prop('onToggle')();

		const expected = false;
		const actual = handleToggle.called;

		expect(actual).to.equal(expected);
	});

	it('should not invoke passed \'onActivate\' handler when disabled', function () {
		const handleActivate = sinon.spy();
		const Component = Toggleable({activate: 'onActivate'}, DivComponent);
		const subject = shallow(
			<Component onActivate={handleActivate} disabled />
		);
		subject.prop('onActivate')();

		const expected = false;
		const actual = handleActivate.called;

		expect(actual).to.equal(expected);
	});

	it('should not invoke passed \'onDeactivate\' handler when \'disabled\'', function () {
		const handleDeactivate = sinon.spy();
		const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
		const subject = shallow(
			<Component onDeactivate={handleDeactivate} disabled />
		);
		subject.prop('onDeactivate')();

		const expected = false;
		const actual = handleDeactivate.called;

		expect(actual).to.equal(expected);
	});

	// test updating state

	it('should update \'active\' when \'onToggle\' invoked and is not controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component defaultActive />
		);

		subject.find(DivComponent).prop('onToggle')();

		const expected = false;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' when \'onToggle\' invoked and is not controlled but disabled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component defaultActive disabled />
		);

		subject.find(DivComponent).prop('onToggle')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' when \'onActivate\' invoked and is not controlled but disabled', function () {
		const Component = Toggleable({activate: 'onActivate'}, DivComponent);
		const subject = mount(
			<Component defaultActive={false} disabled />
		);

		subject.find(DivComponent).prop('onActivate')();

		const expected = false;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' when \'onDeactivate\' invoked and is not controlled but disabled', function () {
		const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
		const subject = mount(
			<Component defaultActive disabled />
		);

		subject.find(DivComponent).prop('onDeactivate')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' when \'onToggle\' invoked and is controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component active />
		);

		subject.find(DivComponent).prop('onToggle')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' when \'onActivate\' invoked and is controlled', function () {
		const Component = Toggleable({activate: 'onActivate'}, DivComponent);
		const subject = mount(
			<Component active={false} />
		);

		subject.find(DivComponent).prop('onActivate')();

		const expected = false;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' when \'onDeactivate\' invoked and is controlled', function () {
		const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
		const subject = mount(
			<Component active />
		);

		subject.find(DivComponent).prop('onDeactivate')();

		const expected = true;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should update \'active\' with new props when controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component active />
		);

		subject.setProps({active: false});

		const expected = false;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' with new props when not controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component defaultActive />
		);

		subject.setProps({active: false});

		const expected = true;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not update \'active\' with new defaultProp when not controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component defaultActive />
		);

		subject.setProps({defaultActive: false});

		const expected = true;
		const actual = subject.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

});
