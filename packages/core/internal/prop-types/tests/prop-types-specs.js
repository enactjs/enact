import {render} from '@testing-library/react';
import {Component, createRef} from 'react';
import EnactPropTypes from '../prop-types';


describe('prop-types', () => {
	const DummyElement = (<div />);
	const DummyRenderable = () => DummyElement;
	const dummyString = 'Some String';

	class TestComponent extends Component {
		static displayName = 'TestComponent';

		static propTypes = {
			typeComponent: EnactPropTypes.component,
			typeComponentOverride: EnactPropTypes.componentOverride,
			typeRef: EnactPropTypes.ref,
			typeRenderable: EnactPropTypes.renderable,
			typeRenderableOverride: EnactPropTypes.renderableOverride
		};

		render ({...rest} = {}) {
			delete rest.typeComponent;
			delete rest.typeComponentOverride;
			delete rest.typeRef;
			delete rest.typeRenderable;
			delete rest.typeRenderableOverride;
			return (<div>Test</div>);
		}
	}

	let consoleWarnMock = null;
	let consoleErrorMock = null;

	beforeEach(() => {
		consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
		consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
	});

	afterEach(() => {
		consoleWarnMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	describe('no prop', () => {
		test('should not call console.error when no prop is given', () => {
			render(<TestComponent />);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});
	});

	describe('component', () => {
		test('should not call console.error for EnactPropTypes.component if renderable value is given', () => {
			render(
				<TestComponent
					typeComponent={DummyRenderable}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should call console.error for EnactPropTypes.component if string value is given', () => {
			render(
				<TestComponent
					typeComponent={dummyString}
				/>
			);

			expect(consoleErrorMock).toHaveBeenCalled();
		});

		test('should call console.error for EnactPropTypes.component if element value is given', () => {
			render(
				<TestComponent
					typeComponent={DummyElement}
				/>
			);

			expect(consoleErrorMock).toHaveBeenCalled();
		});
	});

	describe('componentOverride', () => {
		test('should not call console.error for EnactPropTypes.componentOverride if renderable value is given', () => {
			render(
				<TestComponent
					typeComponentOverride={DummyRenderable}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should call console.error for EnactPropTypes.componentOverride if string value is given', () => {
			render(
				<TestComponent
					typeComponentOverride={dummyString}
				/>
			);

			expect(consoleErrorMock).toHaveBeenCalled();
		});

		test('should not call console.error for EnactPropTypes.componentOverride if element value is given', () => {
			render(
				<TestComponent
					typeComponentOverride={DummyElement}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});
	});

	describe('ref', () => {
		test('should not call console.error for EnactPropTypes.ref if ref value is given', () => {
			const ref = createRef();

			render(
				<TestComponent
					typeRef={ref}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should call console.error for EnactPropTypes.ref if non-ref value is given', () => {
			render(
				<TestComponent
					typeRef={dummyString}
				/>
			);

			expect(consoleErrorMock).toHaveBeenCalled();
		});
	});

	describe('renderable', () => {
		test('should not call console.error for EnactPropTypes.renderable if renderable value is given', () => {
			render(
				<TestComponent
					typeRenderable={DummyRenderable}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should not call console.error for EnactPropTypes.renderable if string value is given', () => {
			render(
				<TestComponent
					typeRenderable={dummyString}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should call console.error for EnactPropTypes.renderable if element value is given', () => {
			render(
				<TestComponent
					typeRenderable={DummyElement}
				/>
			);

			expect(consoleErrorMock).toHaveBeenCalled();
		});
	});

	describe('renderableOverride', () => {
		test('should not call console.error for EnactPropTypes.renderableOverride if renderable value is given', () => {
			render(
				<TestComponent
					typeRenderableOverride={DummyRenderable}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should not call console.error for EnactPropTypes.renderableOverride if string value is given', () => {
			render(
				<TestComponent
					typeRenderableOverride={dummyString}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should not call console.error for EnactPropTypes.renderableOverride if element value is given', () => {
			render(
				<TestComponent
					typeRenderableOverride={DummyElement}
				/>
			);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});
	});

	describe('isRequired', () => {
		class RequiredComponent extends Component {
			static displayName = 'RequiredComponent';

			static propTypes = {
				typeRequired: EnactPropTypes.renderable.isRequired
			};

			render ({...rest} = {}) {
				delete rest.typeRequired;
				return (<div>Test</div>);
			}
		}

		test('should not call console.error when required prop value is given', () => {
			render(<RequiredComponent typeRequired={DummyRenderable} />);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should call console.error when prop value is missing for isRequired', () => {
			render(<RequiredComponent />);

			expect(consoleErrorMock).toHaveBeenCalled();
		});
	});

	describe('deprecated', () => {
		test('should call console.warn when prop value is given for EnactPropTypes.deprecated', () => {
			const ref = createRef();

			class DeprecatedComponent extends Component {
				static displayName = 'DeprecatedComponent';

				static propTypes = {
					typeDeprecated: EnactPropTypes.deprecated(EnactPropTypes.ref)
				};

				render ({...rest} = {}) {
					delete rest.typeDeprecated;
					return (<div>Test</div>);
				}
			}

			render(<DeprecatedComponent typeDeprecated={ref} />);

			expect(consoleWarnMock).toHaveBeenCalled();
		});

		test('should call console.warn even when prop value is not given for EnactPropTypes.deprecated', () => {
			class DeprecatedComponent extends Component {
				static displayName = 'DeprecatedComponent';

				static propTypes = {
					typeDeprecated: EnactPropTypes.deprecated(EnactPropTypes.ref)
				};

				render ({...rest} = {}) {
					delete rest.typeDeprecated;
					return (<div>Test</div>);
				}
			}

			render(<DeprecatedComponent />);

			expect(consoleWarnMock).toHaveBeenCalled();
		});
	});
});
