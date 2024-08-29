import {Component} from 'react';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import {startSignLang, stopSignLang} from './signLang';

/**
 * Usage:
 * ```
 * import {Component} from 'react';
 * import Button from '@enact/sandstone/Button';
 * import {SignLangDecorator} from '@enact/webos/signLang';
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
 * SignLangDecorator is a higher-order component that adds feature for sign language
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
             * Unique ID for request sign language.
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
			if (signLangDelay > 0) clearTimeout(this.signLangDelayId);
			this.requestSignLang(false);
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
