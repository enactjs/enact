import clamp from 'ramda/src/clamp';
import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useImperativeHandle, useRef} from 'react';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const JS = 'JS';
const spottableSelector = `.${spottableClass}`;

const useKeyUp = (
    {},
    props
) => {
    function onKeyUp ({keyCode}) {
        if (getDirection(keyCode) || isEnter(keyCode)) {
            SpotlightAccelerator.reset();
        }
    }

    const spotlightId = {props};
    const scrollerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
    useEffect(
        () => {
            // componentDidMount
            if (scrollerNode && scrollerNode.addEventListener) {
                scrollerNode.addEventListener('keyup', onKeyUp, {capture: true});
            }

            // componentWillUnmount
            return () => {
                if (scrollerNode && scrollerNode.removeEventListener) {
                    scrollerNode.removeEventListener('keyup', onKeyUp, {capture: true});
                }
            };
        },
        [scrollerNode, spotlightId]
    );	// TODO : Handle exhaustive-deps ESLint rule.
}

export {
    useKeyUp,
};
