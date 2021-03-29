/**
 * Provides components to assist in notifying the user through ARIA alerts.
 *
 * @module ui/AnnounceDecorator
 * @exports Announce
 * @exports AnnounceDecorator
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';

import Announce from './Announce';
import useAnnounce from './useAnnounce';

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
 * A higher-order component that provides a function to its wrapped component which can be
 * called to alert the user for accessibility notifications.
 *
 * By default, the function is passed in the `announce` prop but may be customized by specifying the
 * `prop` config member. In addition to the configured prop, this HoC also adds an additional child
 * component to the passed `children` prop.
 *
 * Example:
 * ```
 * import AnnounceDecorator from '@enact/ui/AnnounceDecorator';
 * import {Component} from 'react';
 *
 * const Example = AnnounceDecorator(class extends Component {
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
	// eslint-disable-next-line no-shadow
	function AnnounceDecorator ({children, ...rest}) {
		const announce = useAnnounce();

		if (prop) rest[prop] = announce.announce;

		return (
			<Wrapped {...rest}>
				{children}
				{announce.children}
			</Wrapped>
		);
	}

	AnnounceDecorator.propTypes = /** @lends ui/AnnounceDecorator.AnnounceDecorator.prototype */ {
		/**
		 * The wrapped component's children.
		 *
		 * An instance of {@link ui/AnnounceDecorator.Announce} will be appended to `children`.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node
	};

	return AnnounceDecorator;
});

export default AnnounceDecorator;
export {
	Announce,
	AnnounceDecorator,
	useAnnounce
};
