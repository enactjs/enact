import {useRef, useCallback} from 'react';

import Announce from './Announce';

/**
 * Object returned by `useAnnounce`
 *
 * @typedef {Object} useAnnounceInterface
 * @property {Function} announce Called to alert the user of behavior for accessibility
 * @property {Node}     children An additional element which must be added to the component tree to
 *                               support notifying the user
 * @private
 */

/**
 * Provides a method to alert the user of behavior for accessibility.
 *
 * ```
 * 	function Component () {
 *		const {announce, children} = useAnnounce();
 *
 *		return (
 *			<Base onClick={() => announce('Unusually important notification for accessibility')}>
 *				{children}
 *			</Base>
 *		);
 *	}
 * ```
 *
 * @returns {useAnnounceInterface}
 * @private
 */
function useAnnounce () {
	const ref = useRef(null);
	const announce = useCallback(message => {
		if (ref.current) {
			ref.current.announce(message);
		}
	}, [ref]);

	return {
		announce,
		children: <Announce ref={ref} />
	};
}

export default useAnnounce;
export {
	useAnnounce
};
