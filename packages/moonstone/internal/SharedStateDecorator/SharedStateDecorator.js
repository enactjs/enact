import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const SharedState = React.createContext(null);

const defaultConfig = {
	idProp: 'id',
	updateOnMount: false
};

/**
 * Adds shared state to a component.
 *
 * The purpose of shared state is to store framework component state at significant container
 * boundaries in order to restore it when the "same" component is mounted later.
 *
 * "Sameness" is determined by the `idProp` config member (defaults to "id"). If multiple
 * descendants have the same `idProp` within the subtree, SharedStateDecorator will not distinguish
 * between them and will allow each to read from and write over each other's data.
 *
 * For example, Panels and Panel are considered "significant container boundaries" since they are
 * key building blocks for moonstone applications. When components are rendered within a Panel, we
 * may want to store those components state on unmount so that we can restore it when returning to
 * the panel. Panel can (and does) use SharedStateDecorator to establish a shared state which can be
 * used by contained components.
 *
 * It's important to note that SharedStateDecorator doesn't prescribe how or what is stored nor how
 * the data is managed. That is left to the consuming component to determine. Also, unlike React
 * state or third-party state management solutions like Redux, updating shared state will not
 * initiate an update cycle in React. The intent is only to restore state on mount.
 *
 * If shared state is used in the render method for a component, it may be necessary to use the
 * `updateOnMount` config member which will initiate an update cycle within React once the data is
 * available from an upstream shared state.
 *
 * @hoc
 * @private
 */
const SharedStateDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {idProp, updateOnMount} = config;

	return class extends React.Component {
		static displayName = 'SharedStateDecorator'

		static contextType = SharedState

		static propTypes = {
			/**
			 * Prevents the component from setting or restoring any framework shared state.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			noSharedState: PropTypes.bool
		}

		constructor (props) {
			super(props);

			this.data = {};
			this.sharedState = this.initSharedState();
			this.state = {
				updateOnMount: false
			};
		}

		componentDidMount () {
			this.loadFromContext();
		}

		componentDidUpdate (prevProps) {
			if (!prevProps.noSharedState && this.props.noSharedState) {
				this.data = {};
			} else if (prevProps.noSharedState && !this.props.noSharedState) {
				this.loadFromContext();
			}
		}

		isUpdateable () {
			const {[idProp]: id, noSharedState} = this.props;

			return !noSharedState && (id || id === 0);
		}

		initSharedState () {
			return {
				set: (key, value) => {
					const {[idProp]: id} = this.props;

					if (this.isUpdateable()) {
						this.data[id] = this.data[id] || {};
						this.data[id][key] = value;
					}
				},

				get: (key) => {
					const {[idProp]: id} = this.props;

					return (this.isUpdateable() && this.data[id]) ? this.data[id][key] : null;
				},

				delete: (key) => {
					const {[idProp]: id} = this.props;

					if (this.isUpdateable() && this.data[id]) {
						delete this.data[id][key];
					}
				}
			};
		}

		loadFromContext () {
			const {[idProp]: id, noSharedState} = this.props;

			if (!noSharedState && this.context && this.context.get) {
				const data = this.context.get(id);

				if (data) {
					this.data = data;
				} else {
					this.context.set(id, this.data);
				}

				if (updateOnMount) {
					this.setState({updateOnMount: true});
				}
			}
		}

		render () {
			const {...props} = this.props;

			delete props.noSharedState;

			return (
				<SharedState.Provider value={this.sharedState}>
					<Wrapped {...props} />
				</SharedState.Provider>
			);
		}
	};
});

export default SharedStateDecorator;
export {
	SharedState,
	SharedStateDecorator
};
