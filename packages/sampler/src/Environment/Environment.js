// Environment

import classnames from 'classnames';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import BodyText from '@enact/ui/BodyText';
import {Column, Cell} from '@enact/ui/Layout';

import css from './Environment.module.less';

const PanelsBase = kind({
	name: 'EnvironmentPanels',

	propTypes: {
		description: PropTypes.string,
		title: PropTypes.string
	},

	styles: {
		css,
		className: 'environmentPanels enact-fit enact-unselectable'
	},

	render: ({children, description, title, ...rest}) => (
		<Column {...rest}>
			<Cell component={BodyText} className={css.header} shrink>{title}</Cell>
			{description ? (
				<Cell shrink component={BodyText} className={css.description}>{description}</Cell>
			) : null}
			<Cell component="section">{children}</Cell>
		</Column>
	)
});

const StorybookDecorator = (story, config) => {
	// Executing `story` here allows the story controls to register and render before the global variable below.
	const sample = story();

	const {globals} = config;

	const hasText = config.parameters && config.parameters.info && config.parameters.info.text;

	// NOTE: The properties of globals are only defined by string type.
	const classes = {
		aria: JSON.parse(globals['debug aria']),
		layout: JSON.parse(globals['debug layout']),
		spotlight: JSON.parse(globals['debug spotlight'])
	};
	if (Object.keys(classes).length > 0) {
		classes.debug = true;
	}

	return (
		<PanelsBase
			className={classnames(classes)}
			title={`${config.kind}`.replace(/\//g, ' ').trim()}
			description={hasText ? config.parameters.info.text : null}
			locale={globals.locale}
			style={{
				'--env-background': globals.background === 'default' ? '' : globals.background
			}}
			{...config.panelsProps}
		>
			{sample}
		</PanelsBase>
	);
};

export default StorybookDecorator;
export {StorybookDecorator};
