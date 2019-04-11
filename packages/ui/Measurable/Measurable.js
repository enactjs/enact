/**
 * A higher-order component that adds the ability to measure nodes conveniently.
 *
 * @module ui/Measurable
 * @exports Measurable
 */

import hoc from '@enact/core/hoc';
import React, {useState, useCallback} from 'react';

/**
 * Default config for {@link ui/Measurable.Measurable}.
 *
 * @memberof ui/Measurable.Measurable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the prop name to pass the measurement object.
	 *
	 * @type {String}
	 * @default 'measurement'
	 * @memberof ui/Measurable.Measurable.defaultConfig
	 */
	measurementProp: 'measurement',

	/**
	 * Configures the prop name to pass a function to capture a reference to the element to measure.
	 *
	 * @type {String}
	 * @default 'forwardRef'
	 * @memberof ui/Measurable.Measurable.defaultConfig
	 */
	refProp: 'forwardRef'
};

function useMeasurable () {
	const [measurement, setMeasurement] = useState();
	const ref = useCallback(node => {
		if (node != null) {
			setMeasurement(node ? node.getBoundingClientRect() : null);
		}
	}, []);

	return {
		ref,
		measurement
	};
}

/**
 * A higher-order component that adds the ability to measure a referenced node and get that value
 * back as a prop.
 *
 * Applying `Measurable` to a component will pass two additional props: function to fetch the `ref`
 * and the measurement object (currently this executes `getBoundingClientRect` returning its full
 * complement of properties). Both prop names are configurable through the HOC config object.
 *
 * Changes to the referenced node will result in new measurements being returned as props. That
 * being said, it probably is not wise to use this during animation as it may cause unwanted
 * performance issues.
 *
 * @see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
 * @class Measurable
 * @memberof ui/Measurable
 * @hoc
 * @public
 */
const Measurable = hoc(defaultConfig, (configHoc, Wrapped) => {
	return function MeasurableHoc (props) {
		// Take the config from Measurable and insert it into a fresh instance of defineMeasurable
		const {ref, measurement} = useMeasurable();
		const measurementProps = {
			[configHoc.refProp]: ref,
			[configHoc.measurementProp]: measurement
		};

		return (<Wrapped {...props} {...measurementProps} />);
	};
});

export default Measurable;
export {
	Measurable,    // HOC
	useMeasurable  // Hook
};
