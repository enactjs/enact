import {act, render} from '@testing-library/react';

import Measurable, {useMeasurable} from '../Measurable';

let data;

const DivComponent = (props) => {
	data = props;

	return <div ref={props.controlsRef} />;
};

const MeasurableComponent = Measurable({refProp: 'controlsRef', measurementProp: 'controlsMeasurements'}, DivComponent);

const UseMeasurableDecorator = (Wrapped) => {
	return function UseMeasurableDecorator (props) { // eslint-disable-line no-shadow
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
		let listener = () => {};
		global.ResizeObserver = class {
			constructor (ls) {
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

		global.ResizeObserver = null;
	});

	test('should pass \'controlsRef\' prop to the wrapped component', () => {
		let listener = () => {};
		global.MutationObserver = class {
			constructor (ls) {
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

		global.MutationObserver = null;
	});
});

describe('useMeasurable', () => {
	test('should pass \'controlsRef\' prop to the wrapped component', () => {
		render(<UseMeasurableComponent />);

		expect(data).toHaveProperty('controlsRef');
	});
});
