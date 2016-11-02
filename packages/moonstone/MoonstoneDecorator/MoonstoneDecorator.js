import {addCancelHandler, removeCancelHandler} from '@enact/ui/Cancelable';
import {forKeyCode} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import I18nDecorator from '@enact/i18n/I18nDecorator';
import React from 'react';
import {ResolutionDecorator} from '@enact/ui/resolution';
import {SpotlightRootDecorator} from '@enact/spotlight';
import {PortalDecorator} from '../Portal';

import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.less';

const defaultConfig = {
	cancelHandler: forKeyCode(461),
	i18n: true,
	portal: true,
	ri: {
		screenTypes
	},
	spotlight: true
};

const MoonstoneDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {ri, i18n, spotlight, portal, cancelHandler} = config;
	let App = Wrapped;

	if (portal) App = PortalDecorator(App);
	if (cancelHandler) addCancelHandler(cancelHandler);
	if (ri) App = ResolutionDecorator(ri, App);
	if (i18n) App = I18nDecorator(App);
	if (spotlight) App = SpotlightRootDecorator(App);

	return class extends React.Component {
		static displayName = 'MoonstoneDecorator';

		componentDidMount () {
			if (cancelHandler) {
				addCancelHandler(cancelHandler);
			}
		}

		componentWillUnmount () {
			if (cancelHandler) {
				removeCancelHandler(cancelHandler);
			}
		}

		render () {
			let className = `${css.moon} enact-fit enact-unselectable`;
			if (this.props.className) {
				className += ` ${this.props.className}`;
			}

			return (
				<App {...this.props} className={className} />
			);
		}
	};
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
