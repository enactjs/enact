import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {forward} from '@enact/core/handle';
import {Job, perfNow} from '@enact/core/util';
import {getDirection, Spotlight} from '@enact/spotlight';

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

	componentDidMount () {
		this.mountTime = perfNow();
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

		forward('onFocus', ev, this.props);

		// 100 is arbitrary - it accounts for when the component is focused on render, requiring an update
		// that can't be driven by onKeyUp
		if (Spotlight.getPointerMode() || !this.state.updated && perfNow() - this.mountTime < 100) {
			this.shouldPreventFocus = true;
			this.startRenderJob();
		}
	}

	handleKeyUp = (ev) => {
		forward('onKeyUp', ev, this.props);

		if (getDirection(ev.keyCode) && !this.state.updated) {
			this.startRenderJob();
		}
	}

	startRenderJob = () => {
		// 100 is a somewhat arbitrary value to avoid rendering when 5way hold events are moving focus through the item.
		// There are cases where a greater number is desired - when 5way is pressed in a direction that results in a minor
		// scroll into view. Using 100 in a VirtualListNative scenario, the component can update prior to the scroll
		// stopping, causing a scroll interruption (TV-only).
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
				onKeyUp={this.handleKeyUp}
			/>
		);
	}
}

export default ReplaceableOnFocus;
export {
	ReplaceableOnFocus
};
