import React from 'react';
import {mount} from 'enzyme';
import {RadioControllerDecorator, RadioDecorator} from '../RadioDecorator';

describe('RadioDecorator', () => {

	// eslint-disable-next-line enact/prop-types
	const Item = ({active}) => (
		<span>
			{active ? 'Active' : 'Inactive'}
		</span>
	);

	const Controller = RadioControllerDecorator('main');

	test(
		'should be deactivated when the activated event fires on another instance',
		() => {
			const handleClick = jest.fn();
			const Component = RadioDecorator({deactivate: 'onDeactivate', activate: 'onActivate', prop: 'active'}, Item);
			const subject = mount(
				<Controller>
					<Component active onDeactivate={handleClick} />
					<Component />
				</Controller>
			);

			subject.find(Item).at(1).invoke('onActivate')();

			expect(handleClick).toHaveBeenCalled();
		}
	);

	test('should not deactivate items in a ancestor controller', () => {
		const handleParent = jest.fn();
		const handleChild = jest.fn();
		const Component = RadioDecorator({activate: 'onActivate', deactivate: 'onDeactivate', prop: 'active'}, Item);
		const subject = mount(
			<Controller>
				<Component active onDeactivate={handleParent} />
				<Component />
				<Controller>
					<Component active onDeactivate={handleChild} />
					<Component />
				</Controller>
			</Controller>
		);

		const childController = subject.find('RadioControllerDecorator').at(1);
		childController.find(Item).at(1).invoke('onActivate')();

		expect(handleParent).not.toHaveBeenCalled();
		expect(handleChild).toHaveBeenCalled();
	});

	test('should not call deactivate callback on inactive items', () => {
		const handleDeactivate = jest.fn();
		const Component = RadioDecorator({activate: 'onActivate', deactivate: 'onDeactivate', prop: 'active'}, Item);

		// deactivate() is only called when there was a previously active item
		const Wrapper = ({active}) => (	// eslint-disable-line enact/prop-types
			<Controller>
				<Component active={!active} />
				<Component active={active} onDeactivate={handleDeactivate} />
				<Component onDeactivate={handleDeactivate} />
			</Controller>
		);

		// create a controller with no active item
		const subject = mount(
			<Wrapper />
		);

		// activate the second item via prop change
		subject.setProps({
			active: true
		});

		// Only called once (for the active 2nd item) but not for the already inactive 3rd item
		expect(handleDeactivate).not.toHaveBeenCalledTimes(1);
	});
});
