import React from 'react';
import PropTypes from 'prop-types';
import {mount} from 'enzyme';
import kind from '../kind';

describe('kind', () => {

	const TestContext = React.createContext({
		value: 'initial'
	});
	const Kind = kind({
		name: 'Kind',
		propTypes: {
			prop: PropTypes.number.isRequired,
			label: PropTypes.string
		},
		defaultProps: {
			label: 'Label'
		},
		contextType: TestContext,
		styles: {
			className: 'kind'
		},
		handlers: {
			onClick: (ev, props, context) => {
				props.onClick(context.value);
			}
		},
		computed: {
			value: ({prop}) => prop + 1,
			contextValue: (props, context) => {
				return context ? `context${context.value}` : 'unknown';
			}
		},
		render: ({contextValue, label, value, ...rest}) => {
			delete rest.prop;
			return (
				<div {...rest} title={label} data-context={contextValue}>
					{value}
				</div>
			);
		}
	});

	test('should assign name to displayName', () => {
		const expected = 'Kind';
		const actual = Kind.displayName;

		expect(actual).toBe(expected);
	});

	test('should default {label} property', () => {
		const subject = <Kind prop={1} />;

		const expected = 'Label';
		const actual = subject.props.label;

		expect(actual).toBe(expected);
	});

	test('should default {label} property when explicitly undefined', () => {
		// Explicitly testing for undefined
		// eslint-disable-next-line no-undefined
		const subject = <Kind prop={1} label={undefined} />;

		const expected = 'Label';
		const actual = subject.props.label;

		expect(actual).toBe(expected);
	});

	test('should add className defined in styles', () => {
		const subject = mount(
			<Kind prop={1} />
		);

		const expected = 'kind';
		const actual = subject.find('div').prop('className');

		expect(actual).toBe(expected);
	});

	test('should compute {value} property', () => {
		const subject = mount(
			<Kind prop={1} />
		);

		const expected = 2;
		const actual = subject.find('div').prop('children');

		expect(actual).toBe(expected);
	});

	test('should support contextType in handlers', () => {
		const onClick = jest.fn();
		const subject = mount(
			<Kind prop={1} onClick={onClick} />
		);

		subject.find('div').invoke('onClick')();

		const expected = 'initial';
		const actual = onClick.mock.calls[0][0];

		expect(actual).toBe(expected);
	});

	test('should support contextType in computed', () => {
		const subject = mount(
			<Kind prop={1} />
		);

		const expected = 'contextinitial';
		const actual = subject.find('div').prop('data-context');

		expect(actual).toBe(expected);
	});

	describe('inline', () => {
		test('should support a minimal kind', () => {
			const Minimal = kind({
				name: 'Minimal',
				render: () => <div />
			});

			const component = Minimal.inline();

			const expected = 'div';
			const actual = component.type;

			expect(actual).toBe(expected);
		});

		test('should set default props when prop is not passed', () => {
			const component = Kind.inline();

			// since we're inlining the output, we have to reference where the label prop lands --
			// the title prop of the <div> -- rather than the label prop on the component (which
			// doesn't exist due to inlining).
			const expected = 'Label';
			const actual = component.props.title;

			expect(actual).toBe(expected);
		});

		test('should set default props when passed prop is undefined', () => {
			const component = Kind.inline({
				// explicitly testing settings undefined in this test case
				// eslint-disable-next-line no-undefined
				label: undefined
			});

			const expected = 'Label';
			const actual = component.props.title;

			expect(actual).toBe(expected);
		});

		test('should include handlers', () => {
			const component = Kind.inline();

			const expected = 'function';
			const actual = typeof component.props.onClick;

			expect(actual).toBe(expected);
		});

		test('should not support context', () => {
			const component = Kind.inline();

			const expected = 'unknown';
			const actual = component.props['data-context'];

			expect(actual).toBe(expected);
		});
	});

});
