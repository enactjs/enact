import {render} from '@testing-library/react';

import Measurable from '../Measurable';

describe('Measurable', () => {
	let data;

	const DivComponent = (props) => {
		data = props;

		return <div />;
	};

	const MeasurableComponent = Measurable({refProp: 'controlsRef', measurementProp: 'controlsMeasurements'}, DivComponent);

	describe('config', () => {
		test('should pass \'controlsMeasurements\' prop to the wrapped component', () => {
			render(<MeasurableComponent />);

			expect(data).toHaveProperty('controlsMeasurements');
		});

		test('should pass \'controlsRef\' prop to the wrapped component', () => {
			render(<MeasurableComponent />);

			expect(data).toHaveProperty('controlsRef');
		});
	});
});
