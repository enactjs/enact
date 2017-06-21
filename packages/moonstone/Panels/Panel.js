import deprecate from '@enact/core/internal/deprecate';
import {forward, handle} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import classnames from 'classnames';
import css from './Panel.less';

let panelId = 0;

// Called when `noAutoFocus` is true. Warns the first time and returns the new `autoFocus` value
const adaptToAutoFocus = deprecate(() => 'none', {
	name: 'noAutoFocus',
	since: '1.3.0',
	until: '2.0.0',
	replacedBy: 'autoFocus'
});

/**
* {@link moonstone/Panels.Panel} is the default kind for controls created inside a
* [moonstone/Panels]{@link moonstone/Panels.Panels} container. A `moonstone/Panels`
* will typically contain several instances of these.
*
* @class Panel
* @memberof moonstone/Panels
* @ui
* @public
*/
class PanelBase extends React.Component {

	static propTypes =  /** @lends moonstone/Panels.Panel.prototype */ {
		/**
		 * By default, the panel will be labeled by its [Header]{@link moonstone/Panels.Header}.
		 * When `aria-label` is set, it will be used instead to provide an accessibility label for
		 * the panel.
		 *
		 * @memberof moonstone/Panels.Panel.prototype
		 * @type {String}
		 * @public
		 */
		'aria-label': PropTypes.string,

		/**
		 * Sets the strategy used to automatically focus an element within the panel upon render.
		 *
		 * * "none" - Automatic focus is disabled
		 * * "last-focused" - The element last focused in the panel with be restored
		 * * "default-element" - The first spottable component within the body will be focused
		 * * Custom Selector - A custom CSS selector may also be provided which will be used to find
		 *   the target within the Panel
		 *
		 * @type {String}
		 * @default 'last-focused'
		 * @public
		 */
		autoFocus: PropTypes.string,

		/**
		 * Header for the panel. This is usually passed by the {@link ui/Slottable.Slottable} API by
		 * using a [Header]{@link moonstone/Panels.Header} component as a child of the Panel.
		 *
		 * @type {Header}
		 * @public
		 */
		header: PropTypes.node,

		/**
		 * When `true`, only the `header` is rendered and the body components are not. Setting to
		 * `false` will cause all components to be rendered and the body components will fade in.
		 *
		 * When a Panel is used within {@link moonstone/Panels.Panels},
		 * {@link moonstone/Panels.ActivityPanels}, or {@link moonstone/Panels.AlwaysViewingPanels},
		 * this property will be set automatically to `true` on render and `false` after animating
		 * into view.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hideChildren: PropTypes.bool,

		/**
		 * When `true`, the contents of the Panel will not receive spotlight focus after being
		 * rendered.
		 *
		 * @deprecated Replaced by `autoFocus="none"`
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoFocus: PropTypes.bool
	}

	static defaultProps = {
		autoFocus: 'last-focused',
		hideChildren: false,
		noAutoFocus: false
	}

	componentDidMount () {
		this.ariaLabelledBy = `panel_${++panelId}_header`;
	}

	componentWillReceiveProps (nextProps) {
		const {hideChildren} = this.props;

		// In order to spot the header / body components, we defer spotting until !hideChildren.
		if (hideChildren !== nextProps.hideChildren && !nextProps.hideChildren) {
			this.spotPanel();
		}
	}

	panelRef = (node) => {
		this.panelNode = node;
		if (node) {
			// If the Panel opts out of hideChildren support by explicitly setting it to false,
			// it'll spot on mount.
			this.spotPanel();
		}
	}

	spotPanel () {
		let {autoFocus, noAutoFocus} = this.props;

		if (noAutoFocus) {
			autoFocus = adaptToAutoFocus();
		}

		if (autoFocus !== 'none' && this.panelNode && !Spotlight.getCurrent()) {
			const {containerId} = this.panelNode.dataset;
			const config = {
				enterTo: 'last-focused'
			};

			if (autoFocus !== 'last-focused') {
				config.enterTo = 'default-element';

				if (autoFocus !== 'default-element') {
					config.defaultElement = autoFocus;
				}
			}

			Spotlight.set(containerId, config);
			Spotlight.focus(containerId);
		}
	}

	handle = handle.bind(this)

	handleScroll = this.handle(
		forward('onScroll'),
		({currentTarget}) => {
			currentTarget.scrollTop = 0;
			currentTarget.scrollLeft = 0;
		}
	)

	render () {
		const props = Object.assign({}, this.props);
		const {children, label, header, hideChildren, ...rest} = props;

		delete rest.autoFocus;
		delete rest.noAutoFocus;

		// nulling headerId prevents the aria-labelledby relationship which is necessary to allow
		// aria-label to take precedence
		// (see https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby)
		const headerId = label ? null : this.ariaLabelledBy;
		const bodyClassName = classnames({
			body: true,
			noHeader: !header,
			visible: !hideChildren
		});

		return (
			<article role="region" {...rest} aria-labelledby={headerId} className={css.panel} onScroll={this.handleScroll} ref={this.panelRef}>
				<div className={css.header} id={headerId}>{header}</div>
				<section className={bodyClassName}>{children}</section>
			</article>
		);
	}
}

const Panel = SpotlightContainerDecorator(
	{
		// prefer any spottable within the panel body for first render
		defaultElement: `.${css.body} *`,
		enterTo: 'last-focused',
		preserveId: true
	},
	Slottable(
		{slots: ['header']},
		PanelBase
	)
);

export default Panel;
export {Panel, PanelBase};
