// keymap uses a singleton object, map, to manage the keymap. since webpack may make multiple copies
// of the module available if the import path is different, we ensure a consistent import path for
// the singleton instance by facading it with this module.

export * from './keymap';
