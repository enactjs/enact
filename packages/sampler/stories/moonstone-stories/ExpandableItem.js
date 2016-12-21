import {ExpandableItem, ExpandableItemBase} from '@enact/moonstone/ExpandableItem';
import Icon from '@enact/moonstone/Icon';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

ExpandableItem.propTypes = Object.assign({}, ExpandableItemBase.propTypes, ExpandableItem.propTypes);
ExpandableItem.defaultProps = Object.assign({}, ExpandableItemBase.defaultProps, ExpandableItem.defaultProps);
ExpandableItem.displayName = 'ExpandableItem';

storiesOf('ExpandableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableItem',
		() => (
			<ExpandableItem
				autoClose={boolean('autoClose', false)}
				disabled={boolean('disabled', false)}
				label={text('label', 'label')}
				lockBottom={boolean('lockBottom', false)}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				showLabel={select('showLabel', ['always', 'never', 'auto'], 'auto')}
				title={text('title', 'title')}
			>
				<Item>
					This can be any type of content you might want to
					render inside a labeled expandable container
				</Item>
				<Item>
					<Icon>star</Icon> You could include other components as well <Icon>star</Icon>
				</Item>
			</ExpandableItem>
		)
	);
