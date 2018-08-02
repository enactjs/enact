/*
 * Exports the {@link ui/resolution.ResolutionDecorator} higher-order component (HOC).
 *
 * not jsdoc module on purpose
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import hoc from '@enact/core/hoc';

import {init, defineScreenTypes, getResolutionClasses} from './resolution';

/**
 * Default config for {@link ui/resolution.ResolutionDecorator}
 *
 * @memberof ui/resolution.ResolutionDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * When `true`, an event listener will be attached to the window to listen for resize events.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 * @memberof ui/resolution.ResolutionDecorator.defaultConfig
	 */
	dynamic: true,

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
 * A higher-order component (HOC) that configures resolution support for its wrapped component tree.
 *
 * Configuration options:
 *	* `dynamic: true` - when `true`, updates the resolution classes when the window resizes
 *	* `screenTypes: null` - defines a set of screen types to support
 *
 * Example:
 * ```
 *	// Will have the resolution classes and will be updated when the window resizes
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

	return class extends React.Component {
		static displayName = 'ResolutionDecorator'

		static propTypes = /** @lends ui/resolution.ResolutionDecorator.prototype */ {
			className: PropTypes.string
		}

		constructor (props) {
			super(props);
			init({measurementNode: (typeof window !== 'undefined' && window)});
			this.state = {
				resolutionClasses: ''
			};
		}

		componentDidMount () {
			if (config.dynamic) window.addEventListener('resize', this.handleResize);
			// eslint-disable-next-line react/no-find-dom-node
			this.rootNode = ReactDOM.findDOMNode(this);
		}

		componentWillUnmount () {
			if (config.dynamic) window.removeEventListener('resize', this.handleResize);
		}

		handleResize = () => {
			const classNames = this.didClassesChange();

			if (classNames) {
				this.setState({resolutionClasses: classNames});
			}
		}

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
