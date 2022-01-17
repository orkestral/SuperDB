const SuperDBObject = require('./structures/Object.js');
const SuperDBError = require('./structures/Error.js');
const SuperDBUtils = require('./Utils.js');
const path = require('path');
const fs = require('fs');

/**
 * SuperDB options object used to create the database
 * @typedef {Object} SuperDBOptions
 * @property {string} dir The directory path of the database
 * @property {string} name The name of the database
 * @property {boolean} raw Specifies if plain objects are returned instead of SuperDBObjects
 */

/**
 * Private SuperDB options inside the SuperDB class
 * @typedef {SuperDBOptions} SuperDBPrivateOptions
 * @property {string} file The absolute path of the database file
 */

/** Class representing a database. */
class SuperDB {
    /**
     * Create or get a database.
     * @param {SuperDBOptions} options SuperDB options object
     * @throws {SuperDBError} If any value is invalid
     */
    constructor(options = { raw: false }) {
        if (!options) throw new SuperDBError('The options are required');
        if (typeof options !== 'object') throw new SuperDBError('The options must be an object');
        if (!options.dir) throw new SuperDBError('The directory path is required');
        if (!options.name) throw new SuperDBError('The name of the database is required');
        if (typeof options.dir !== 'string') throw new SuperDBError('The directory path must be an string');
        if (typeof options.name !== 'string') throw new SuperDBError('The name of the database must be an string');
        if (!fs.existsSync(options.dir)) fs.mkdirSync(options.dir);
        if (options.name.length < 1) throw new SuperDBError('The name must have more of one character');

        options.raw = !!options.raw;

        /**
         * The options of the database
         * @type {SuperDBPrivateOptions}
         * @private
         * @readonly
         */
        Object.defineProperty(this, '_options', {
            value: {
                ...options,
                file: path.join(options.dir, `${options.filename ? options.filename : options.name}.json`)
            }
        });

        /**
         * The database utils
         * @type {SuperDBUtils}
         * @private
         * @readonly
         */
        Object.defineProperty(this, '_utils', {
            value: new SuperDBUtils(this._options.file)
        });

        if (!fs.existsSync(this._options.file)) fs.writeFileSync(this._options.file, '{}');
    }

    /**
     * Returns all data stored in the database
     * @returns {SuperDBObject} All data
     */
    all() {
        const data = this._utils.getAll();
        if (!this._options.raw && typeof data === 'object' && !(data instanceof Array))
            return new SuperDBObject(data, '/', this._options.file);
        else return data;
    }

    /**
     * Creates an element in the database (only if it doesn't exists already)
     * @param {string} id The ID to create
     * @param {any} initialValue The initial value
     * @returns {any} The created element
     * @throws {SuperDBError} If the ID or initial value is invalid
     */
    create(id, initialValue) {
        if (!SuperDBUtils.validId(id)) throw new SuperDBError('Invalid ID provided, it shouldn\'t contain blank properties');
        if (!SuperDBUtils.validValue(initialValue)) throw new SuperDBError('The value must be a string, number, boolean, undefined or an object');
        if (this._utils.get(id)) return this._utils.get(id);
        return this._utils.set(id, initialValue, true);
    }

    /**
     * Deletes an element from the database
     * @param {string} id The ID of the element
     * @returns {any} The deleted element
     * @throws {SuperDBError} If the ID is invalid or the element doesn't exists
     */
    delete(id) {
        if (!SuperDBUtils.validId(id)) throw new SuperDBError('Invalid ID provided, it shouldn\'t contain blank properties');
        const data = this._utils.get(id);
        if (!data) throw new SuperDBError('That element doesn\'t exists in the database');
        this._utils.set(id, undefined, false);
        return data;
    }

    /**
     * Checks if an element exists in the database
     * @param {string} id The ID to check
     * @returns {boolean} If it exists
     * @throws {SuperDBError} If the ID is invalid
     */
    exists(id) {
        if (!SuperDBUtils.validId(id)) throw new SuperDBError('Invalid ID provided, it shouldn\'t contain blank properties');
        return Boolean(this._utils.get(id));
    }

    /**
     * Gets an element of the database
     * @param {string} id The ID of the element
     * @returns {(SuperDBObject|any)} The element
     * @throws {SuperDBError} If the ID is invalid
     */
    get(id) {
        if (!SuperDBUtils.validId(id)) throw new SuperDBError('Invalid ID provided, it shouldn\'t contain blank properties');
        const data = this._utils.get(id);
        if (!this._options.raw && typeof data === 'object' && !(data instanceof Array)) return new SuperDBObject(data, id, this._options.file);
        else return data;
    }

    /**
     * Sets the value of an element in the database
     * @param {string} id The ID of the element
     * @param {any} value The value to be setted
     * @returns {any} The value setted
     * @throws {SuperDBError} If the ID or value is invalid
     */
    set(id, value) {
        if (!SuperDBUtils.validId(id)) throw new SuperDBError('Invalid ID provided, it shouldn\'t contain blank properties');
        if (!SuperDBUtils.validValue(value)) throw new SuperDBError('The value must be a string, number, boolean, undefined or an object');
        return this._utils.set(id, value, false);
    }

    /**
     * Finds an element in the database
     * @param {function} callback The function to check elements
     * @param {string} id The ID to start checking
     * @returns {(SuperDBObject|any)} The element
     * @throws {SuperDBError} If the ID or callback is invalid
     */
    find(callback, id = '/') {
        if (id !== '/' && !SuperDBUtils.validId(id)) throw new SuperDBError('Invalid ID provided, it shouldn\'t contain blank properties');
        if (typeof callback !== 'function') throw new SuperDBError('The callback must be a function');
        const data = id === '/' ? this._utils.getAll() : this._utils.get(id);
        if (!data) return undefined;
        const element = Object.entries(data).find(([, e]) => callback(e));
        if (!element || !element[0]) return undefined;
        if (!this._options.raw && typeof element[1] === 'object' && !(element[1] instanceof Array)) return new SuperDBObject(element[1], id === '/' ? element[0] : `${id}.${element[0]}`, this._options.file);
        else return element[1];
    }

    /**
     * Filters elements in the database
     * @param {function} callback The function to filter the elements
     * @param {string} id The ID to start filtering
     * @returns {(SuperDBObject|any)[]} The elements (SuperDBObject if they're objects, array with ID and value if not)
     * @throws {SuperDBError} If the ID or callback is invalid
     */
    filter(callback, id = '/') {
        if (id !== '/' && !SuperDBUtils.validId(id)) throw new SuperDBError('Invalid ID provided, it shouldn\'t contain blank properties');
        if (typeof callback !== 'function') throw new SuperDBError('The callback must be a function');
        const data = id === '/' ? this._utils.getAll() : this._utils.get(id);
        if (!data) return undefined;
        const elements = Object.entries(data).filter(([, e]) => callback(e));
        if (!elements) return undefined;
        if (!this._options.raw && elements.every((e) => typeof e[1] === 'object' && !(e[1] instanceof Array))) return elements.map((e) => new SuperDBObject(e[1], id === '/' ? e[0] : `${id}.${e[0]}`, this._options.file));
        else return elements;
    }
}

module.exports = SuperDB;