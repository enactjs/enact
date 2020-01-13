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

const usePreventScroll = (containerNode) => {
    useEffect((type) => {
        if (type === JS && containerNode) {
            const preventScroll = () => {
                containerNode.scrollTop = 0;
                containerNode.scrollLeft = props.rtl ? containerNode.scrollWidth : 0;
            };

            if (containerNode && containerNode.addEventListener) {
                containerNode.addEventListener('scroll', preventScroll);
            }

            return () => {
                if (type === JS) {
                    // remove a function for preventing native scrolling by Spotlight
                    if (containerNode && containerNode.removeEventListener) {
                        containerNode.removeEventListener('scroll', preventScroll);
                    }
                }
            }
        }
    }, []);
}

export {
    usePreventScroll,
};
