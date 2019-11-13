import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';

const MinimizeControllerContext = React.createContext();

const MinimizeController = hoc((config, Wrapped) => {
	class Controller extends React.Component {
		static displayName = 'MinimizeController'

		constructor (props) {
			super(props);

			const {onMaximize, onMinimize} = this.props;

			this.childContext = {
				onMaximize: onMaximize,
				onMinimize: onMinimize,
				onScroll: this.onScroll
			};
		}

		resizeOnScroll = ({scrollTop}) => {
			const {onMaximize, onMinimize} = this.props;

			if (scrollTop > config.moveDistance) {
				onMinimize();
			} else {
				onMaximize();
			}
		}

		scrollJob = new Job(this.resizeOnScroll);

		onScroll = (ev) => {
			this.scrollJob.throttle(ev);
		}

		render () {
			const props = this.props;

			return (
				<MinimizeControllerContext.Provider value={this.childContext}>
					<Wrapped {...props} />
				</MinimizeControllerContext.Provider>
			);
		}
	}

	return Toggleable({
		activate: 'onMinimize',
		deactivate: 'onMaximize',
		prop: 'minimized'
	}, Controller);
});

export default MinimizeController;
export {
	MinimizeController,
	MinimizeControllerContext
};
