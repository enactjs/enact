import useClass from '@enact/core/useClass';
import React from 'react';
import ReactDOM from 'react-dom';

import Spot from './Spot';

/**
 * Configuration for `useSpot`
 *
 * @typedef {Object} useSpotConfig
 * @memberof ui/Spotable
 * @property {Boolean}  [defaultSelected = false] Initial state of the Spot
 * @property {Boolean}  [disabled = false]        Disables updating the state
 * @property {Boolean}  [prop = "selected"]       The key used to pass the current value back
 *                                                through the `onSpot` callback.
 * @property {Boolean}  [selected = false]        Current state of the Spot
 * @property {Function} [onSpot]                Called when the state is changed
 * @private
 */

/**
 * Object returned by `useSpot`
 *
 * @typedef {Object} useSpotInterface
 * @memberof ui/Spotable
 * @property {Boolean}  selected   Current state of the Spot
 * @property {Function} activate   Sets the current state to `true`
 * @property {Function} deactivate Sets the current state to `false`
 * @property {Function} Spot     Spots the current state to the opposite value
 * @private
 */

/**
 * Manages a boolean state value.
 *
 * The value may either be Spotd via the `onSpot` or explicitly set via `onActivate` and
 * `onDeactivate`. The initial value can be set using the `defaultSelected` option.
 *
 * @param {useSpotConfig} config Configuration options
 * @returns {useSpotInterface}
 * @private
 */

const useSpot = ({...config} = {}) => {
    const spot = useClass(Spot, config);
    const ref = React.useRef(null);
    const prevSpotlightDisabled = React.useRef(config.prevSpotlightDisabled);
    const {spotlightDisabled} = config;

    prevSpotlightDisabled.current = spotlightDisabled;
	spot.setContext({prevSpotlightDisabled});

    React.useEffect(() => {
        // eslint-disable-next-line react/no-find-dom-node
        spot.load(ReactDOM.findDOMNode(ref.current));

        return () => {
            spot.unload();
        }
    }, []);

    React.useEffect(() => {
        spot.spotlightDisabledChanged();
    }, [spotlightDisabled]);

    return {
        focusedWhenDisabled: spot.focusedWhenDisabled,
        setFocusedWhenDisabled: spot.setFocusedWhenDisabled,
        ref,

        blur: spot.handleBlur,
        focus: spot.handleFocus,
        keyDown: spot.handleKeyDown,
        keyUp: spot.handleKeyUp,
        mouseEnter: spot.handleEnter,
        mouseLeave: spot.handleLeave,
    };
};

export default useSpot;
export {
    useSpot
};
