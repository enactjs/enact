import React from 'react';
import {mount, shallow} from 'enzyme';
import {MediaControls, MediaControlsBase, MediaControlsDecorator} from '../MediaControls';

const callCount = spy => {
	switch (spy.mock.calls.length) {
		case 0:
			return 'not called';
		case 1:
			return 'called once';
		default:
			return `called ${spy.mock.calls.length} times`;
	}
};

describe('MediaControls', () => {
	test(
		'should have api\'s that are bounded to `MediaControlsDecorator`',
		() => {
			const mediaControls = mount(
				<MediaControls showMoreComponents>
					More children
				</MediaControls>
			);

			const instance = mediaControls.instance();

			const expected = false;
			const actual = instance.showMoreComponents() && instance.hideMoreComponents();

			expect(actual).toBe(expected);
		}
	);
});
