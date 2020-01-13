import clamp from 'ramda/src/clamp';
import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useImperativeHandle, useRef} from 'react';

import {getNumberValue} from './util';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const JS = 'JS';
const spottableSelector = `.${spottableClass}`;

const useScrollable = (variables, props) => {
    function calculatePositionOnFocus ({item, scrollPosition = variables.current.uiRefCurrent.scrollPosition}) {
        const
            {pageScroll} = props,
            {numOfItems} = variables.current.uiRefCurrent.state,
            {primary} = variables.current.uiRefCurrent,
            offsetToClientEnd = primary.clientSize - primary.itemSize,
            focusedIndex = getNumberValue(item.getAttribute(dataIndexAttribute));

        if (!isNaN(focusedIndex)) {
            let gridPosition = variables.current.uiRefCurrent.getGridPosition(focusedIndex);

            if (numOfItems > 0 && focusedIndex % numOfItems !== variables.current.lastFocusedIndex % numOfItems) {
                const node = variables.current.uiRefCurrent.getItemNode(variables.current.lastFocusedIndex);

                if (node) {
                    node.blur();
                }
            }
            variables.current.nodeIndexToBeFocused = null;
            variables.current.lastFocusedIndex = focusedIndex;

            if (primary.clientSize >= primary.itemSize) {
                if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) { // forward over
                    gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
                } else if (gridPosition.primaryPosition >= scrollPosition) { // inside of client
                    if (type === JS) {
                        gridPosition.primaryPosition = scrollPosition;
                    } else {
                        // This code uses the trick to change the target position slightly which will not affect the actual result
                        // since a browser ignore `scrollTo` method if the target position is same as the current position.
                        gridPosition.primaryPosition = scrollPosition + (variables.current.uiRefCurrent.scrollPosition === scrollPosition ? 0.1 : 0);
                    }
                } else { // backward over
                    gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
                }
            }

            // Since the result is used as a target position to be scrolled,
            // scrondaryPosition should be 0 here.
            gridPosition.secondaryPosition = 0;

            return variables.current.uiRefCurrent.gridPositionToItemPosition(gridPosition);
        }
    }

    return {
        calculatePositionOnFocus
    };
}

export {
    useScrollable,
};
