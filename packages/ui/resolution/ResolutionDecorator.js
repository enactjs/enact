/*
 * Exports the {@link ui/resolution.ResolutionDecorator} higher-order component (HOC).
 *
 * not jsdoc module on purpose
 */

import {Component} from 'react';
import PropTypes from 'prop-types';
import hoc from '@enact/core/hoc';
import {checkPropTypes} from '@enact/core/util';

import {init, config as riConfig, defineScreenTypes, getResolutionClasses} from './resolution';

/**
 * Default config for `ResolutionDecorator`.
 *
 * @memberof ui/resolution.ResolutionDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Attaches an event listener to the window to listen for resize events.
	 *
	 * When enabled, the resolution classes will be automatically updated when the window
	 * is resized or when screen rotation occurs (such as when a device changes from
	 * landscape to portrait orientation).
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 * @memberof ui/resolution.ResolutionDecorator.defaultConfig
	 */
	dynamic: true,

	/**
	 * Determines how to calculate font-size.
	 * When set to `scale` and the screen is in `landscape` orientation,
	 * calculates font-size linearly based on screen resolution.
	 * When set to `normal`, the font-size will be the pxPerRem value of the best match screen type.
	 *
	 * @type {('normal'|'scale')}
	 * @default 'scale'
	 * @private
	 * @memberof ui/resolution.ResolutionDecorator.defaultConfig
	 */
	fontSizeHandling: 'scale',

	/**
	 * An array of objects containing declarations for screen types to add to the list of known
	 * screen types.
	 *
	 * @type {Object[]}
	 * @default null
	 * @public
	 * @memberof ui/resolution.ResolutionDecorator.defaultConfig
	 */
	screenTypes: null
};

/**
 * A higher-order component that configures resolution support for its wrapped component tree.
 *
 * This decorator automatically applies resolution-specific CSS classes to the wrapped component,
 * enabling responsive layouts that adapt to different screen sizes, orientations, and aspect ratios.
 * It also supports dynamic updates when the window is resized or when the screen rotates.
 *
 * Configuration options:
 *	* `dynamic: true` - when `true`, updates the resolution classes when the window resizes or the screen rotates
 *	* `screenTypes: null` - defines a set of screen types to support
 *
 * Example:
 * ```
 *	// Will have the resolution classes and will be updated when the window resizes or the screen rotates
 *	const AppWithResolution = ResolutionDecorator(App);
 *	// Will have the resolution classes for the screen at the time of render only
 *	const AppWithStaticResolution = ResolutionDecorator({dynamic: false}, App);
 *	const AppWithScreenTypes = ResolutionDecorator({screenTypes: [
 *		{name: 'hd', pxPerRem: 16, width: 1280, height: 720, aspectRatioName: 'hdtv', base: true}
 *	]}, App);
 * ```
 * @class ResolutionDecorator
 * @memberof ui/resolution
 * @hoc
 * @public
 */
const ResolutionDecorator = hoc(defaultConfig, (config, Wrapped) => {
	if (config.screenTypes) {
		defineScreenTypes(config.screenTypes);
	}

	return class extends Component {
		static displayName = 'ResolutionDecorator';

		static propTypes = /** @lends ui/resolution.ResolutionDecorator.prototype */ {
			className: PropTypes.string
		};

		constructor (props) {
			super(props);
			checkPropTypes(this, props);
			riConfig.fontSizeHandling = config.fontSizeHandling;
			init({measurementNode: (typeof window !== 'undefined' && window)});
			this.state = {
				resolutionClasses: ''
			};
		}

		componentDidMount () {
			if (config.dynamic) window.addEventListener('resize', this.handleResize);
			this.rootNode = document.getElementsByClassName(getResolutionClasses())?.[0] || null;
		}

		componentDidUpdate (prevProps) {
			checkPropTypes(this, this.props, prevProps);
		}

		componentWillUnmount () {
			if (config.dynamic) window.removeEventListener('resize', this.handleResize);
		}

		handleResize = () => {
			const classNames = this.didClassesChange();

			if (classNames) {
				this.setState({resolutionClasses: classNames});
			}
		};

		/*
		 * Compare our current version of the resolved resolution class names with a fresh
		 * initialization of RI.
		 *
		 * @returns {String|undefined} A string of new class names or undefined when there is no change.
		 * @private
		 */
		didClassesChange () {
			const prevClassNames = getResolutionClasses();
			init({measurementNode: this.rootNode});
			const classNames = getResolutionClasses();
			if (prevClassNames !== classNames) {
				return classNames;
			}
		}

		render () {
			// Check if the classes are different from our previous classes
			let classes = getResolutionClasses();

			if (this.props.className) classes += (classes ? ' ' : '') + this.props.className;
			return <Wrapped {...this.props} className={classes} />;
		}
	};
});

export default ResolutionDecorator;
export {ResolutionDecorator};
