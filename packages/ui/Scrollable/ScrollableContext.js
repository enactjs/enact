import {createContext} from 'react';
const ScrollBarShowingContext = createContext(false);
const {Provider, Consumer} = ScrollBarShowingContext;

export default ScrollBarShowingContext;
export {
	Provider, Consumer
};
