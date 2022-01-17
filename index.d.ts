declare module 'superdb.js' {
    /**
     * SuperDB options object used to create the database
     */
    interface SuperDBOptions {
        /**
         * The directory absolute path of the database
         */
        dir: string;

        /**
         * The name of the database
         */
        name: string;

        /**
         * Specifies if plain objects are returned instead of SuperDBObjects
         */
        raw?: boolean;

        /**
         * Set filename of file
         */
         filename?: string;
    }

    /**
     * Private SuperDB options inside the SuperDB class
     */
    interface SuperDBPrivateOptions extends SuperDBOptions {
        /**
         * The file of the database
         */
        file: string;
    }

    /**
     * Class representing an error from SuperDB
     */
    class SuperDBError extends Error { }

    /**
     * Class that contains every method to parse options or modify data
     */
    class SuperDBUtils {
        /**
         * The file that contains the data
         */
        public file: string;

        /**
         * SuperDBUtils class
         * @param {string} file The file that contains the data
         */
        constructor(file: string);

        /**
         * Returns all the data stored
         * @returns {Object} The data
         */
        public getAll(): Object;

        /**
         * Gets an element stored
         * @param {string} id The ID of the element to get
         * @returns {any} The element
         */
        public get(id: string): any;

        /**
         * Sets an element and stores it
         * @param {string} id The ID of the element to set
         * @param {any} data The value of the element
         * @param {boolean} create If it's in creation mode
         * @returns {any} The new value
         */
        public set(id: string, data: any, create: boolean): any;

        /**
         * Checks if a value is valid to store
         * @param {any} value The value to check
         * @returns {boolean} If it's valid
         */
        static validValue(value: any): boolean;

        /**
         * Converts any valid data to string
         * @param {any} data The data to convert in a string
         * @returns {string} The data converted
         */
        static stringifyData(data: any): string;

        /**
         * Checks if an ID is valid
         * @param {string} id The ID to check
         * @returns {boolean} If it's valid
         */
        static validId(id: string): boolean;
    }

    /**
     * An Object from a database
     */
    class FullSuperDBObject<T extends {} = {}> {
        private readonly __id: string;
        private readonly __file: string;

        /**
         * Saves the modified object
         */
        save(): T;
    }

    type SuperDBObject<T extends {} = {}, R extends 'raw' | 'full' = never> = R extends 'raw' ? {} : FullSuperDBObject<T>;

    /**
     * Class representing a database
     */
    class SuperDB<R extends 'raw' | 'full' = 'full'> {
        /**
         * The SuperDB private options
         */
        private _options: SuperDBPrivateOptions;

        /**
         * The SuperDB private utils
         */
        private _utils: SuperDBUtils;

        /**
         * Create or get a database.
         * @param {SuperDBOptions} options SuperDB options object
         * @throws {SuperDBError} If any value is invalid
         */
        constructor(options: SuperDBOptions);

        /**
         * Returns all data stored in the database
         * @returns {(SuperDBObject|any)} All the data
         */
        public all(): SuperDBObject | any;

        /**
         * Creates an element in the database (only if it doesn't exists already)
         * @param {string} id The ID to create
         * @param {any} initialValue The initial value
         * @returns {any} The created element
         * @throws {SuperDBError} If the ID or initial value are invalid
         */
        public create<T = any>(id: string, initialValue: T): T;

        /**
         * Deletes an element from the database
         * @param {string} id The ID of the element
         * @returns {any} The deleted element
         * @throws {SuperDBError} If the ID is invalid or the element doesn't exists
         */
        public delete<T = any>(id: string): T;

        /**
         * Checks if an element exists in the database
         * @param {string} id The ID to check
         * @returns {boolean} If it exists
         * @throws {SuperDBError} If the ID is invalid
         */
        public exists(id: string): boolean;

        /**
         * Gets an element of the database
         * @param {string} id The ID of the element
         * @returns {(SuperDBObject|any)} The element
         * @throws {SuperDBError} If the ID is invalid
         */
        public get<T = any>(id: string): T extends object ? (SuperDBObject<T, R> & T) : T;

        /**
         * Sets the value of an element in the database
         * @param {string} id The ID of the element
         * @param {any} value The value to be setted
         * @returns {any} The value setted
         * @throws {SuperDBError} If the ID or value is invalid
         */
        public set<T = any>(id: string, value: T): T;


        /**
         * Finds an element in the database
         * @param {Function} callback The function to check elements
         * @param {string} id The ID to start checking
         * @returns {(SuperDBObject|any)} The element
         * @throws {SuperDBError} If the ID or callback is invalid
         */
        public find<T = any>(callback: (data: T) => boolean, id?: string): T extends object ? (SuperDBObject<T, R> & T) : T;

        /**
         * Filters elements in the database
         * @param {Function} callback The function to filter the elements
         * @param {string} id The ID to start filtering
         * @returns {(SuperDBObject|any)[]} The elements (SuperDBObject[] if they're objects, array with ID and value if not)
         * @throws {SuperDBError} If the ID or callback is invalid
         */
        public filter<T = any>(callback: (data: T) => boolean, id?: string): (T extends object ? (SuperDBObject<T, R> & T) : T)[];
    }

    export = SuperDB;
}