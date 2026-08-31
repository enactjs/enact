/**
 * Minimal ambient globals for the migrated `*-specs` test files. The consuming project's real
 * Jest/`@types/jest` setup should supersede this in normal builds; this file exists purely so the
 * migrated test sources type-check in isolation.
 */
declare const describe: (name: string, fn: () => void) => void;
declare const test: ((name: string, fn: (...args: any[]) => any, timeout?: number) => void) & {
	skip: (name: string, fn?: (...args: any[]) => any) => void;
	only: (name: string, fn: (...args: any[]) => any) => void;
	each: (table: any[]) => (name: string, fn: (...args: any[]) => any) => void;
};
declare const it: typeof test;
declare const beforeEach: (fn: (...args: any[]) => any) => void;
declare const afterEach: (fn: (...args: any[]) => any) => void;
declare const beforeAll: (fn: (...args: any[]) => any) => void;
declare const afterAll: (fn: (...args: any[]) => any) => void;
declare function expect(actual: any): any;
declare namespace jest {
	function fn(implementation?: (...args: any[]) => any): any;
	function spyOn(object: any, method: string): any;
	function useFakeTimers(): any;
	function useRealTimers(): any;
	function advanceTimersByTime(ms: number): any;
	function runAllTimers(): any;
	function clearAllMocks(): any;
	function resetAllMocks(): any;
	function restoreAllMocks(): any;
	function mock(moduleName: string, factory?: (...args: any[]) => any): any;
	function requireActual(moduleName: string): any;
}
