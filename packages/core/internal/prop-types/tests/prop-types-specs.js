import {render} from '@testing-library/react';
import {Component, createRef} from 'react';
import EnactPropTypes from '../prop-types';

/*
const EnactPropTypes = {
	component,
	componentOverride,
	ref,
	deprecated,
	renderable,
	renderableOverride
};
*/

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

	test('should call console.warn when prop value is given for EnactPropTypes.deprecated', () => {
		const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

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

		// eslint-disable-next-line no-console
		expect(console.warn).toHaveBeenCalled();

		consoleWarnMock.mockRestore();
	});

	test('should call console.warn even when prop value is not given for EnactPropTypes.deprecated', () => {
		const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

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

		// eslint-disable-next-line no-console
		expect(console.warn).toHaveBeenCalled();

		consoleWarnMock.mockRestore();
	});

	test('should not call console.error when required prop value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

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

		render(<RequiredComponent typeRequired={DummyRenderable} />);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should call console.error when prop value is missing for isRequired', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

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

		render(<RequiredComponent />);

		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error when no prop is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(<TestComponent />);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.component if renderable value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeComponent={DummyRenderable}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should call console.error for EnactPropTypes.component if string value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeComponent={dummyString}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should call console.error for EnactPropTypes.component if element value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeComponent={DummyElement}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.componentOverride if renderable value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeComponentOverride={DummyRenderable}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should call console.error for EnactPropTypes.componentOverride if string value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeComponentOverride={dummyString}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.componentOverride if element value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeComponentOverride={DummyElement}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.ref if ref value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		const ref = createRef();

		render(
			<TestComponent
				typeRef={ref}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should call console.error for EnactPropTypes.ref if ref value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		const ref = dummyString;

		render(
			<TestComponent
				typeRef={ref}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.renderable if renderable value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeRenderable={DummyRenderable}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.renderable if string value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeRenderable={dummyString}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should call console.error for EnactPropTypes.renderable if element value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeRenderable={DummyElement}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.renderableOverride if renderable value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeRenderableOverride={DummyRenderable}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.renderableOverride if string value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeRenderableOverride={dummyString}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

	test('should not call console.error for EnactPropTypes.renderableOverride if element value is given', () => {
		const consoleErrMock = jest.spyOn(console, 'error').mockImplementation();

		render(
			<TestComponent
				typeRenderableOverride={DummyElement}
			/>
		);

		// eslint-disable-next-line no-console
		expect(console.error).not.toHaveBeenCalled();

		consoleErrMock.mockRestore();
	});

});
