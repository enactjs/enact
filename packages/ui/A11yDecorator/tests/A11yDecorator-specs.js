import React from 'react';
import {shallow} from 'enzyme';
import A11yDecorator from '../A11yDecorator';

describe('A11yDecorator', () => {

	const Component = A11yDecorator('div');

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
				<Component aria-label="LABEL" accessibilityPreHint="PREHINT">
                    CONTENT
				</Component>
			);

			const expected = 'LABEL';
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

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

	test(
		'should use the accessibilityPreHint, accessibilityHint, aria-label when set',
		() => {
			const subject = shallow(
				<Component accessibilityPreHint="PREHINT" accessibilityHint="HINT" aria-label="LABEL">
                    CONTENT
				</Component>
			);

			const expected = 'LABEL';
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test('should support configuring the prop to source the content', () => {
		const TestComponent = A11yDecorator(
			{prop: 'title'},
			({title}) => <div>{title}</div>
		);

		const subject = shallow(
			<TestComponent accessibilityPreHint="PREHINT" accessibilityHint="HINT" title="TITLE" />
		);

		const expected = 'PREHINT TITLE HINT';
		const actual = subject.prop('aria-label');

		expect(actual).toBe(expected);
	});

});
