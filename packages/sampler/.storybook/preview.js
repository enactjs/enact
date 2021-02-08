import {configureActions} from '@enact/storybook-utils/addons/actions';
import {DocsPage, DocsContainer} from '@enact/storybook-utils/addons/docs';
import {withKnobs} from '@enact/storybook-utils/addons/knobs';
import {addDecorator} from '@storybook/react';
import {themes} from '@storybook/theming';

import Environment from '../src/Environment';

configureActions();
addDecorator(withKnobs);
export const parameters = {
	knobs: {
		timestamps: true,
	},
	docs: {
		container: DocsContainer,
		page: DocsPage,
		iframeHeight: 300,
		theme: themes.light
	}
};
export const decorators = [Environment];
