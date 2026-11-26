import {forward} from '@enact/core/handle';
import useHandlers from '@enact/core/useHandlers';
import hoc from '@enact/core/hoc';
import {checkPropTypes} from '@enact/core/util';
import PropTypes from 'prop-types';
import {useRef} from 'react';

import {startSignLang, stopSignLang} from './signLang';

const forwardBlur = forward('onBlur');
const forwardFocus = forward('onFocus');

const signLangDecoratorHandlers = {
	onFocus: (ev, props, {requestSignLang, signLangDelayIdRef}) => {
		forwardFocus(ev, props);
		requestSignLang({...props, active: true, signLangDelayIdRef});
	},
	onBlur: (ev, props, {requestSignLang, signLangDelayIdRef}) => {
		forwardBlur(ev, props);
		requestSignLang({...props, active: false, signLangDelayIdRef});
	}
};

/**
 * Default config for {@link webos/signLang.SignLangDecorator}
 *
 * @type {Object}
 * @hocconfig
 * @memberof webos/signLang.SignLangDecorator
 */
const defaultConfig = {
	/**
	 * Time to wait (in milliseconds) before calling Sign Language API.
	 *
	 * @type {Number}
	 * @default 0
	 * @memberof webos/signLang.SignLangDecorator.defaultConfig
	 * @public
	 */
	signLangDelay: 0
};

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
const SignLangDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {signLangDelay} = config;

	const requestSignLang = ({active, signLangDelayIdRef, signLangId = '', signLangOption = {}}) => {
		if (signLangId.length > 0) {
			if (active) {
				if (signLangDelay === 0) {
					startSignLang(signLangId, signLangOption);
				} else {
					clearTimeout(signLangDelayIdRef.current);
					signLangDelayIdRef.current = setTimeout(() => {
						startSignLang(signLangId, signLangOption);
					}, signLangDelay);
				}
			} else {
				if (signLangDelay > 0) clearTimeout(signLangDelayIdRef.current);
				stopSignLang(signLangId, signLangOption);
			}
		}
	};

	// eslint-disable-next-line no-shadow
	const SignLangDecorator = (props) => {
		checkPropTypes(SignLangDecorator, props);

		const signLangDelayIdRef = useRef(null);
		const handlers = useHandlers(signLangDecoratorHandlers, props, {requestSignLang, signLangDelayIdRef});

		const wrappedProps = Object.assign({}, props);
		delete wrappedProps.onBlur;
		delete wrappedProps.onFocus;
		delete wrappedProps.signLangId;
		delete wrappedProps.signLangOption;

		return (
			<Wrapped
				{...wrappedProps}
				{...handlers}
			/>
		);
	};

	SignLangDecorator.displayName = 'SignLangDecorator';
	SignLangDecorator.propTypes = /** @lends webos/signLang.SignLangDecorator.prototype */ {
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

	return SignLangDecorator;
});

export default SignLangDecorator;
export {SignLangDecorator};
