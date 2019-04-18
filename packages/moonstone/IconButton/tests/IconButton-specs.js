import React from 'react';
import {mount} from 'enzyme';
import IconButton from '../IconButton';

describe('IconButton Specs', () => {

	test(
		'should apply same \'size\' prop to both <Icon> and <Button> children',
		() => {
			const iconButton = mount(
				<IconButton size="small">star</IconButton>
			);
			const icon = iconButton.find('Icon');
			const button = iconButton.find('Button');
			const expected = true;
			const actual = (icon.prop('size') === button.prop('size'));

			expect(actual).toBe(expected);
		}
	);

	test(
		'should always maintain minWidth=false for its <Button> child',
		() => {
			const iconButton = mount(
				<IconButton minWidth>star</IconButton>
			);
			const button = iconButton.find('Button');
			const expected = false;
			const actual = (button.prop('minWidth'));

			expect(actual).toBe(expected);
		}
	);
});
