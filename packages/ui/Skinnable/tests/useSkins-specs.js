import {mount, shallow} from 'enzyme';

import useSkins from '../useSkins';

describe('Skinnable Specs', () => {

	function Base () {
		return null;
	}
	function Component ({config}) { // eslint-disable-line enact/prop-types
		const skins = useSkins(config);
		return (
			<Base {...skins} />
		);
	}

	function Parent ({config, children}) {
		const skins = useSkins(config);

		return skins.provideSkins(children);
	}

	test('should add a default skin class when no skin prop is specified', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'darkSkin';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should add the preferred skin class when the skin prop is specified', () => {
		const config = {
			defaultSkin: 'dark',
			skin: 'light',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'lightSkin';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should ignore the preferred skin prop if it\'s not one of the available skins', () => {
		const config = {
			defaultSkin: 'dark',
			skin: 'potato',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const subject = shallow(<Component config={config} />);

		const expected = '';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should ignore the skinVariants prop if there are no defined allowedVariants', () => {
		const config = {
			defaultSkin: 'dark',
			skinVariants: 'potato',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'darkSkin';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should only apply allowed variants assigned by the skinVariants prop', () => {
		const config = {
			defaultSkin: 'dark',
			skinVariants: 'normal potato unicase',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'darkSkin normal unicase';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should apply default variants even if the skinVariants prop is explicitly empty', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skinVariants: '',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'darkSkin normal';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should apply default variants and the skinVariants if both are defined', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skinVariants: 'unicase',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'darkSkin normal unicase';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should apply variants supplied via an array or a string in the same way', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subjectA = shallow(<Component config={{...config, skinVariants: 'normal unicase'}} />);
		const subjectB = shallow(<Component config={{...config, skinVariants: ['normal', 'unicase']}} />);

		expect(subjectA.find(Base).prop('className')).toBe(subjectB.find(Base).prop('className'));
	});

	test('should allow opting out of the default variants if an object is supplied to skinVariants with false as variant-key values', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skinVariants: {normal: false, unicase: true},
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'darkSkin unicase';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should ignore variants, sent by an object, equaling null, undefined, or empty string', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skinVariants: {normal: null, smallCaps: void 0, unicase: ''},
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = shallow(<Component config={config} />);

		const expected = 'darkSkin normal';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should apply parent variants', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = mount(
			<Parent config={{...config, skinVariants: 'unicase'}}>
				<Component config={{...config, skinVariants: 'smallCaps'}} />
			</Parent>
		);

		const expected = 'darkSkin normal unicase smallCaps';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should be able to override a parent\'s variants by assigning a false skinVariant', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = mount(
			<Parent config={{...config, skinVariants: 'smallCaps unicase'}}>
				<Component config={{...config, skinVariants: {unicase: false}}} />
			</Parent>
		);

		const expected = 'darkSkin normal smallCaps';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});

	test('should inherit an overridden default variant', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			variants: ['normal', 'smallCaps', 'unicase']
		};

		const subject = mount(
			<Parent config={config}>
				<Parent config={{...config, skinVariants: {normal: false}}}>
					<Component config={config} />
				</Parent>
			</Parent>
		);

		const expected = 'darkSkin';
		const actual = subject.find(Base).prop('className');

		expect(actual).toBe(expected);
	});
});
