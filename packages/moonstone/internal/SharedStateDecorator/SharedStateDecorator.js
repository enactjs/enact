import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const SharedState = React.createContext(null);

const SharedStateDecorator = hoc({idProp: 'id'}, (config, Wrapped) => {
	const {idProp} = config;

	return class extends React.Component {
		static displayName = 'SharedStateDecorator'

		static contextType = SharedState

		static propTypes = {
			noSharedState: PropTypes.bool
		}

		constructor (props) {
			super(props);

			this.data = {};
			this.sharedState = this.initSharedState();
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

		initSharedState () {
			return {
				set: (key, value) => {
					const {[idProp]: id, noSharedState} = this.props;

					if (noSharedState || !id && id !== 0) return;

					this.data[id] = this.data[id] || {};
					this.data[id][key] = value;
				},

				get: (key) => {
					const {[idProp]: id, noSharedState} = this.props;

					return noSharedState ? null : (this.data[id] && this.data[id][key]);
				},

				delete: (key) => {
					const {[idProp]: id, noSharedState} = this.props;

					if (!noSharedState && id && this.data[id]) {
						delete this.data[id][key];
					}
				}
			};
		}

		loadFromContext () {
			const {[idProp]: id, noSharedState} = this.props;

			if (!noSharedState && this.context) {
				const data = this.context.get(id);

				if (data) {
					this.data = data;
				} else {
					this.context.set(id, this.data);
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
