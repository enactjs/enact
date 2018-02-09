import PropTypes from 'prop-types';
import React from 'react';

/**
 * Converting a React component to a HoC with render props
 */
const hocFactory = (WrapperComponent, {name: wrapperName, ...wrapperRest}) => WrappedComponent => {
	const HoC = ({wrappedRef, ...wrappedRest}) => {
		return (
			<WrapperComponent
				{...wrapperRest}
				// eslint-disable-next-line react/jsx-no-bind
				render={({ref: wrappedRefForWrapper, ...wrappedComponentProps}) => (
					<WrappedComponent
						{...wrappedRest}
						{...wrappedComponentProps}
						ref={function (ref) {
							if (wrappedRefForWrapper) {
								wrappedRefForWrapper(ref);
							}
							if (wrappedRef) {
								wrappedRef(ref);
							}
						}}
					/>
				)}
			/>
		);
	};

	HoC.displayName = wrapperName || `hocFactory(${WrappedComponent.displayName || WrappedComponent.name})`;
	HoC.WrappedComponent = WrappedComponent;
	HoC.propTypes = {
		wrappedRef: PropTypes.func
	};

	return HoC;
};

export default hocFactory;
export {
	hocFactory
};
