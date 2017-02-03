import {mount} from 'enzyme';
import React from 'react';

import Scroller from '../Scroller';

describe('Scroller Specs', () => {
	describe('Set and change props Specs', () => {
		const subject = mount(
			<Scroller
				horizontal={'scroll'}
				vertical={'scroll'}
			>
				<div style={{height: '1000px', width: '2000px'}}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
					Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.
					<div style={{marginTop: '800px'}}>
						Mauris blandit sollicitudin mattis. Fusce commodo arcu vitae risus consectetur sollicitudin. Aliquam eget posuere orci. Cras pellentesque lobortis sapien non lacinia.
					</div>
				</div>
			</Scroller>
		);

		describe('Set props Specs', () => {
			it('should have the prop \'horizontal\' of \'scroll\'', function () {
				const expected = 'scroll';
				const actual = subject.find('ScrollerBase').prop('horizontal');

				expect(actual).to.equal(expected);
			});

			it('should have the prop \'vertical\' of \'scroll\'', function () {
				const expected = 'scroll';
				const actual = subject.find('ScrollerBase').prop('vertical');

				expect(actual).to.equal(expected);
			});
		});

		describe('Change props Specs', () => {
			it('should change value of the prop \'horizontal\' to \'hidden\'', function () {
				subject.setProps({horizontal: 'hidden'});

				const expected = 'hidden';
				const actual = subject.find('ScrollerBase').prop('horizontal');

				expect(actual).to.equal(expected);
			});

			it('should change value of the prop \'vertical\' to \'hidden\'', function () {
				subject.setProps({vertical: 'hidden'});

				const expected = 'hidden';
				const actual = subject.find('ScrollerBase').prop('vertical');

				expect(actual).to.equal(expected);
			});
		});
	});
});
