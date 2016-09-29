import React from 'react';
import {mount} from 'enzyme';
import IconButton from '../IconButton';

describe('IconButton Specs', () => {

	it('should apply same \'small\' prop to both <Icon> and <Button> children', function() {
		const iconButton = mount(
			<IconButton small>star</IconButton>
		);
		const icon = iconButton.find('Icon');
		const button = iconButton.find('Button');
		const expected = true;
		const actual = (icon.prop('small') === button.prop('small'));

		expect(actual).to.equal(expected);
	});

	it('should always maintain minWidth=false for its <Button> child', function() {
		const iconButton = mount(
			<IconButton minWidth={true}>star</IconButton>
		);
		const button = iconButton.find('Button');
		const expected = false;
		const actual = (button.prop('minWidth'));

		expect(actual).to.equal(expected);
	});
});

