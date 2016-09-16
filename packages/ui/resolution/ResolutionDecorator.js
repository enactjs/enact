import React from 'react';
import hoc from 'enact-core/hoc';

import {init, defineScreenTypes, getScreenTypeObject, getResolutionClasses} from './resolution';

const defaultConfig = {
	dynamic: true,
	screenTypes: null
};

/**
 * Higher-order Component that configures resolution support for its wrapped component tree.
 *
 * Configuration options:
 *	* dynamic: true - when true, updates the resolution classes when the window resizes
 *	* screenTypes: null - defines a set of screen types to support
 *
 * @example
 *	// Will have the resolution classes and will be updated when the window resizes
 *	const AppWithResolution = ResolutionDecorator(App);
 *	// Will have the resolution classes for the screen at the time of render only
 *	const AppWithStaticResolution = ResolutionDecorator({dynamic: false}, App);
 *	const AppWithScreenTypes = ResolutionDecorator({screenTypes: [
 *		{name: 'hd', pxPerRem: 16, width: 1280, height: 720, aspectRatioName: 'hdtv', base: true}
 *	]}, App);
 *
 * @public
 */
const ResolutionDecorator = hoc(defaultConfig, (config, Wrapped) => {
	if (config.screenTypes) {
		defineScreenTypes(config.screenTypes);
	}

	return class extends React.Component {
		displayName = 'ResolutionDecorator'

		static propTypes = {
			className: React.PropTypes.string
		}

		componentDidMount () {
			if (config.dynamic) window.addEventListener('resize', this.handleResize);
		}

		componentWillUnmount () {
			if (config.dynamic) window.removeEventListener('resize', this.handleResize);
		}

		handleResize = () => {
			init();
			this.setState({
				screenType: getScreenTypeObject().name
			});
		}

		render () {
			// ensure we've initialized the RI members
			if (this.state && !this.state.screenType) init();

			let classes = getResolutionClasses();
			if (this.props.className) classes += (classes ? ' ' : '') + this.props.className;
			return <Wrapped {...this.props} className={classes} />;
		}
	};
});

export default ResolutionDecorator;
export {ResolutionDecorator};
