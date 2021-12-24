import '@testing-library/jest-dom';
import {render} from '@testing-library/react';

import useSkins from '../useSkins';

describe('Skinnable Specs', () => {
	let data;

	const Base = (props) => {
		data = props;
		return null;
	};
	function Component ({config}) {
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

		render(<Component config={config} />);

		const expected = 'darkSkin';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={config} />);

		const expected = 'lightSkin';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={config} />);

		const expected = '';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={config} />);

		const expected = 'darkSkin';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={config} />);

		const expected = 'darkSkin normal unicase';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={config} />);

		const expected = 'darkSkin normal';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={config} />);

		const expected = 'darkSkin normal unicase';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={{...config, skinVariants: 'normal unicase'}} />);
		const component1Class = data.className;

		render(<Component config={{...config, skinVariants: ['normal', 'unicase']}} />);
		const component2Class = data.className;

		expect(component1Class).toBe(component2Class);
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

		render(<Component config={config} />);

		const expected = 'darkSkin unicase';

		expect(data).toHaveProperty('className', expected);
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

		render(<Component config={config} />);

		const expected = 'darkSkin normal';

		expect(data).toHaveProperty('className', expected);
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

		render(
			<Parent config={{...config, skinVariants: 'unicase'}}>
				<Component config={{...config, skinVariants: 'smallCaps'}} />
			</Parent>
		);

		const expected = 'darkSkin normal unicase smallCaps';

		expect(data).toHaveProperty('className', expected);
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

		render(
			<Parent config={{...config, skinVariants: 'smallCaps unicase'}}>
				<Component config={{...config, skinVariants: {unicase: false}}} />
			</Parent>
		);

		const expected = 'darkSkin normal smallCaps';

		expect(data).toHaveProperty('className', expected);
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

		render(
			<Parent config={config}>
				<Parent config={{...config, skinVariants: {normal: false}}}>
					<Component config={config} />
				</Parent>
			</Parent>
		);

		const expected = 'darkSkin';

		expect(data).toHaveProperty('className', expected);
	});
});
