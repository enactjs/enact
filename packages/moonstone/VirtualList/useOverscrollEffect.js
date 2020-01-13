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

const useOverscrollEffect = ({
    isWrappedBy5way
}) => {
    function shouldPreventOverscrollEffect () {
        return isWrappedBy5way;
    }

    return {
        shouldPreventOverscrollEffect
    };
}

export {
    useOverscrollEffect,
};
