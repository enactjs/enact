import {createContext} from 'react';
const isVerticalScrollbarShowing = createContext(false);
const {Provider, Consumer} = isVerticalScrollbarShowing;

export default isVerticalScrollbarShowing;
export {
	Provider, Consumer
};
