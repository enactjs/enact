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
				<div style={{width: '2000px'}}>
					Foo<br />Bar<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />
					Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. <br />Foo<br />Bar<br />Bar<br />
					Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />
					Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. <br />Foo<br />Bar<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />
					Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />
					Foo<br />Bar<br />Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. <br />Foo<br />Bar<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />
					Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow<br />Foo<br />Bar<br />Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
					Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow.
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
