/**
 * Exports the {@link ui/Remeasurable.Remeasurable} and {@link ui/Remeasurable.RemeasurableDecorator}
 * higher-order component (HOC). Adds the ability to broadcast remeasure changes
 * based on a callback. The default export is {@link ui/Remeasurable.Remeasurable}.
 *
 * @module ui/Remeasurable
 * @private
 */
import React from 'react';
import {perfNow} from '@enact/core/util';
import PropTypes from 'prop-types';

const RemeasurableContext = React.createContext({remeasure: 0});

/**
 * {@link ui/Remeasurable.RemeasurableDecorator} is a higher-order component which adds the ability
 * to broadcast remeasure changes based on a callback.
 *
 * @class RemeasurableDecorator
 * @memberof ui/Remeasurable
 * @hoc
 * @private
 */
class Remeasurable extends React.Component {
	static propTypes = {
		trigger: PropTypes.String
	}

	constructor (props) {
		super(props);
		this.state = {
			remeasure: 0,
			[props.trigger]: props[props.trigger]
		};
	}

	static getDerivedStateFromProps = (nextProps, state) => {
		if (nextProps[nextProps.trigger] !== state[nextProps.trigger]) {
			return {
				remeasure: perfNow(),
				[nextProps.trigger]: nextProps[nextProps.trigger]
			};
		}

		return null;
	};

	checkLatestValue (contextValue, state) {
		if (contextValue.remeasure && contextValue.remeasure > state.remeasure) {
			return contextValue;
		}

		return state;
	}

	render () {
		return (
			<RemeasurableContext.Consumer>
				{value => {
					const state = this.checkLatestValue(value, this.state);

					return (
						<RemeasurableContext.Provider value={{remeasure: state.remeasure}}>
							{this.props.children}
						</RemeasurableContext.Provider>
					);
				}}
			</RemeasurableContext.Consumer>
		);
	}
}


/**
 * {@link ui/Remeasurable.Remeasurable} is a higher-order component which notifies a child of a
 * change in size from parent. This can then be used to trigger a new measurement. A `remeasure`
 * prop will be passed down to the wrapped component.
 *
 * @class Remeasurable
 * @memberof ui/Remeasurable
 * @hoc
 * @private
 */

export default Remeasurable;
export {Remeasurable, RemeasurableContext};
