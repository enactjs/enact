import PropTypes from 'prop-types';
import React from 'react';

/**
 * An unstyled component with an imperative API to alert the user.
 *
 * The `announce()` method should be used to alert the user of behavior for accessibility.
 *
 * Example:
 * ```
 * import {Announce} from '@enact/ui/AnnounceDecorator';
 * import React from 'react';
 *
 * class Example extends React.Component {
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
 * @memberof ui/AnnounceDecorator
 * @public
 */
const Announce = class extends React.Component {
	static displayName = 'Announce'

	static propTypes = /** @lends ui/AnnounceDecorator.Announce.prototype */ {
		/**
		 * Time, in milliseconds, to wait to remove the alert message. Subsequent updates to the
		 * message before the timeout are ignored.
		 *
		 * @type {Number}
		 * @default 500
		 * @public
		 */
		timeout: PropTypes.number
	}

	static defaultProps = {
		// 500ms is somewhat arbitrary. Would like to do some further usability testing to determine
		// how frequently we should allow alerting. Should also consider if this timeout should be
		// "global" such that multiple instances of Announce respect each other.
		timeout: 500
	}

	componentWillUnmount () {
		if (this.alertTimeout) {
			clearTimeout(this.alertTimeout);
		}
	}

	resetAlert = () => {
		this.alertTimeout = null;
		this.alert.removeAttribute('aria-label');
	}

	/**
	 * Call to update the message for the alert.
	 *
	 * @method
	 * @param   {String}     message  Message to notify the user
	 * @returns {undefined}
	 * @public
	 */
	announce = (message) => {
		if (this.alert && !this.alertTimeout && message) {
			this.alert.setAttribute('aria-label', message);
			this.alertTimeout = setTimeout(this.resetAlert, this.props.timeout);
		}
	}

	setAlertRef = (node) => {
		this.alert = node;
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.timeout;

		return (
			<span ref={this.setAlertRef} role="alert" {...props} />
		);
	}
};

export default Announce;
export {
	Announce
};
