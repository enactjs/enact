import React from 'react';

/**
 * {@link ui/AnnounceDecorator.Announce} provides an imperative API, `announce`, to alert the user
 * of behavior for accessibility.
 *
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
		 * Time, in milliseconds, to wait to remove the alert message
		 *
		 * @type {Number}
		 * @default 16
		 * @public
		 */
		timeout: React.PropTypes.number
	}

	static defaultProps = {
		timeout: 16
	}

	componentWillUnmount () {
		this.clearTimeout();
	}

	clearTimeout () {
		if (this.alertTimeout) {
			clearTimeout(this.alertTimeout);
		}
	}

	resetAlert = () => {
		this.alertTimeout = null;
		this.alert.removeAttribute('aria-label');
	}

	/*
	 * Call to update the message for the alert
	 *
	 * @param   {String}     message  Message to notify the user
	 * @returns {undefined}
	 * @public
	 */
	announce = (message) => {
		if (this.alert) {
			this.alert.setAttribute('aria-label', message);
			this.clearTimeout();
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
