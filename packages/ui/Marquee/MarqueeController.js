import hoc from '@enact/core/hoc';
import {MarqueeControllerContext, useMarqueeController} from './useMarqueeController';

/**
 * Default configuration parameters for {@link ui/Marquee.MarqueeController}.
 *
 * @type {Object}
 * @memberof ui/Marquee.MarqueeController
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * When `true`, any `onFocus` events that bubble to the controller will start the contained
	 * `Marquee` instances. This is useful when a component contains `Marquee` instances that need to be
	 * started when sibling components are focused.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/Marquee.MarqueeController.defaultConfig
	 */
	marqueeOnFocus: false
};

/**
 * A higher-order component that synchronizes contained `Marquee`s.
 *
 * @memberof ui/Marquee
 * @hoc
 * @public
 */
const MarqueeController = hoc(defaultConfig, (config, Wrapped) => {
	const {marqueeOnFocus} = config;

	return function (props) {
		const {handleBlur, handleFocus, provideMarqueeControllerContext} = useMarqueeController(props);
		let wrappedProps = props;

		if (marqueeOnFocus) {
			wrappedProps = {
				...props,
				onBlur: handleBlur,
				onFocus: handleFocus
			};
		}

		return provideMarqueeControllerContext(
			<Wrapped {...wrappedProps} />
		);
	};
});

export default MarqueeController;
export {
	MarqueeController,
	MarqueeControllerContext
};
