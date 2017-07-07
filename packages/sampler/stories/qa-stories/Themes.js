import Button, {ButtonBase} from '@enact/moonstone/Button';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, select} from '@kadira/storybook-addon-knobs';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

// Set up some defaults for info and knobs
const prop = {
	themes: {'moonstone': 'Moonstone', 'aqua': 'Aqua', 'car': 'Car', 'material': 'Material'}
};

storiesOf('Themes')
	.addDecorator(withKnobs)
	.addWithInfo(
		'All',
		() => (
			<div className="themes">
				<p className="row">
					This demonstrates the ease with which themes can be applied to components, simply by adding a class to the parent element.
				</p>

				<div className={'theme ' + select('theme', prop.themes, 'moonstone')}>
					<Divider>Moonstone Theme</Divider>
					<p>Parent class name: <code>moonstone</code></p>
					<div className="row">
						<Button>Normal</Button>
						<Button disabled>Disabled</Button>
					</div>
				</div>

				<div className="theme aqua">
					<Divider>Aqua Interface Theme</Divider>
					<p>Parent class name: <code>aqua</code></p>
					<div className="row">
						<Button preserveCase>Normal</Button>
						<Button preserveCase small>Aqua</Button>
						<Button preserveCase disabled>Disabled</Button>
					</div>
				</div>

				<div className="theme car">
					<Divider>Car Interface Theme</Divider>
					<p>Parent class name: <code>car</code></p>
					<div className="row">
						<Button>Normal</Button>
						<Button>Car</Button>
						<Button>Button</Button>
						<Button disabled>Disabled</Button>
					</div>
				</div>

				<div className="theme material">
					<Divider>Material Design</Divider>
					<p>Parent class name: <code>material</code></p>
					<div className="row">
						<Button preserveCase>Normal</Button>
						<Button preserveCase>Material</Button>
						<Button preserveCase disabled>Disabled</Button>
					</div>
				</div>
			</div>
		)
	);
