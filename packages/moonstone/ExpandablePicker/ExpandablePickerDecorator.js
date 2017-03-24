import hoc from '@enact/core/hoc';
import React from 'react';

const ExpandablePickerDecorator = hoc((config, Wrapped) => {

	return class extends React.Component {
		static displayName = 'ExpandablePickerDecorator'

		static propTypes = {
			open: React.PropTypes.bool,
			value: React.PropTypes.number
		}

		constructor (props) {
			super(props);

			this.state = {
				value: props.value
			};
		}

		componentWillReceiveProps (nextProps) {
			let {value} = this.state;

			// if opening or the props value has changed, use it
			if (!this.props.open && nextProps.open || this.props.value !== nextProps.value) {
				value = nextProps.value;
			}

			this.setState({
				value
			});
		}

		handlePick = (ev) => {
			this.setState({
				value: ev.value
			});
		}

		render () {
			const {value} = this.props.open ? this.state : this.props;

			return (
				<Wrapped {...this.props} onPick={this.handlePick} value={value} />
			);
		}
	};
});

export default ExpandablePickerDecorator;
export {ExpandablePickerDecorator};
