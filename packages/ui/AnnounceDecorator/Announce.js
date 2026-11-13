import {checkPropTypes, setDefaultProps} from '@enact/core/util';
import PropTypes from 'prop-types';
import {useEffect, useImperativeHandle, useLayoutEffect, useRef} from 'react';

const announceDefaultProps = {
	// 500ms is somewhat arbitrary. Would like to do some further usability testing to determine
	// how frequently we should allow alerting. Should also consider if this timeout should be
	// "global" such that multiple instances of Announce respect each other.
	timeout: 500
};

/**
 * An unstyled component with an imperative API to alert the user.
 *
 * The `announce()` method should be used to alert the user of behavior for accessibility.
 *
 * Example:
 * ```
 * import {Announce} from '@enact/ui/AnnounceDecorator';
 * import {Component} from 'react';
 *
 * class Example extends Component {
 *   notify = () => {
 *     if (this.announce) {
 *       this.announce.announce('this text will be alerted to user by TTS');
 *     }
 *   }
 *
 *   setAnnounceRef = (announce) => {
 *     this.announce = announce;
 *   }
 *
 *   render () {
 *     <div>
 *       <button onClick={this.notify}>Notify on Click</button>
 *       <Announce ref={this.setAnnounceRef} />
 *     </div>
 *   }
 * }
 * ```
 *
 * @class Announce
 * @ui
 * @memberof ui/AnnounceDecorator
 * @public
 */
const Announce = (componentProps) => {
	const props = setDefaultProps(componentProps, announceDefaultProps);
	checkPropTypes(Announce, props);

	const {ref, ...rest} = props;
	delete rest.timeout;
	const alertRef = useRef(null);
	const alertTimeoutRef = useRef(null);
	const propsRef = useRef(props);

	useLayoutEffect(() => {
		propsRef.current = props;
	});

	useEffect(() => {
		return () => {
			if (alertTimeoutRef.current) {
				clearTimeout(alertTimeoutRef.current);
			}
		};
	}, []);

	useImperativeHandle(ref, () => ({
		get alert () {
			return alertRef.current;
		},

		/**
		 * Call to update the message for the alert.
		 *
		 * @method
		 * @memberof ui/AnnounceDecorator.Announce.prototype
		 * @param   {String}     message  Message to notify the user
		 * @param   {Boolean}    clear    Clears a previous message before setting the new message
		 * @returns {undefined}
		 * @public
		 */
		announce (message, clear = false) {
			if (clear) {
				if (alertTimeoutRef.current) {
					clearTimeout(alertTimeoutRef.current);
				}
				alertTimeoutRef.current = null;
				alertRef.current.removeAttribute('aria-label');
			}

			if (alertRef.current && !alertTimeoutRef.current && message) {
				alertRef.current.setAttribute('aria-label', message);
				alertTimeoutRef.current = setTimeout(() => {
					alertTimeoutRef.current = null;
					alertRef.current.removeAttribute('aria-label');
				}, propsRef.current.timeout);
			}
		}
	}), []);

	return (
		<span ref={alertRef} role="alert" {...rest} />
	);
};

Announce.displayName = 'Announce';

Announce.propTypes = /** @lends ui/AnnounceDecorator.Announce.prototype */ {
	/**
	 * Time, in milliseconds, to wait to remove the alert message.

	 * Subsequent updates to the
	 * message before the timeout are ignored.
	 *
	 * @type {Number}
	 * @default 500
	 * @public
	 */
	timeout: PropTypes.number
};

export default Announce;
export {
	Announce
};
