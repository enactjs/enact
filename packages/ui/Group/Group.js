import R from 'ramda';
import React, {PropTypes} from 'react';
import kind from 'enact-core/kind';

import Repeater from '../Repeater';

import {GroupItem, pickGroupItemProps} from './GroupItem';

const Group = kind({
	name: 'Group',

	propTypes: {
		...Repeater.propTypes,
		onActivate: PropTypes.func.isRequired,
		activate: PropTypes.string,
		index: PropTypes.number,
		selectedProp: PropTypes.string
	},

	defaultProps: {
		...Repeater.defaultProps,
		activate: 'onClick',
		selectedProp: 'data-selected',
		index: 0
	},

	computed: {
		itemProps: R.converge(R.merge, [
			pickGroupItemProps,
			R.prop('itemProps')
		])
	},

	render: (props) => {
		delete props.onActivate;
		delete props.activate;
		delete props.index;
		delete props.selectedProp;

		return <Repeater {...props} type={GroupItem} />;
	}
});

export default Group;
export {Group, Group as GroupBase, GroupItem};
