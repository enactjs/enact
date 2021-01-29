import {addDecorator} from '@storybook/react';
import {configureActions} from '@enact/storybook-utils/addons/actions';
import {withKnobs} from '@enact/storybook-utils/addons/knobs';
import {DocsPage, DocsContainer} from '@enact/storybook-utils/addons/docs';
import { themes } from '@storybook/theming';

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
