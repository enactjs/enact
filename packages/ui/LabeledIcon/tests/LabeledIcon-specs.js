import React from 'react';
import {mount} from 'enzyme';
import LabeledIcon from '../LabeledIcon';
import CustomIcon from '../../Icon';
import css from '../LabeledIcon.less';

const iconName = 'anIconName';
const iconLabel = 'A real label';

describe('LabeledIcon Specs', () => {
	it('should insert the icon source into the icon slot element', function () {

		const labeledIcon = mount(
			<LabeledIcon>
				<icon>{iconName}</icon>
				{iconLabel}
			</LabeledIcon>
		);

		const expected = iconName;
		const actual = labeledIcon.find(`.${css.icon}`).first().text();

		expect(actual).to.equal(expected);
	});

	it('should insert custom icon components into the icon slot', function () {
		const labeledIcon = mount(
			<LabeledIcon>
				<icon><CustomIcon>{iconName}</CustomIcon></icon>
				{iconLabel}
			</LabeledIcon>
		);

		const expected = true;
		const actual = labeledIcon.find(CustomIcon);

		expect(actual).to.have.length(expected);
	});
});

