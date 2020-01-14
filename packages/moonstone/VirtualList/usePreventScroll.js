import clamp from 'ramda/src/clamp';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import {useEffect} from 'react';

const usePreventScroll = ({}, props, {containerNode, type}) => {
    useEffect(() => {
        if (type === 'JS' && containerNode) {
            const preventScroll = () => {
                containerNode.scrollTop = 0;
                containerNode.scrollLeft = props.rtl ? containerNode.scrollWidth : 0;
            };

            if (containerNode && containerNode.addEventListener) {
                containerNode.addEventListener('scroll', preventScroll);
            }

            return () => {
                // remove a function for preventing native scrolling by Spotlight
                if (containerNode && containerNode.removeEventListener) {
                    containerNode.removeEventListener('scroll', preventScroll);
                }
            }
        }
    }, [containerNode]);
}

export {
    usePreventScroll,
};
