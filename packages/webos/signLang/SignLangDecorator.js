import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import {Component} from 'react';

import {startSignLang, stopSignLang} from './signLang';

/**
 * Usage:
 * ```
 * import Button from '@enact/sandstone/Button';
 * import {SignLangDecorator} from '@enact/webos/signLang';
 * import {Component} from 'react';
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
 * SignLangDecorator is a higher order component that adds feature for sign language
 * to its wrapped component.
 *
 * @class SignLangDecorator
 * @memberof webos/signLang
 * @hoc
 * @public
 */

const defaultConfig = {
	/**
     * Add delay to call sign language API.
     *
     * @type {Number}
     * @public
     */
	signLangDelay: 0
};

const SignLangDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {signLangDelay} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');

	return class extends Component {
		static displayName = 'SignLangDecorator';

		static propTypes = /** @lends webos/signLang.SignLangDecorator.prototype */ {
			/**
             * Unique ID for sign language.
             *
             * @type {String}
             * @public
             */
			signLangId: PropTypes.string,

			/**
             * Additional option for sign language.
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

		requestSignLang = (active) => {
			const {signLangId = '', signLangOption = {}} = this.props;

			if (signLangId.length > 0) {
				if (active) {
					if (signLangDelay === 0) {
						startSignLang(signLangId, signLangOption);
					} else {
						clearTimeout(this.signLangDelayId);
						this.signLangDelayId = setTimeout(() => {
							startSignLang(signLangId, signLangOption);
						}, signLangDelay);
					}
				} else {
					if (signLangDelay > 0) clearTimeout(this.signLangDelayId);
					stopSignLang(signLangId, signLangOption);
				}
			}
		};

		onFocus = (ev) => {
			forwardFocus(ev, this.props);
			this.requestSignLang(true);
		};

		onBlur = (ev) => {
			forwardBlur(ev, this.props);
			this.requestSignLang(false);
		};

		render () {
			const props = Object.assign({}, this.props);
			delete props.onFocus;
			delete props.onBlur;
			delete props.signLangId;
			delete props.signLangOption;

			return (
				<Wrapped
					{...props}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
				/>
			);
		}
	};
});

export default SignLangDecorator;
export {SignLangDecorator};
