/* eslint-disable enact/prop-types */
import React from 'react';
import {mount, shallow} from 'enzyme';
import Toggleable from '../Toggleable';

describe('Toggleable', () => {
	const DivComponent = () => <div>Toggle</div>;

	describe('#config', () => {
		test('should pass \'selected\' to the wrapped component', () => {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = 'selected';
			const actual = wrapped.props();

			expect(actual).toHaveProperty(expected);
		});

		test(
			'should pass configured \'prop\' \'banana\' as the toggled state\'s key to the wrapped component',
			() => {
				const prop = 'banana';
				const Component = Toggleable({prop: prop}, DivComponent);
				const subject = shallow(
					<Component defaultSelected />
				);
				const wrapped = subject.find(DivComponent);

				const expected = prop;
				const actual = wrapped.props();

				expect(actual).toHaveProperty(expected);
			}
		);

		test('should pass \'onToggle\' handler to the wrapped component', () => {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = 'function';
			const actual = (typeof wrapped.prop('onToggle'));

			expect(actual).toBe(expected);
		});

		test(
			'should pass configured \'toggle\' handler to the wrapped component',
			() => {
				const handle = 'onClick';
				const Component = Toggleable({toggle: handle}, DivComponent);
				const subject = shallow(
					<Component />
				);
				const wrapped = subject.find(DivComponent);

				const expected = 'function';
				const actual = (typeof wrapped.prop(handle));

				expect(actual).toBe(expected);
			}
		);
	});

	describe('#prop', () => {
		test(
			'should use defaultSelected prop when selected prop is omitted',
			() => {
				const Component = Toggleable(DivComponent);
				const subject = shallow(
					<Component defaultSelected />
				);

				const expected = 'selected';
				const actual = subject.find(DivComponent).props();

				expect(actual).toHaveProperty(expected, true);
			}
		);

		test('should use defaultSelected prop when selected prop is null', () => {
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component defaultSelected selected={null} />
			);

			const expected = 'selected';
			const actual = subject.find(DivComponent).props();

			expect(actual).toHaveProperty(expected, true);
		});

		test(
			'should use selected prop when selected changed from truthy to null',
			() => {
				const Component = Toggleable(DivComponent);
				const subject = shallow(
					<Component defaultSelected selected />
				);

				subject.setProps({selected: null});


				const expected = 'selected';
				const actual = subject.find(DivComponent).props();

				expect(actual).toHaveProperty(expected, false);
			}
		);

		test(
			'should use defaultSelected prop when selected prop is undefined',
			() => {
				const Component = Toggleable(DivComponent);
				const subject = shallow(
					// eslint-disable-next-line no-undefined
					<Component defaultSelected selected={undefined} />
				);

				const expected = 'selected';
				const actual = subject.find(DivComponent).props();

				expect(actual).toHaveProperty(expected, true);
			}
		);

		test(
			'should use selected prop when selected changed from truthy to undefined',
			() => {
				const Component = Toggleable(DivComponent);
				const subject = shallow(
					<Component defaultSelected selected />
				);
				// eslint-disable-next-line no-undefined
				subject.setProps({selected: undefined});

				const expected = 'selected';
				const actual = subject.find(DivComponent).props();

				expect(actual).toHaveProperty(expected, false);
			}
		);

		test(
			'should use selected prop when both selected and defaultSelected are defined',
			() => {
				const Component = Toggleable(DivComponent);
				const subject = shallow(
					<Component defaultSelected selected={false} />
				);

				const expected = 'selected';
				const actual = subject.find(DivComponent).props();

				expect(actual).toHaveProperty(expected, false);
			}
		);
	});

	// test forwarding events

	test('should invoke passed \'onToggle\' handler', () => {
		const handleToggle = jest.fn();
		const Component = Toggleable(DivComponent);
		const subject = shallow(
			<Component onToggle={handleToggle} />
		);
		subject.simulate('toggle');

		const expected = 1;
		const actual = handleToggle.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should invoke passed \'onActivate\' handler', () => {
		const handleActivate = jest.fn();
		const Component = Toggleable({activate: 'onActivate'}, DivComponent);
		const subject = shallow(
			<Component onActivate={handleActivate} />
		);
		subject.simulate('activate');

		const expected = 1;
		const actual = handleActivate.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should invoke passed \'onDeactivate\' handler', () => {
		const handleDeactivate = jest.fn();
		const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
		const subject = shallow(
			<Component onDeactivate={handleDeactivate} />
		);
		subject.simulate('deactivate');

		const expected = 1;
		const actual = handleDeactivate.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test(
		'should not invoke passed \'onToggle\' handler when disabled',
		() => {
			const handleToggle = jest.fn();
			const Component = Toggleable(DivComponent);
			const subject = shallow(
				<Component onToggle={handleToggle} disabled />
			);
			subject.simulate('toggle');

			const expected = 0;
			const actual = handleToggle.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not invoke passed \'onActivate\' handler when disabled',
		() => {
			const handleActivate = jest.fn();
			const Component = Toggleable({activate: 'onActivate'}, DivComponent);
			const subject = shallow(
				<Component onActivate={handleActivate} disabled />
			);
			subject.simulate('activate');

			const expected = 0;
			const actual = handleActivate.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not invoke passed \'onDeactivate\' handler when \'disabled\'',
		() => {
			const handleDeactivate = jest.fn();
			const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
			const subject = shallow(
				<Component onDeactivate={handleDeactivate} disabled />
			);
			subject.simulate('deactivate');

			const expected = 0;
			const actual = handleDeactivate.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	// test updating state

	test(
		'should update \'selected\' when \'onToggle\' invoked and is not controlled',
		() => {
			const Component = Toggleable(DivComponent);
			const subject = mount(
				<Component defaultSelected />
			);

			subject.find(DivComponent).prop('onToggle')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, false);
		}
	);

	test(
		'should update \'selected\' when \'onJiggle\' invoked and is not controlled',
		() => {
			const Component = Toggleable({toggleProp: 'onJiggle'}, DivComponent);
			const subject = mount(
				<Component defaultSelected />
			);

			subject.find(DivComponent).prop('onJiggle')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, false);
		}
	);

	test(
		'should not update \'selected\' when \'onToggle\' invoked and is not controlled but disabled',
		() => {
			const Component = Toggleable(DivComponent);
			const subject = mount(
				<Component defaultSelected disabled />
			);

			subject.find(DivComponent).prop('onToggle')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, true);
		}
	);

	test(
		'should not update \'selected\' when \'onActivate\' invoked and is not controlled but disabled',
		() => {
			const Component = Toggleable({activate: 'onActivate'}, DivComponent);
			const subject = mount(
				<Component defaultSelected={false} disabled />
			);

			subject.find(DivComponent).prop('onActivate')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, false);
		}
	);

	test(
		'should not update \'selected\' when \'onDeactivate\' invoked and is not controlled but disabled',
		() => {
			const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
			const subject = mount(
				<Component defaultSelected disabled />
			);

			subject.find(DivComponent).prop('onDeactivate')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, true);
		}
	);

	test(
		'should not update \'selected\' when \'onToggle\' invoked and is controlled',
		() => {
			const Component = Toggleable(DivComponent);
			const subject = mount(
				<Component selected />
			);

			subject.find(DivComponent).prop('onToggle')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, true);
		}
	);

	test(
		'should not update \'selected\' when \'onJiggle\' invoked and is controlled',
		() => {
			const Component = Toggleable({toggleProp: 'onJiggle'}, DivComponent);
			const subject = mount(
				<Component selected />
			);

			subject.find(DivComponent).prop('onJiggle')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, true);
		}
	);

	test(
		'should not update \'selected\' when \'onActivate\' invoked and is controlled',
		() => {
			const Component = Toggleable({activate: 'onActivate'}, DivComponent);
			const subject = mount(
				<Component selected={false} />
			);

			subject.find(DivComponent).prop('onActivate')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected, false);
		}
	);

	test(
		'should not update \'selected\' when \'onDeactivate\' invoked and is controlled',
		() => {
			const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
			const subject = mount(
				<Component selected />
			);

			subject.find(DivComponent).prop('onDeactivate')();
			subject.update();

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected);
		}
	);

	test('should update \'selected\' with new props when controlled', () => {
		const Component = Toggleable(DivComponent);
		const subject = mount(
			<Component selected />
		);

		subject.setProps({selected: false});

		const expected = 'selected';
		const actual = subject.find(DivComponent).getElement().props;

		expect(actual).toHaveProperty(expected);
	});

	test.skip(
		'should not update \'selected\' with new props when not controlled',
		function () {
			const Component = Toggleable(DivComponent);
			const subject = mount(
				<Component defaultSelected />
			);

			subject.setProps({selected: false});

			const expected = 'selected';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected);
		}
	);

	test(
		'should not update \'selected\' with custom prop and new defaultProp when not controlled',
		() => {
			const Component = Toggleable({prop: 'active'}, DivComponent);
			const subject = mount(
				<Component defaultSelected />
			);

			subject.setProps({defaultSelected: false});

			const expected = 'active';
			const actual = subject.find(DivComponent).getElement().props;

			expect(actual).toHaveProperty(expected);
		}
	);

});
