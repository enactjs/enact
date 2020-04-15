import useClass from '@enact/core/useClass';
import React from 'react';

import AnnounceComp from './Announce';

class Announce {
	constructor (ref) {
		this.ref = ref;
	}

	announce = (message) => {
		if (this.ref && this.ref.current) {
			this.ref.current.announce(message);
		}
	}
}

function useAnnouce () {
	const ref = React.useRef(null);
	const inst = useClass(Announce, ref);

	return {
		announce: inst.announce,
		children: <AnnounceComp ref={ref} />
	};
};

export default useAnnouce;
export {
	useAnnouce
};
