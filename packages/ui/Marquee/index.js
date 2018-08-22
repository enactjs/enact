/**
 * A component that will marquee its overflowing contents.
 *
 * @module ui/Marquee
 * @exports Marquee
 * @exports MarqueeBase
 * @exports MarqueeController
 * @exports MarqueeDecorator
 */

// Marquee is unique in the framework in that its base component, Marquee, is used by its behavioral
// HOC, MarqueeDecorator. In other cases, the behavioral HOC would receive the base component as
// Wrapped but in this case is designed to receive a third-party component instead.
//
// This file avoids circular dependencies between Marquee.js (which would normally import its
// decorator) and MarqueeDecorator (which needs to import Marquee.js).

import MarqueeBase from './MarqueeBase';
import {MarqueeController} from './MarqueeController';
import MarqueeDecorator from './MarqueeDecorator';

/**
 * A minimally-styled marquee component.
 *
 * @class Marquee
 * @extends ui/Marquee.MarqueeBase
 * @memberof ui/Marquee
 * @mixes ui/Marquee.MarqueeDecorator
 * @ui
 * @public
 */
const Marquee = MarqueeDecorator({component: MarqueeBase}, 'div');

export default Marquee;
export {
	Marquee,
	MarqueeBase,
	MarqueeController,
	MarqueeDecorator
};
