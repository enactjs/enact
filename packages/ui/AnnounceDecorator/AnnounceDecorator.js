/**
 * Provides components to assist in notifying the user through ARIA alerts.
 *
 * @module ui/AnnounceDecorator
 * @exports Announce
 * @exports AnnounceDecorator
 */

import Announce from './Announce';
import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Default config for {@link ui/AnnounceDecorator.AnnounceDecorator}.
 *
 * @memberof ui/AnnounceDecorator.AnnounceDecorator
 * @hocconfig
 * @private
 */
const defaultConfig = {
	/**
	 * Configures the prop name to pass the announce function.
	 *
	 * @type {String}
	 * @default 'announce'
	 * @memberof ui/AnnounceDecorator.AnnounceDecorator.defaultConfig
	 */
	prop: 'announce'
};

/**
 * Provides a function to its wrapped component which can be called to alert the user for
 * accessibility notifications.
 *
 * By default, the function is passed in the `announce` prop but may be customized by specifying the
 * `prop` config member.
 *
 * Example:
 * ```
 * import AnnounceDecorator from '@enact/ui/AnnounceDecorator';
 * import React from 'react';
 *
 * const Example = AnnounceDecorator(class extends React.Component {
 *   static propTypes = {
 *     // passed by AnnounceDecorator
 *     announce: PropTypes.func
 *   }
 *
 *   notify = () => {
 *     const {announce} = this.props;
 *     announce('this text will be alerted to user by TTS');
 *   }
 *
 *   render () {
 *     <div>
 *       <button onClick={this.notify}>Notify on Click</button>
 *     </div>
 *   }
 * });
 * ```
 *
 * @class AnnounceDecorator
 * @memberof ui/AnnounceDecorator
 * @hoc
 * @public
 */
const AnnounceDecorator = hoc(defaultConfig, ({prop}, Wrapped) => {
	return class extends React.Component {
		static displayName = 'AnnounceDecorator'

		static propTypes = /** @lends ui/AnnounceDecorator.AnnounceDecorator.prototype */ {
			/**
			 * The wrapped component's children.
			 *
			 * An instance of {@link ui/AnnounceDecorator.Announce} will be appended to `children`.
			 *
			 * @type {Node}
			 * @public
			 */
			children: PropTypes.node
		}

		announce = (message) => {
			if (this.announceRef) {
				this.announceRef.announce(message);
			}
		}

		setAnnounceRef = (node) => {
			this.announceRef = node;
		}

		render () {
			const {children, ...rest} = this.props;

			rest[prop] = this.announce;

			return (
				<Wrapped {...rest}>
					{children}
					<Announce ref={this.setAnnounceRef} />
				</Wrapped>
			);
		}
	};
});

export default AnnounceDecorator;
export {
	Announce,
	AnnounceDecorator
};
