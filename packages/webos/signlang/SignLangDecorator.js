import {Component} from 'react';
import PropTypes from 'prop-types';
import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import signLang from './signLang';

/**
 * SignLangDecorator is a higher-order component that adds feature for sign language
 * to its wrapped component.
 *
 *
 * Usage:
 * ```
 * import {Component} from 'react';
 * import Button from '@enact/sandstone/Button';
 * import { SignLangDecorator } from '@enact/webos/signlang';
 *
 * const SignLangButton = SignLangDecorator(Button);
 *
 * class Sample extends Component {
 *   render () {
 *     return(
 *       <div>
 *         <SignLangButton signLangId="settings_audioguide_1">Hello</SignLangButton>
 *       </div>
 *     );
 *   }
 * }
 * ```
 *
 * @class SignLangDecorator
 * @memberof webos/signlang
 * @hoc
 * @public
 */

const defaultConfig = {
	signLangDelay: 0
};

const SignLangDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {signLangDelay} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');

	return class extends Component {
		static displayName = 'SignLangDecorator';

		static propTypes = /** @lends webos/signlang.SignLangDecorator.prototype */ {
			/**
             * Unique string used in sign language.
             *
             * @type {String}
             * @public
             */
			signLangId: PropTypes.string,

			/**
             * Additional option for sign language
             *
             * @type {Object}
             * @public
             */
			signLangOption: PropTypes.object
		};

		constructor (props) {
			super(props);

			this.signLangDelayId = null;
		}

		requestSignLang = (focusOut) => {
			const {signLangId, signLangOption = {}} = this.props;

			if (typeof signLangId == 'string' && signLangId.length > 0) signLang(signLangId, focusOut, signLangOption);
		};

		onFocus = (ev) => {
			forwardFocus(ev, this.props);

			if (signLangDelay === 0) {
				this.requestSignLang(false);
			} else {
				clearTimeout(this.signLangDelayId);
				this.signLangDelayId = setTimeout(() => {
					this.requestSignLang(false);
				}, signLangDelay);
			}
		};

		onBlur = (ev) => {
			forwardBlur(ev, this.props);

			if (signLangDelay > 0) clearTimeout(this.signLangDelayId);

			this.requestSignLang(true);
		};

		render () {
			const props = Object.assign({}, this.props);
			delete props.onFocus;
			delete props.onBlur;
			delete props.signLangId;
			delete props.signLangDelay;
			delete props.signLangOption;

			return (
				<Wrapped
					{...props}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
				/>
			);
		}
	};
});

export default SignLangDecorator;
export {SignLangDecorator};
