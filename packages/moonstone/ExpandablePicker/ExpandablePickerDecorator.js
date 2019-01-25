import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';

const ExpandablePickerDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars

	return class extends React.Component {
		static displayName = 'ExpandablePickerDecorator'

		static propTypes = {
			open: PropTypes.bool,
			value: PropTypes.number
		}

		constructor (props) {
			super(props);

			this.state = {
				open: false,
				value: props.value
			};
		}

		handle = handle.bind(this);

		handleClose = () => this.handle(
			forward('onClose'),
			(ev, {value}) => this.setState({open: false})
		);

		handleOpen = this.handle(
			forward('onOpen'),
			(ev, {value}) => this.setState({open: true, value})
		);

		handlePick = (ev) => {
			this.setState({
				value: ev.value
			});
		}

		render () {
			const {value} = this.state.open ? this.state : this.props;

			return (
				<Wrapped {...this.props} onClose={this.handleClose} onOpen={this.handleOpen} onPick={this.handlePick} value={value} />
			);
		}
	};
});

export default ExpandablePickerDecorator;
export {ExpandablePickerDecorator};
