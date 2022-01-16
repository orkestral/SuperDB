const fs = require('fs');

/** Class that contains every method to parse options or modify data. */
class SuperDBUtils {
    /**
     * @param {string} file The file that contains the data
     */
    constructor(file) {
        this.file = file;
    }

    /**
     * Returns all the data stored
     * @returns {Object} The data
     */
    getAll() {
        return JSON.parse(fs.readFileSync(this.file));
    }

    /**
     * Gets an element stored
     * @param {string} id The ID of the element to get
     * @returns {any} The element
     */
    get(id) {
        const allData = this.getAll(); // eslint-disable-line no-unused-vars
        let info = '';
        id.split('.').forEach((s, i, a) => {
            info += `[${JSON.stringify(s)}]`;
            if (i === (a.length - 1)) return;
            if (!eval(`allData${info}`)) eval(`allData${info} = {};`);
        });
        return eval(`allData${info}`);
    }

    /**
     * Sets an element and stores it
     * @param {string} id The ID of the element to set
     * @param {any} data The value of the element
     * @param {boolean} create If it's in creation mode
     * @returns {Object} The new value
     */
    set(id, data, create = false) {
        const allData = this.getAll();
        let info = '';
        id.split('.').forEach((s, i, a) => {
            info += `[${JSON.stringify(s)}]`;
            if (i === (a.length - 1)) {
                const last = eval(`allData${info}`);
                if (last && create) return;
                eval(`allData${info} = ${SuperDBUtils.stringifyData(data)}`);
            } else {
                if (!eval(`allData${info}`)) eval(`allData${info} = {};`);
            }
        });
        fs.writeFileSync(this.file, JSON.stringify(allData));
        return eval(`allData${info}`);
    }
}

/**
     * Checks if an ID is valid
     * @param {string} id The ID to check
     * @returns {Boolean} If it's valid
     */
SuperDBUtils.validId = (id) => {
    if (typeof id !== 'string') return false;
    if (id.length < 1) return false;
    if (id.split('.').includes('')) return false;
    if (id.endsWith('.')) return false;
    return true;
};

/**
* Checks if a value is valid to store
* @param {any} value The value to check
* @returns {boolean} If it's valid
*/
SuperDBUtils.validValue = (value) => {
    if (typeof value === 'string') return true;
    if (typeof value === 'number') return true;
    if (typeof value === 'object') return true;
    if (typeof value === 'boolean') return true;
    if (typeof value === 'undefined') return true;
    return false;
};

/**
* Converts any valid data to string
* @param {any} data The data to convert in a string
* @returns {string} The data converted
*/
SuperDBUtils.stringifyData = (data) => {
    if (typeof data === 'string') return JSON.stringify(data);
    if (typeof data === 'number') return JSON.stringify(data);
    if (typeof data === 'object' && !(data instanceof Array)) return JSON.stringify(data);
    if (typeof data === 'object' && (data instanceof Array)) return `[${data.map((e) => SuperDBUtils.stringifyData(e)).join(',')}]`;
    if (typeof data === 'boolean') return data ? 'true' : 'false';
    if (typeof data === 'undefined') return 'undefined';
    // if data isn't a string/number/object/boolean/undefined, it will return "undefined" to not throw any errors
    return 'undefined';
};

module.exports = SuperDBUtils;