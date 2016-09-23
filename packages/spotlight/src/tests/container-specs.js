import React from 'react';
import {shallow, mount} from 'enzyme';
import Spotlight from '../spotlight';
import {SpotlightContainerDecorator} from '../container';

describe('Container Specs', () => {

	it('Should pass the containerId value \'container-1\' to Wrapped', function () {
		Spotlight.initialize();

		const DivComponent = () => <div>container</div>;

		const ContainerDiv = SpotlightContainerDecorator(DivComponent);
		const wrapped = shallow(<ContainerDiv />);

		const expected = 'container-1';
		const actual = wrapped.find('DivComponent').prop('containerId');

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});

	it('Should pass the className value \'container-1\' to Wrapped', function () {
		Spotlight.initialize();

		const DivComponent = () => <div>container</div>;

		const ContainerDiv = SpotlightContainerDecorator(DivComponent);
		const wrapped = shallow(<ContainerDiv />);

		const expected = 'container-1';
		const actual = wrapped.find('DivComponent').prop('className');

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});
});
