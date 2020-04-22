import React from 'react';
import {mount} from 'enzyme';
import Skinnable from '../Skinnable';

describe('Skinnable Specs', () => {

	test('should do nothing when nothing is specified', () => {
		const config = {};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent />);

		const expected = 0;
		const actual = Object.keys(subject.find('div').props()).length;

		expect(actual).toEqual(expected);
	});

	test('should add a default skin class when no skin prop is specified', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent />);

		const expected = 'darkSkin';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should add the preferred skin class when the skin prop is specified', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skin="light" />);

		const expected = 'lightSkin';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should ignore the preferred skin prop if it\'s not one of the available skins', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skin="potato" />);

		const expected = void 0;
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should ignore the preferred skin prop if it\'s not one of the available skins and not interfere with the className prop', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skin="potato" className="cheatingComponent" />);

		const expected = 'cheatingComponent';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should ignore the skinVariants prop if there are no defined allowedVariants', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skinVariants="potato" />);

		const expected = 'darkSkin';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should only apply allowed variants assigned by the skinVariants prop', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skinVariants="normal potato unicase" />);

		const expected = 'darkSkin normal unicase';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should apply default variants even if the skinVariants prop is explicitly empty', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skinVariants="" />);

		const expected = 'darkSkin normal';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should apply default variants and the skinVariants if both are defined', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skinVariants="unicase" />);

		const expected = 'darkSkin normal unicase';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should apply variants supplied via an array or a string in the same way', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subjectA = mount(<SkinnableComponent skinVariants="normal unicase" />);
		const subjectB = mount(<SkinnableComponent skinVariants={['normal', 'unicase']} />);

		expect(subjectA.find('div')).toEqual(subjectB.find('div'));
	});

	test('should allow opting out of the default variants if an object is supplied to skinVariants with false as variant-key values', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skinVariants={{normal: false, unicase: true}} />);

		const expected = 'darkSkin unicase';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should ignore variants, sent by an object, equaling null, undefined, or empty string', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableComponent = Skinnable(config, Component);

		const subject = mount(<SkinnableComponent skinVariants={{normal: null, smallCaps: void 0, unicase: ''}} />);

		const expected = 'darkSkin normal';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should apply parent variants', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableParent = Skinnable(config, Component);
		const SkinnableChild = Skinnable(config, Component);

		const subject = mount(
			<SkinnableParent skinVariants="unicase">
				<SkinnableChild skinVariants="smallCaps" />
			</SkinnableParent>
		);

		const expected = 'darkSkin normal unicase smallCaps';
		const actual = subject.find('div').last().prop('className');

		expect(actual).toEqual(expected);
	});

	test('should be able to override a parent\'s variants by assigning a false skinVariant', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableParent = Skinnable(config, Component);
		const SkinnableChild = Skinnable(config, Component);

		const subject = mount(
			<SkinnableParent skinVariants="smallCaps unicase">
				<SkinnableChild skinVariants={{unicase: false}} />
			</SkinnableParent>
		);

		const expected = 'darkSkin normal smallCaps';
		const actual = subject.find('div').last().prop('className');

		expect(actual).toEqual(expected);
	});

	test('should inherit an overridden default variant', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};

		const Component = (props) => (
			<div {...props} />
		);

		const SkinnableParent = Skinnable(config, Component);
		const SkinnableChild = Skinnable(config, Component);

		const subject = mount(
			<SkinnableParent>
				<SkinnableChild skinVariants={{normal: false}}>
					<SkinnableChild id="innerChild" />
				</SkinnableChild>
			</SkinnableParent>
		);

		const expected = 'darkSkin';
		const actual = subject.find('div#innerChild').prop('className');

		expect(actual).toEqual(expected);
	});
});
