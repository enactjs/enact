import kind from '@enact/core/kind';
import {action} from '@enact/storybook-utils/addons/actions';
import Button from '@enact/ui/Button';
import Item from '@enact/ui/Item';
import Group from '@enact/ui/Group';
import {SlotItem as UISlotItem} from '@enact/ui/SlotItem';
import PropTypes from 'prop-types';

import css from './Group.module.less';

const SlotItem = kind({
	name: 'SlotItem',

	propTypes: {
		selected: PropTypes.bool
	},

	defaultProps: {
		selected: false
	},

	styles: {
		css,
		className: 'slotItem'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({children, ...rest}) => (
		<UISlotItem {...rest} component={Item}>
			{children}
		</UISlotItem>
	)
});

// Set up some defaults for info and knobs
const prop = {
	children: {
		Button: Button,
		SlotItem: SlotItem
	}
};

const getComponent = (name) => prop.children[name];

Group.displayName = 'Group';

export default {
	title: 'UI/Group',
	component: 'Group'
};

export const _Group = (args) => (
	<Group
		childComponent={getComponent(args['childComponent'])}
		className={css.group}
		itemProps={{
			css,
			inline: args['ItemProps-Inline']
		}}
		select={args['select']}
		selectedProp="selected"
		defaultSelected={0}
		onSelect={action('onSelect')}
	>
		{['Item 1', 'Item 2', 'Item 3']}
	</Group>
);

_Group.parameters = {
	info: {
		text: 'Basic usage of Group'
	}
};

_Group.args = {
	'childComponent': 'Button',
	'ItemProps-Inline': false,
	'select': 'radio'
};

_Group.argTypes = {
	'childComponent': {
		options: Object.keys(prop.children),
		control: {
			type: 'select'
		}
	},
	'select': {
		options: ['single', 'radio', 'multiple'],
		control: {
			type: 'select'
		}
	}
};
