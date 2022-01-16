/** Class representing a error from SuperDB. */
class SuperDBError extends Error {
    /**
     * Creates an error.
     * @param {string} message Descriptive message of the error
     */
    constructor(message = 'Unknown error') {
        super();
        /**
         * The name of the error
         * @type {string}
         */
        this.name = '[SuperDBError]';

        /**
         * The message of the error
         * @type {string}
         */
        this.message = message;
    }
}

module.exports = SuperDBError;