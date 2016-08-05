import {kind, hoc} from 'enyo-core';
import I18NDecorator from 'enyo-i18n/I18NDecorator';
import {SpotlightRootDecorator} from 'enyo-spotlight';
import {ResolutionDecorator} from 'enyo-ui/resolution';
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
	if (config.i18n) App = I18NDecorator(App);
	if (config.spotlight) App = SpotlightRootDecorator(App);

	return kind({
		name: 'MoonstoneDecorator',

		styles: {
			css,
			classes: 'moon enyo-fit enyo-unselectable'
		},

		render: ({classes, ...rest}) => (
			<App {...rest} className={classes} />
		)
	});
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
