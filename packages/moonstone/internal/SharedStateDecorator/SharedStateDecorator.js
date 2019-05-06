import hoc from '@enact/core/hoc';
import React from 'react';

const SharedState = React.createContext(null);

const SharedStateDecorator = hoc({defaultId: null, idProp: 'id'}, (config, Wrapped) => {
	const {defaultId, idProp} = config;

	const getId = ({[idProp]: id = defaultId}) => id;

	return class extends React.Component {
		static displayName = 'SharedStateDecorator'

		static contextType = SharedState

		constructor (props) {
			super(props);

			this.data = {};
			this.sharedState = this.initSharedState();
		}

		componentDidMount () {
			this.loadFromContext();
		}

		initSharedState () {
			return {
				set: (key, value) => {
					const id = getId(this.props);

					if (!id) return;

					this.data[id] = this.data[id] || {};
					this.data[id][key] = value;
				},

				get: (key) => {
					const id = getId(this.props);

					return this.data[id] && this.data[id][key];
				},

				delete: (key) => {
					const id = getId(this.props);

					if (id && this.data[id]) {
						delete this.data[id][key];
					}
				}
			};
		}

		loadFromContext () {
			if (this.context) {
				const id = getId(this.props);
				const data = this.context.get(id);

				if (data) {
					this.data = data;
				} else {
					this.context.set(id, this.data);
				}
			}
		}

		render () {
			return (
				<SharedState.Provider value={this.sharedState}>
					<Wrapped {...this.props} />
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
