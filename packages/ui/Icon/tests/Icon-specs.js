import React from 'react';
import {shallow} from 'enzyme';
import Icon from '../Icon';

describe('Icon Specs', () => {
	it('should merge author styles with src', function () {
		const src = 'images/icon.png';
		const icon = shallow(
			<Icon style={{color: 'green'}}>
				{src}
			</Icon>
		);

		const expected = {
			color: 'green',
			backgroundImage: `url(${src})`
		};
		const actual = icon.prop('style');
		expect(actual).to.deep.equal(expected);
	});
});

