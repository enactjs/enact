/**
 * The signature for event handling functions
 *
 * @callback HandlerFunction
 * @param {any} event
 * @param {Object<string, any>} props
 * @param {Object<string, any>} context
 */
// Parameters stay `any` so consumers can pass narrower event/prop shapes into handle().
export type HandlerFunction = (event?: any, props?: any, context?: any) => any;
