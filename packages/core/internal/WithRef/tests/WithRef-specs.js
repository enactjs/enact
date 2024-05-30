import {createRef, Component as ReactComponent} from 'react';
import {render, screen} from '@testing-library/react';

import {WithRef} from '../WithRef';

describe('WithRef', () => {
	const DummyComponent = class extends ReactComponent {
		static displayName = 'DummyComponent';

		render () {
			return (<div {...this.props} >Dummy</div>);
		}
	};

	test('should return a DOM node of the wrapped component via outermostRef', () => {
		const ComponentWithRef = WithRef(DummyComponent);
		const id = 'test-wrapped';
		const divRef = createRef();
		render(
			<ComponentWithRef outermostRef={divRef} data-testid={id} />
		);
		const expectedNode = screen.getByTestId(id);

		expect(divRef.current).toBe(expectedNode);
	});

	test('should pass ref', () => {
		const ComponentWithRef = WithRef('div');
		const id = 'test-wrapped';
		const divRef = createRef();

		render(
			<ComponentWithRef ref={divRef} data-testid={id} />
		);
		const expectedNode = screen.getByTestId(id);

		expect(divRef.current).toBe(expectedNode);
	});
});
