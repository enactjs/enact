import React from 'react';
import PropTypes from 'prop-types';
import Button from '@enact/moonstone/Button';


class ScrollerResizableItem extends React.Component {

	render () {
		const height = this.props.more ? 1500 : 400;
		const text = this.props.more ? 'less' : 'more';
		return (
			<div style={{position: 'relative', width: '90%', height: height, border: 'solid 3px yellow'}}>
				<Button small style={{position: 'absolute', bottom: 0}} onClick={this.props.toggleMore}>{text}</Button>
			</div>
		);
	}
}

ScrollerResizableItem.propTypes = {
	more: PropTypes.bool,
	toggleMore: PropTypes.func
};

export default ScrollerResizableItem;
