import {act, render} from '@testing-library/react';
import {useEffect} from 'react';

import Measurable, {useMeasurable} from '../Measurable';

let data: any;

const DivComponent = (props: Record<string, any>) => {
	const {controlsRef} = props;

	useEffect(() => {
		data = props;
	}, [props]);

	return <div ref={controlsRef} />;
};

const MeasurableComponent = Measurable({refProp: 'controlsRef', measurementProp: 'controlsMeasurements'}, DivComponent);

const UseMeasurableDecorator = (Wrapped: any) => {
	return function UseMeasurableDecorator (props: Record<string, any>) { // eslint-disable-line no-shadow, @typescript-eslint/no-shadow
		const {ref: controlsRef, measurement: {width: contentWidth = 0} = {}} = useMeasurable();

		const measurableProps = {
			controlsRef,
			contentSize: contentWidth
		};

		return <Wrapped {...props} {...measurableProps} />;
	};
};

const UseMeasurableComponent = UseMeasurableDecorator(DivComponent);

describe('Measurable', () => {
	test('should pass \'controlsMeasurements\' prop to the wrapped component', () => {
		let listener: any = () => {};
		(global as any).ResizeObserver = class {
			constructor (ls: any) {
				listener = ls;
			}
			observe () {}
			unobserve () {}
			disconnect () {}
		};

		render(<MeasurableComponent />);

		act(() => {
			listener([
				{
					target: {
						clientWidth: 100,
						scrollWidth: 200,
						clientHeight: 100,
						scrollHeight: 200
					}
				}
			]);
		});

		expect(data).toHaveProperty('controlsMeasurements');

		(global as any).ResizeObserver = null;
	});

	test('should pass \'controlsRef\' prop to the wrapped component', () => {
		let listener: any = () => {};
		(global as any).MutationObserver = class {
			constructor (ls: any) {
				listener = ls;
			}
			disconnect () {}
			observe () {}
		};

		render(<MeasurableComponent />);

		act(() => {
			listener([
				{
					addedNodes: [],
					attributeName: "class",
					attributeNamespace: null,
					nextSibling: null,
					oldValue: null,
					previousSibling: null,
					removedNodes: [],
					target: 'div',
					type: "attributes"
				}
			]);
		});

		expect(data).toHaveProperty('controlsRef');

		(global as any).MutationObserver = null;
	});
});

describe('useMeasurable', () => {
	test('should pass \'controlsRef\' prop to the wrapped component', () => {
		render(<UseMeasurableComponent />);

		expect(data).toHaveProperty('controlsRef');
	});
});
