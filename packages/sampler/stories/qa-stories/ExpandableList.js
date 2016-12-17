import ExpandableList from '@enact/moonstone/ExpandableList';
import Button from '@enact/moonstone/Button';
import kind from '@enact/core/kind';
import {RadioControllerDecorator, RadioDecorator} from '@enact/ui/RadioDecorator';
import React from 'react';
import Selectable from '@enact/ui/Selectable';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';

const prop = {
	listArray: [['a', 'b', 'c'], ['c', 'd', 'e', 'f', 'g']]
};

class ExpandableListChildrenLengthUpdate extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			index: 0
		};
	}

	updateValue = () => {
		this.setState({
			index: 1 - this.state.index
		});
	}

	render () {
		return (
			<div>
				<Button onClick={this.updateValue}>update value</Button>
				<ExpandableList {...this.props}>
					{prop.listArray[this.state.index]}
				</ExpandableList>
			</div>
		);
	}
}

const SelectableExpandableList = Selectable(ExpandableList);
const GroupedExpandables = RadioControllerDecorator(
	kind({
		name: 'GroupedExpandables',
		propTypes: {
			active: React.PropTypes.string,
			onOpen: React.PropTypes.func
		},
		render: ({onOpen, active}) => (
			<div>
				<SelectableExpandableList title="First" name="first" active={active} onOpen={onOpen}>
					{['One', 'Two', 'Three']}
				</SelectableExpandableList>
				<SelectableExpandableList title="Second" name="second" active={active} onOpen={onOpen}>
					{['Fourth', 'Fifth', 'Sixth']}
				</SelectableExpandableList>
				<SelectableExpandableList title="Third" name="third" active={active} onOpen={onOpen}>
					{['Seventh', 'Eighth', 'Nineth']}
				</SelectableExpandableList>
			</div>
		)
	})
);

GroupedExpandables.displayName = 'GroupedExpandables';

storiesOf('ExpandableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with children length update',
		() => (
			<ExpandableListChildrenLengthUpdate
				autoClose={boolean('autoClose', false)}
				disabled={boolean('disabled', false)}
				noneText={text('noneText', 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				select={select('select', ['single', 'radio', 'multiple'], 'single')}
				title={text('title', 'title')}
			/>
		)
	)
	.addWithInfo(
		'grouped',
		`
Example

	const SelectableExpandableList = Selectable(ExpandableList);
	const GroupedExpandables = RadioControllerDecorator(
		kind({
			name: 'GroupedExpandables',
			propTypes: {
				active: React.PropTypes.string,
				onOpen: React.PropTypes.func
			},
			render: ({onOpen, active}) => (
				<div>
					<SelectableExpandableList title="First" name="first" active={active} onOpen={onOpen}>
						{['One', 'Two', 'Three']}
					</SelectableExpandableList>
					<SelectableExpandableList title="Second" name="second" active={active} onOpen={onOpen}>
						{['Fourth', 'Fifth', 'Sixth']}
					</SelectableExpandableList>
					<SelectableExpandableList title="Third" name="third" active={active} onOpen={onOpen}>
						{['Seventh', 'Eighth', 'Nineth']}
					</SelectableExpandableList>
				</div>
			)
		})
	);
		`,
		() => (
			<GroupedExpandables />
		)
	);
