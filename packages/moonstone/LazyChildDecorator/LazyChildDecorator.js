/**
 * Exports the {@link moonstone/LazyChildDecorator.LazyChildDecorator} Higher-order Component (HOC).
 *
 * @module moonstone/LazyChildDecorator
 */

import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import React from 'react';
import VisibilityObserver from '@enact/ui/VisibilityObserver';

/**
 * Default config for {@link moonstone/LazyChildDecorator.LazyChildDecorator}
 *
 * @memberof moonstone/LazyChildDecorator.LazyChildDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the event name that will indicate a resize of a container may be necessary
	 *
	 * @type {String}
	 * @default null
	 * @memberof moonstone/LazyChildDecorator.LazyChildDecorator.defaultConfig
	 */
	filter: null,

	/**
	 * Configures a function that can filter the event to limit when the container is notified. This
	 * function will receive the event payload as its only argument and should return `true` to
	 * prevent the resize notification.
	 *
	 * @type {Function}
	 * @default null
	 * @memberof moonstone/LazyChildDecorator.LazyChildDecorator.defaultConfig
	 */
	resize: null
};

/**
 * The context propTypes required by `LazyChildDecorator`. This should be set as the `childContextTypes` of a
 * container that needs to be notified of a resize.
 *
 * @type {Object}
 * @memberof moonstone/LazyChildDecorator
 * @public
 */
const contextTypes = {
	invalidateBounds: React.PropTypes.func,
	scrollLeft: React.PropTypes.number,
	scrollTop: React.PropTypes.number
};

let num = 0;

/**
 * {@link moonstone/LazyChildDecorator.LazyChildDecorator} is a Higher-order Component that can be used to notify a container
 * that the Wrapped component has been resized. It may be useful in cases where a component may need
 * to update itself as a result of its children changing in size, such a Scroller.
 *
 * Containers must provide an `invalidateBounds` method via React's context in order for `LazyChildDecorator`
 * instances to notify it of resize.
 *
 * @class LazyChildDecorator
 * @memberof moonstone/LazyChildDecorator
 * @hoc
 * @public
 */
const LazyChildDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {filter, initialHeight, resize} = config;

	const LazyWrapped = ({visible, ...rest}) => {
		if (visible) {
			return (
				<Wrapped {...rest} />
			);
		} else {
			return (
				<div data-lazy-index={rest['data-lazy-index']} key={rest.index}  style={{height: initialHeight + 'px'}} />
			);
		}
	};

	invariant(resize, `resize is required by LazyChildDecorator but was omitted when applied to ${Wrapped.displayName}`);

	return class extends React.Component {
		static displayName = 'LazyChildDecorator'

		static propTypes = /** @lends ui/LazyChildDecorator.LazyChildDecorator.prototype */ {
		}

		static defaultProps = {
		}

		constructor (props) {
			super(props);

			this.state = {
				visible: false
			};

			this.id = num++;
		}

		static contextTypes = contextTypes

		/*
		 * Notifies a container that a resize is necessary
		 *
		 * @returns {undefined}
		 * @private
		 */
		invalidateBounds = () => this.context.invalidateBounds()

		handle = handle.bind(this)

		/*
		 * Handles the event that indicates a resize is necessary
		 *
		 * @param   {Object}    ev  Event payload
		 *
		 * @returns {undefined}
		 * @private
		 */
		handleResize = this.handle(
			forward(resize),
			// stop if there isn't a container to notify
			(ev, props, {invalidateBounds}) => !!invalidateBounds,
			// optionally filter the event before notifying the container
			filter,
			this.invalidateBounds
		)

		componentWillLoad () {
			this.setState({visible: true});
		}

		componentDidMount () {
			const
				self = this,
				elm = document.querySelectorAll('div[data-lazy-index]')[this.id];

			new VisibilityObserver(elm, function() {
				self.componentWillLoad();
			});
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{visible} = this.state;

			props[resize] = this.handleResize;

			return (<LazyWrapped {...props} data-lazy-index={this.id} key={props.index} visible={visible} />);
		}
	};
});

export default LazyChildDecorator;
export {
	contextTypes,
	LazyChildDecorator
};
