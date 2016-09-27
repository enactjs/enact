import React from 'react';
import {mount} from 'enzyme';
import {Spotlight, spotlightRootContainerName} from '../spotlight';
import SpotlightRootDecorator from '../root';

describe('SpotlightRootDecorator Specs', () => {

	it('Should return \'undefined\' when spotlightRootContainerName exists', function () {
		const DivComponent = () => <div>component</div>;
		const SpotlightApp = SpotlightRootDecorator(DivComponent);

		const wrapped = mount(<SpotlightApp />);

		const expected = undefined;
		const actual = Spotlight.set(spotlightRootContainerName, {});

		expect(actual).to.equal(expected);
	});
});
