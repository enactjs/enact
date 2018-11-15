/* eslint-disable enact/prop-types */
import React from 'react';
import {mount, shallow} from 'enzyme';
import sinon from 'sinon';
import Toggleable from '../Toggleable';

describe('Toggleable', () => {
	const DivComponent = () => <div>Toggle</div>;

	describe('#config', function () {
		it('should pass \'selected\' to the wrapped component', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = 'selected';
			const actual = wrapped.props();

			expect(actual).to.have.property(expected);
		});

		it('should pass configured \'prop\' \'banana\' as the toggled state\'s key to the wrapped component', function () {
			const prop = 'banana';
			const Component = Toggleable({prop: prop}, DivComponent);
			const subject = shallow(
				<Component defaultSelected />
			);
			const wrapped = subject.find(DivComponent);

			const expected = prop;
			const actual = wrapped.props();

			expect(actual).to.have.property(expected);
		});

		it('should pass \'onToggle\' handler to the wrapped component', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = 'function';
			const actual = (typeof wrapped.prop('onToggle'));

			expect(actual).to.equal(expected);
		});

		it('should pass configured \'toggle\' handler to the wrapped component', function () {
			const handle = 'onClick';
			const Component = Toggleable({toggle: handle}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = 'function';
			const actual = (typeof wrapped.prop(handle));

			expect(actual).to.equal(expected);
		});
	});

	describe('#prop', function () {
		it('should use defaultActive prop when selected prop is omitted', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component defaultActive />
			);

			const expected = 'selected';
			const actual = subject.find(DivComponent).props();

			expect(actual).to.have.property(expected);
		});

		it('should use defaultActive prop when selected prop is null', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component defaultActive selected={null} />
			);

			const expected = 'selected';
			const actual = subject.find(DivComponent).props();

			expect(actual).to.have.property(expected);
		});

		it('should use defaultActive prop when selected prop is undefined', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				// eslint-disable-next-line no-undefined
				<Component defaultActive selected={undefined} />
			);

			const expected = 'selected';
			const actual = subject.find(DivComponent).props();

			expect(actual).to.have.property(expected);
		});

		it('should use selected prop when both selected and defaultActive are defined', function () {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component defaultActive selected={false} />
			);

			const expected = 'selected';
			const actual = subject.find(DivComponent).props();

			expect(actual).to.have.property(expected);
		});
	});

	// test forwarding events

	it('should invoke passed \'onToggle\' handler', function () {
		const handleToggle = sinon.spy();
		const Component = Toggleable(DivComponent);
		const subject = shallow(
			<Component onToggle={handleToggle} />
		);
		subject.simulate('toggle');

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
		subject.simulate('activate');

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
		subject.simulate('deactivate');

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
		subject.simulate('toggle');

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
		subject.simulate('activate');

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
		subject.simulate('deactivate');

		const expected = false;
		const actual = handleDeactivate.called;

		expect(actual).to.equal(expected);
	});

	// test updating state

	it('should update \'selected\' when \'onToggle\' invoked and is not controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component defaultActive />
		);

		subject.find(DivComponent).prop('onToggle')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, true);
	});

	it('should update \'selected\' when \'onJiggle\' invoked and is not controlled', function () {
		const Component = Toggleable({toggleProp: 'onJiggle'}, DivComponent);
		const subject = mount(
			<Component defaultActive />
		);

		subject.find(DivComponent).prop('onJiggle')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, true);
	});

	it('should not update \'selected\' when \'onToggle\' invoked and is not controlled but disabled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component defaultActive disabled />
		);

		subject.find(DivComponent).prop('onToggle')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, false);
	});

	it('should not update \'selected\' when \'onActivate\' invoked and is not controlled but disabled', function () {
		const Component = Toggleable({activate: 'onActivate'}, DivComponent);
		const subject = mount(
			<Component defaultActive={false} disabled />
		);

		subject.find(DivComponent).prop('onActivate')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, false);
	});

	it('should not update \'selected\' when \'onDeactivate\' invoked and is not controlled but disabled', function () {
		const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
		const subject = mount(
			<Component defaultActive disabled />
		);

		subject.find(DivComponent).prop('onDeactivate')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, false);
	});

	it('should not update \'selected\' when \'onToggle\' invoked and is controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component selected />
		);

		subject.find(DivComponent).prop('onToggle')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, true);
	});

	it('should not update \'selected\' when \'onJiggle\' invoked and is controlled', function () {
		const Component = Toggleable({toggleProp: 'onJiggle'}, DivComponent);
		const subject = mount(
			<Component selected />
		);

		subject.find(DivComponent).prop('onJiggle')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, true);
	});

	it('should not update \'selected\' when \'onActivate\' invoked and is controlled', function () {
		const Component = Toggleable({activate: 'onActivate'}, DivComponent);
		const subject = mount(
			<Component selected={false} />
		);

		subject.find(DivComponent).prop('onActivate')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected, false);
	});

	it('should not update \'selected\' when \'onDeactivate\' invoked and is controlled', function () {
		const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
		const subject = mount(
			<Component selected />
		);

		subject.find(DivComponent).prop('onDeactivate')();
		subject.update();

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected);
	});

	it('should update \'selected\' with new props when controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component selected />
		);

		subject.setProps({selected: false});

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected);
	});

	it.skip('should not update \'selected\' with new props when not controlled', function () {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component defaultActive />
		);

		subject.setProps({selected: false});

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected);
	});

	it('should not update \'selected\' with custom prop and new defaultProp when not controlled', function () {
		const Component = Toggleable({prop: 'active'}, DivComponent);
		const subject = mount(
			<Component defaultActive />
		);

		subject.setProps({defaultActive: false});

		const expected = 'active';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).to.have.property(expected);
	});

	it('should set \'toggleOffAriaLabel\' to the wrapped component', function () {
		const label = 'custom toggle off aria-label';
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component toggleOffAriaLabel={label} />
		);

		const expected = label;
		const actual = subject.find(DivComponent).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should set \'toggleOnAriaLabel\' to the wrapped component', function () {
		const label = 'custom toggle on aria-label';
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component selected toggleOnAriaLabel={label} />
		);

		const expected = label;
		const actual = subject.find(DivComponent).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

});
