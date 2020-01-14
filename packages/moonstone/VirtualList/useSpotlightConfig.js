import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

const useSpotlightConfig = (instance, props) => {
    const {
        lastFocusedIndex
    } = instance.current;
    const {
        spotlightId
    } = props;

    // componentDidUpdate
    useEffect(() => {
        configureSpotlight();
    }, [spotlightId]);	// TODO : Handle exhaustive-deps ESLint rule.

    function configureSpotlight () {
        const {spacing} = props;

        Spotlight.set(spotlightId, {
            enterTo: 'last-focused',
            /*
             * Returns the data-index as the key for last focused
             */
            lastFocusedPersist: lastFocusedPersist,
            /*
             * Restores the data-index into the placeholder if its the only element. Tries to find a
             * matching child otherwise.
             */
            lastFocusedRestore: lastFocusedRestore,
            /*
             * Directs spotlight focus to favor straight elements that are within range of `spacing`
             * over oblique elements, like scroll buttons.
             */
            obliqueMultiplier: spacing > 0 ? spacing : 1
        });
    }

    function lastFocusedPersist () {
        if (lastFocusedIndex != null) {
            return {
                container: false,
                element: true,
                key: lastFocusedIndex
            };
        }
    }

    /*
     * Restores the data-index into the placeholder if it exists. Tries to find a matching child
     * otherwise.
     */
    function lastFocusedRestore ({key}, all) {
        const placeholder = all.find(el => 'vlPlaceholder' in el.dataset);
        if (placeholder) {
            placeholder.dataset.index = key;

            return placeholder;
        }

        return all.reduce((focused, node) => {
            return focused || Number(node.dataset.index) === key && node;
        }, null);
    }
}

export {
    useSpotlightConfig
};
