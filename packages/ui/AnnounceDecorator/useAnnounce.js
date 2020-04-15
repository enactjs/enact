import React from 'react';

import Announce from './Announce';

function useAnnouce () {
	const ref = React.useRef(null);
	const announce = React.useCallback(message => {
		if (ref && ref.current) {
			ref.current.announce(message);
		}
	}, [ref]);

	return {
		announce,
		children: <Announce ref={ref} />
	};
}

export default useAnnouce;
export {
	useAnnouce
};
