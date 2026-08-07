import {useState} from 'react';

export type Constructor<T> = new (...args: any[]) => T;

/**
 * Creates one instance of the class, `Ctor` with the provided `args`, for the life of the
 * component.
 *
 * ```
 * class MyClass {
 *   constructor ({value}) {
 *     this.value = value;
 *   }
 *
 *   handleEvent = (ev) => {
 *     if (ev.key === 'Enter') {
 *       // do something with this.value
 *     }
 *   }
 * }
 *
 * function Component (props) {
 *   const inst = useClass(MyClass, props.value);
 *   return <div onClick={inst.handleEvent} />
 * }
 * ```
 *
 * @param {Function} Ctor Class constructor
 * @param  {...any}  args Arguments to pass to the constructor
 * @returns {Object}      An instance of `Ctor`
 * @private
 */
function useClass <T> (Ctor: Constructor<T>, ...args: any[]): T {
	const [state] = useState(() => new Ctor(...args));

	return state;
}

export default useClass;
export {
	useClass
};
