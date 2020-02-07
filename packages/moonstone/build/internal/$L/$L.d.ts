/**
 * Returns the current ilib.ResBundle
 */
function getResBundle(): ResBundle;
/**
 * Creates a new ilib.ResBundle for string translation
 */
function createResBundle(any, locale: Locale): Promise | ResBundle;
/**
 * Deletes the current bundle object of strings and clears the cache.
 */
function clearResBundle(): void;
/**
 * Set the locale for the strings that $L loads. This may reload the
string resources if necessary.
 */
function setResBundle(any, spec: string): ResBundle;
/**
 * Maps a string or key/value object to a translated string for the current locale.
 */
function $L(str: string | object): string;
