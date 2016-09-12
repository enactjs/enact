import {kind, hoc} from 'enact-core';
import I18nDecorator from 'enact-i18n/I18nDecorator';
import {SpotlightRootDecorator} from 'enact-spotlight';
import {ResolutionDecorator} from 'enact-ui/resolution';
import React from 'react';

import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.less';

const defaultConfig = {
	i18n: true,
	ri: {
		screenTypes
	},
	spotlight: true
};

const MoonstoneDecorator = hoc(defaultConfig, (config, Wrapped) => {
	let App = Wrapped;

	if (config.ri) App = ResolutionDecorator(config.ri, App);
	if (config.i18n) App = I18nDecorator(App);
	if (config.spotlight) App = SpotlightRootDecorator(App);

	return kind({
		name: 'MoonstoneDecorator',

		styles: {
			css,
			className: 'moon enact-fit enact-unselectable'
		},

		render: (props) => (
			<App {...props} />
		)
	});
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
