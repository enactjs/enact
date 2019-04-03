import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {forward} from '@enact/core/handle';
import {Job} from '@enact/core/util';
import Spotlight from '@enact/spotlight';

class ReplaceableOnFocus extends React.PureComponent {
	static displayName = 'ReplaceableOnFocus'

	static propTypes = {
		disabled: PropTypes.bool,
		initialComponent: PropTypes.func,
		updatedComponent: PropTypes.func
	}

	static defaultProps = {
		disabled: false
	}

	constructor (props) {
		super(props);

		this.state = {
			updated: false
		};
		this.shouldPreventFocus = false;
	}

	componentDidUpdate (prevProps, prevState) {
		if (!prevState.updated && this.state.updated && !Spotlight.getCurrent()) {
			// eslint-disable-next-line react/no-find-dom-node
			ReactDOM.findDOMNode(this).focus();
		}
	}

	componentWillUnmount () {
		this.renderJob.stop();
	}

	handleBlur = (ev) => {
		forward('onBlur', ev, this.props);
		this.shouldPreventFocus = false;
		this.renderJob.stop();
	}

	handleFocus = (ev) => {
		if (this.shouldPreventFocus) {
			ev.preventDefault();
			ev.stopPropagation();
			this.shouldPreventFocus = false;
			return;
		}

		if (this.state.updated) {
			forward('onFocus', ev, this.props);
		} else {
			this.shouldPreventFocus = true;
			this.startRenderJob();
		}
	}

	handleMouseEnter = (ev) => {
		if (this.state.updated) {
			forward('onMouseEnter', ev, this.props);
		} else {
			this.startRenderJob();
		}
	}

	handleMouseLeave = (ev) => {
		forward('onMouseLeave', ev, this.props);
		this.renderJob.stop();
	}

	startRenderJob = () => {
		// 100 is a somewhat arbitrary value to avoid rendering when 5way hold events are moving focus through the item.
		// The timing appears safe against default spotlight accelerator speeds.
		this.renderJob.startAfter(100);
	}

	renderJob = new Job(() => {
		this.setState({
			updated: true
		});
	})

	render () {
		const {initialComponent, updatedComponent, ...rest} = this.props;
		const Component = this.state.updated ? updatedComponent : initialComponent;
		return (
			<Component
				{...rest}
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
			/>
		);
	}
}

export default ReplaceableOnFocus;
export {
	ReplaceableOnFocus
};
