/**
 * Provides components for displaying and controlling marqueed text.
 *
 * @see ui/MarqueeDecorator
 * @module moonstone/Marquee
 * @exports controlContextTypes
 * @exports Marquee
 * @exports MarqueeController
 * @exports MarqueeDecorator
 * @exports MarqueeText
 */

import {
	controlContextTypes,
	Marquee,
	MarqueeController,
	MarqueeDecorator,
	MarqueeText
} from '@enact/ui/MarqueeDecorator';

export default Marquee;
export {
	controlContextTypes,

	/**
	 * Internal component to provide marquee markup
	 *
	 * @see ui/MarqueeDecorator.Marquee
	 * @class Marquee
	 * @memberof moonstone/Marquee
	 * @public
	 */
	Marquee,

	/**
	 * Adds marquee behavior to a component
	 *
	 * @see ui/MarqueeDecorator.MarqueeDecorator
	 * @hoc
	 * @name MarqueeDecorator
	 * @memberof moonstone/Marquee
	 * @public
	 */
	MarqueeController,

	/**
	 * Adds ability to control descendant marquee instances to a component
	 *
	 * @see ui/MarqueeDecorator.MarqueeController
	 * @hoc
	 * @name MarqueeController
	 * @memberof moonstone/Marquee
	 * @public
	 */
	MarqueeDecorator,

	/**
	 * A block element which will marquee its contents
	 *
	 * @see ui/MarqueeDecorator.MarqueeText
	 * @class MarqueeText
	 * @memberof moonstone/Marquee
	 * @public
	 */
	MarqueeText
};
