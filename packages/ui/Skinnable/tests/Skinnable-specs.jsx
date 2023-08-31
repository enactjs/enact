import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Skinnable from '../Skinnable';

describe('Skinnable Specs', () => {
	test('should do nothing when nothing is specified', () => {
		const config = {};
		let data;

		const Component = (props) => {
			data = props;
			return <div {...props} />;
		};

		const SkinnableComponent = Skinnable(config, Component);

		render(<SkinnableComponent />);

		expect(data).toMatchObject({});
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

		render(<SkinnableComponent data-testid="skinnableComponent" />);

		const expected = 'darkSkin';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(<SkinnableComponent data-testid="skinnableComponent" skin="light" />);

		const expected = 'lightSkin';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
	});

	test('should ignore the preferred skin prop if it\'s not one of the available skins', () => {
		const config = {
			defaultSkin: 'dark',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			}
		};
		let data;

		const Component = (props) => {
			data = props;
			return <div {...props} />;
		};

		const SkinnableComponent = Skinnable(config, Component);

		render(<SkinnableComponent data-testid="skinnableComponent" skin="potato" />);

		expect(data).toMatchObject({});
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

		render(<SkinnableComponent className="cheatingComponent" data-testid="skinnableComponent" skin="potato" />);

		const expected = 'cheatingComponent';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(<SkinnableComponent data-testid="skinnableComponent" skinVariants="potato" />);

		const expected = 'darkSkin';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(<SkinnableComponent data-testid="skinnableComponent" skinVariants="normal potato unicase" />);

		const expected = 'darkSkin normal unicase';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(<SkinnableComponent data-testid="skinnableComponent" skinVariants="" />);

		const expected = 'darkSkin normal';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(<SkinnableComponent data-testid="skinnableComponent" skinVariants="unicase" />);

		const expected = 'darkSkin normal unicase';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(<SkinnableComponent data-testid="skinnableComponent1" skinVariants="normal unicase" />);
		const component1ClassNames = screen.getByTestId('skinnableComponent1').className;

		render(<SkinnableComponent data-testid="skinnableComponent2" skinVariants={['normal', 'unicase']} />);
		const component2ClassNames = screen.getByTestId('skinnableComponent2').className;

		expect(component1ClassNames).toEqual(component2ClassNames);
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

		render(<SkinnableComponent data-testid="skinnableComponent" skinVariants={{normal: false, unicase: true}} />);

		const expected = 'darkSkin unicase';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(<SkinnableComponent data-testid="skinnableComponent" skinVariants={{normal: null, smallCaps: void 0, unicase: ''}} />);

		const expected = 'darkSkin normal';
		const component = screen.getByTestId('skinnableComponent');

		expect(component).toHaveClass(expected);
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

		render(
			<SkinnableParent skinVariants="unicase">
				<SkinnableChild data-testid="skinnableChild" skinVariants="smallCaps" />
			</SkinnableParent>
		);

		const expected = 'darkSkin normal unicase smallCaps';
		const component = screen.getByTestId('skinnableChild');

		expect(component).toHaveClass(expected);
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

		render(
			<SkinnableParent skinVariants="smallCaps unicase">
				<SkinnableChild data-testid="skinnableChild" skinVariants={{unicase: false}} />
			</SkinnableParent>
		);

		const expected = 'darkSkin normal smallCaps';
		const component = screen.getByTestId('skinnableChild');

		expect(component).toHaveClass(expected);
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

		render(
			<SkinnableParent>
				<SkinnableChild skinVariants={{normal: false}}>
					<SkinnableChild data-testid="innerChild" />
				</SkinnableChild>
			</SkinnableParent>
		);

		const expected = 'darkSkin';
		const component = screen.getByTestId('innerChild');

		expect(component).toHaveClass(expected);
	});

	test('should not force re-render of child if child unaffected', () => {
		const config = {
			defaultSkin: 'dark',
			defaultVariants: 'normal',
			skins: {
				dark: 'darkSkin',
				light: 'lightSkin'
			},
			allowedVariants: ['normal', 'smallCaps', 'unicase']
		};
		const wasRendered = jest.fn();

		const Component = (props) => (
			<div {...props} />
		);

		const ChildComponent = () => {
			wasRendered();
			return <div>Hello</div>;
		};

		const SkinnableParent = Skinnable(config, Component);
		const SkinnableChild = Skinnable(config, ChildComponent);

		const childrenProp = (<SkinnableChild />);

		const {rerender} = render(
			<SkinnableParent>
				{childrenProp}
			</SkinnableParent>
		);

		rerender(
			<SkinnableParent className="foo">
				{childrenProp}
			</SkinnableParent>
		);

		const expected1 = 1;
		const actual1 = wasRendered.mock.calls.length;

		rerender(
			<SkinnableParent className="foo" skin="light">
				{childrenProp}
			</SkinnableParent>
		);

		const expected2 = 2;
		const actual2 = wasRendered.mock.calls.length;

		expect(actual1).toEqual(expected1);
		expect(actual2).toEqual(expected2);
	});
});
