import React from 'react';

import {MarqueeText} from '@enact/moonstone/Marquee';
import Button from '@enact/moonstone/Button';

const MarqueeStartStop = class extends React.Component {
	static displayName: 'MarqueeStartStop'

	constructor (props) {
		super(props);
	}

	startMarquee = () => {
		this.node.startAnimation();
	}

	stopMarquee = () => {
		this.node.cancelAnimation();
	}

	getNode = (node) => {
		this.node = node;
	}

	render () {
		return (
			<div>
				<MarqueeText ref={this.getNode} style={{width: '400px'}}>
					The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.
				</MarqueeText>
				<Button onClick={this.startMarquee}>Start</Button>
				<Button onClick={this.stopMarquee}>Stop</Button>
			</div>
		);
	}
};

export default MarqueeStartStop;
export {MarqueeStartStop as MarqueeStartStop};
