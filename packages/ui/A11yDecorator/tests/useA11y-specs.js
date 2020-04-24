/* eslint-disable react/jsx-no-bind */

import {shallow} from 'enzyme';
import React from 'react';

import useA11y from '../useA11y';

describe('useA11y', () => {

	// eslint-disable-next-line enact/prop-types
	function Component ({accessibilityPreHint, accessibilityHint, 'aria-label': ariaLabel, children: content}) {
		const a11y = useA11y({
			accessibilityPreHint,
			accessibilityHint,
			'aria-label': ariaLabel,
			content
		});

		return <div {...a11y} />;
	}

	test('should return null by default', () => {
		const subject = shallow(<Component />);

		const expected = null;
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should use the aria-label when set', () => {
		const subject = shallow(
			<Component aria-label="LABEL">
				CONTENT
			</Component>
		);

		const expected = 'LABEL';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should use the accessibilityPreHint when set', () => {
		const subject = shallow(
			<Component accessibilityPreHint="PREHINT">
				CONTENT
			</Component>
		);

		const expected = 'PREHINT CONTENT';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should use the accessibilityHint when set', () => {
		const subject = shallow(
			<Component accessibilityHint="HINT">
				CONTENT
			</Component>
		);

		const expected = 'CONTENT HINT';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test(
		'should use the accessibilityPreHint, accessibilityHint when set',
		() => {
			const subject = shallow(
				<Component accessibilityPreHint="PREHINT" accessibilityHint="HINT">
                    CONTENT
				</Component>
			);

			const expected = 'PREHINT CONTENT HINT';
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test('should use the accessibilityPreHint and content when set', () => {
		const subject = shallow(
			<Component accessibilityPreHint="PREHINT">
				CONTENT
			</Component>
		);

		const expected = 'PREHINT CONTENT';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should use the accessibilityHint and content when set', () => {
		const subject = shallow(
			<Component accessibilityHint="HINT">
				CONTENT
			</Component>
		);

		const expected = 'CONTENT HINT';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should use the accessibilityPreHint, accessibilityHint, and content when set', () => {
		const subject = shallow(
			<Component accessibilityPreHint="PREHINT" accessibilityHint="HINT">
				CONTENT
			</Component>
		);

		const expected = 'PREHINT CONTENT HINT';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test(
		'should use only the aria-label when set and ignore accessibilityHint',
		() => {
			const subject = shallow(
				<Component aria-label="LABEL" accessibilityHint="HINT">
                    CONTENT
				</Component>
			);

			const expected = 'LABEL';
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should use only the aria-label when set and ignore accessibilityPreHint',
		() => {
			const subject = shallow(
				<Component accessibilityPreHint="PREHINT" aria-label="LABEL">
                    CONTENT
				</Component>
			);

			const expected = 'LABEL';
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should use only the aria-label when set and ignore accessibilityHint',
		() => {
			const subject = shallow(
				<Component accessibilityHint="HINT" aria-label="LABEL">
                    CONTENT
				</Component>
			);

			const expected = 'LABEL';
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should use only the aria-label when set and ignore accessibilityPreHint',
		() => {
			const subject = shallow(
				<Component accessibilityPreHint="PREHINT" aria-label="LABEL">
                    CONTENT
				</Component>
			);

			const expected = 'LABEL';
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test('should use only the aria-label when set and ignore others', () => {
		const subject = shallow(
			<Component accessibilityPreHint="PREHINT" accessibilityHint="HINT" aria-label="LABEL">
				CONTENT
			</Component>
		);

		const expected = 'LABEL';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});
});
