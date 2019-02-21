import React from 'react';
import {mount} from 'enzyme';
import LabeledIcon from '../LabeledIcon';
import CustomIcon from '../../Icon';
import css from '../LabeledIcon.module.less';

const iconName = 'anIconName';
const iconLabel = 'A real label';
const iconComponent = ({children}) => <div>{children}</div>;

describe('LabeledIcon Specs', () => {
	test(
		'should insert the icon source into the icon when using the prop approach',
		() => {

			const labeledIcon = mount(
				<LabeledIcon icon={iconName} iconComponent={iconComponent}>
					{iconLabel}
				</LabeledIcon>
			);

			const expected = iconName;
			const actual = labeledIcon.find(`.${css.icon}`).first().text();

			expect(actual).toBe(expected);
		}
	);

	test('should insert the icon source into the icon slot element', () => {

		const labeledIcon = mount(
			<LabeledIcon iconComponent={iconComponent}>
				<icon>{iconName}</icon>
				{iconLabel}
			</LabeledIcon>
		);

		const expected = iconName;
		const actual = labeledIcon.find(`.${css.icon}`).first().text();

		expect(actual).toBe(expected);
	});

	test('should insert custom icon components into the icon slot', () => {
		const labeledIcon = mount(
			<LabeledIcon iconComponent={iconComponent}>
				<icon><CustomIcon>{iconName}</CustomIcon></icon>
				{iconLabel}
			</LabeledIcon>
		);

		const expected = 1;
		const actual = labeledIcon.find(CustomIcon);

		expect(actual).toHaveLength(expected);
	});
});

