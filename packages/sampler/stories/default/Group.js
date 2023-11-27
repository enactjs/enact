import kind from '@enact/core/kind';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/controls';
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

// Set up some defaults for info and controls
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
			inline: args['childComponent'] === 'SlotItem' ? args['ItemProps-Inline'] : null
		}}
		select={args['select']}
		selectedProp="selected"
		defaultSelected={0}
		onSelect={action('onSelect')}
	>
		{['Item 1', 'Item 2', 'Item 3']}
	</Group>
);

select('childComponent', _Group, Object.keys(prop.children), Group, 'Button');
boolean('ItemProps-Inline', _Group, Group);
select('select', _Group, ['single', 'radio', 'multiple'], Group, 'radio');

_Group.parameters = {
	info: {
		text: 'Basic usage of Group'
	}
};
