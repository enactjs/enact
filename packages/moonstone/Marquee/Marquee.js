/**
 * Provides components for displaying and controlling marqueed text.
 *
 * @see ui/Marquee
 * @module moonstone/Marquee
 * @exports Marquee
 * @exports MarqueeBase
 * @exports MarqueeController
 * @exports MarqueeDecorator
 */

import {
	controlContextTypes,
	Marquee,
	MarqueeBase,
	MarqueeController,
	MarqueeDecorator
} from '@enact/ui/Marquee';

export default Marquee;
export {
	controlContextTypes,

	/**
	 * A block element which will marquee its contents
	 *
	 * @see ui/Marquee.Marquee
	 * @class Marquee
	 * @memberof moonstone/Marquee
	 * @public
	 */
	Marquee,

	/**
	 * Internal component to provide marquee markup
	 *
	 * @see ui/Marquee.Marquee
	 * @class Marquee
	 * @memberof moonstone/Marquee
	 * @public
	 */
	MarqueeBase,

	/**
	 * Adds ability to control descendant marquee instances to a component
	 *
	 * @see ui/Marquee.MarqueeController
	 * @hoc
	 * @name MarqueeController
	 * @memberof moonstone/Marquee
	 * @public
	 */
	MarqueeController,

	/**
	 * Adds marquee behavior to a component
	 *
	 * @see ui/Marquee.MarqueeDecorator
	 * @hoc
	 * @name MarqueeDecorator
	 * @memberof moonstone/Marquee
	 * @public
	 */
	MarqueeDecorator
};
