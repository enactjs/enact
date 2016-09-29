import React from 'react';
import Spotlight from '../spotlight';

describe('Spotlight Specs', () => {

	it('Should reset the global spotlight variables', function () {
		Spotlight.initialize();

		const expected = 'container-1';
		const actualBefore = Spotlight.add({});

		Spotlight.terminate();
		Spotlight.initialize();

		const actualAfter = Spotlight.add({});

		expect(actualBefore).to.equal(actualAfter).and.to.equal(expected);
		Spotlight.terminate();
	});

	it('Should add and remove the specified container', function () {
		Spotlight.initialize();

		const containerId = Spotlight.add({});
		
		const expected = true;
		const actual = Spotlight.remove(containerId);

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});

	it('Should disable the selector rules of the specified container', function () {
		Spotlight.initialize();

		const containerId = Spotlight.add({});
		
		const expected = true;
		const actual = Spotlight.disableSelector(containerId);

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});

	it('Should enable the selector rules of the specified container', function () {
		Spotlight.initialize();

		const containerId = Spotlight.add({selectorDisabled: true});
		
		const expected = true;
		const actual = Spotlight.enableSelector(containerId);

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});

	it('Should disable the specified container', function () {
		Spotlight.initialize();

		const containerId = Spotlight.add({});
		
		const expected = true;
		const actual = Spotlight.disable(containerId);

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});

	it('Should enable the specified container', function () {
		Spotlight.initialize();

		const containerId = Spotlight.add({disabled: true});
		
		const expected = true;
		const actual = Spotlight.enable(containerId);

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});
});
