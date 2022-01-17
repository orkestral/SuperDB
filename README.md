<div align="center">

![SuperDB](https://i.imgur.com/PBpuNcZ.png)

#### SuperDB is a javascript library with json based database

![Downloads](https://img.shields.io/npm/dt/superdb.js)  ![Minified Size](https://img.shields.io/bundlephobia/min/superdb.js) ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/superdb.js) ![License](https://img.shields.io/npm/l/superdb.js) ![Last Commit](https://img.shields.io/github/last-commit/orkestral/SuperDB) ![GitHub Repo stars](https://img.shields.io/github/stars/orkestral/SuperDB?style=social)

[![NPM](https://nodei.co/npm/superdb.js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/superdb.js/)
</div>

"Database" in JSON (Node.JS Library).

**Released v1.0.3**. See [CHANGELOG](https://github.com/orkestral/SuperDB/blob/master/CHANGELOG.md).


## Installation
- `npm install superdb.js --save`.

_I recommend not using versions lower than **1.0.3** or being aware of updates to the library._


## Usage
**JavaScript - CommonJS require**
```js
const SuperDB = require("superdb.js");

const db = new SuperDB({
    dir: __dirname,
    name: "database",
    raw: false, // Defines if SuperDB Objects will be returned (optional, default: false)
    filename: "" // Filename (optional, default: null)
});
```

**TypeScript - ES6 import**

With TypeScript you should've the `esModuleInterop` flag.
```ts
import SuperDB from "superdb.js";
// The generic type is optional, by default it's "full" but when using the raw option, use "raw" instead of "full"
const db = new SuperDB<'full'>({
    dir: __dirname,
    name: "database",
    raw: false, // Defines if SuperDB Objects will be returned (optional, default: false)
    filename: "" // Filename (optional, default: null)
});
```

### Example of all functions
```js
// Creating object (it'll search property by property and if it doesn't exist, it'll create it otherwise it'll not modify the current information~)
// * where the first parameter is the ID, they're like properties of an object (same thing in most functions)
const newBase = db.create("0001", {
    name: "Joe Dutra",
    country: "BR",
    info: "Nothing to show"
});
console.log(newBase);

// Obtaining an object
const object = db.get("0001");
console.log(object);

// Modifying an object and saving it
object.name = "Joe Dutra";
object.save();
console.log(object.name);

// Setting directly the value of an element
const newName = db.set("0001.info", "Just a person");
console.log(newName);

// Listing all objects
let temp = "";
Object.entries(db.all()).forEach((user) => {
    temp += `   - ${user[1].name} (ID: ${user[0]})\n`;
});
console.log(temp.trimRight());

// Finding an object
const anObject = db.find((user) => user.name === "Joe Dutra");
console.log(anObject);

// Filtering objects
const someObjects = db.filter((user) => user.country === "BR");
console.log(someObjects);

// Deleting an object
const deletedObject = db.delete("0001");
console.log(deletedObject);
```

### Important note while using TypeScript
You can use TypeScript Generics to `create`/`get`/`update`/`set`/`find`/`filter` the data, it doesn't matter what type you use.
```ts
const nonObjectValue = db.get<string>('0002.name');
console.log(nonObjectValue); // TS will interpret it as string

const numberValue = db.get<number>('some id here');
console.log(numberValue); // TS will interpret it as a number

const booleanValue = db.get<boolean>('some id here');
console.log(booleanValue); // TS will interpret it as a boolean

// With Objects/also works with interfaces
type Person = {
    name: string;
    country: string;
    info: string;
};

const objectValue = db.get<Person>('0002'); // This will return a SuperDBObject with the properties that you specified in the generic type
console.log(objectValue.name); // While typing '.name', you'll get *autocomplete*
// It also works when you save an SuperDBObject
objectValue.info = 'Hi!';

/// Important: Read the note in the Usage/TypeScript section.
objectValue.save(); // This will return a plain 'Person' object.
```

## "Documentation"
- [`new SuperDB(options)`](#superdb.js-options)
    - `create(id, initialValue)`
    - `exists(id)`
    - `get(id)`
    - `set(id, value)`
    - `all()`
    - `delete(id)`
    - `find(callback, id?)`
    - `filter(callback, id?)`
- [`SuperDBError`](#superdb.js-error)


## new SuperDB(options)
Creates or gets a database
- **Parameters**:
    - `options` - An object with the options
        - `options.dir` - A string indicating the directory that will have the database (must be an absolute path - the folder should be created)
        - `options.name` - A string with the name of the database
        - `options.raw?` - A boolean that represents if SuperDB Objects won't returned (default: `false`, SuperDB Objects will be returned).
- **Throws**: [`SuperDBError`](#superdb.js-error) - If any option is invalid


### Methods
#### `all()`
Returns all data stored in the database
- **Returns**: `SuperDBObject | object` - All data
<hr>

#### `create(id, initialValue)`
Creates an element in the database with the specified ID and sets it's value
- **Parameters**:
    - `id` - A string representing the ID of the element to create
    - `initialValue` - The initial value of the element
- **Returns**: `object` - The created element
- **Throws**: [`SuperDBError`](#superdb.js-error) - If the ID or initialValue is invalid
<hr>

#### `delete(id)`
Deletes an element from the database
- **Parameters**:
    - `id` - A string representing the ID of the element to delete
- **Returns**: `object` - The deleted element
- **Throws**: [`SuperDBError`](#superdb.js-error) - If the ID is invalid
<hr>

#### `exists(id)`
Checks if an element exists in the database
- **Parameters**:
    - `id` - A string representing the ID of the element to check
- **Returns**: `boolean` - If it exists
- **Throws**: [`SuperDBError`](#superdb.js-error) - If the ID is invalid
<hr>

#### `get(id)`
Gets an element of the database
- **Parameters**:
    - `id` - A string representing the ID of the element to get
- **Returns**: `SuperDBObject | object | any` - The element
- **Throws**: [`SuperDBError`](#superdb.js-error) - If the ID is invalid
<hr>

#### `set(id, value)`
Sets the value of an element in the database
- **Parameters**:
    - `id` - A string representing the ID of the element to update
    - `value` - The new value of the element
- **Returns**: `any` - The value setted
- **Throws**: [`SuperDBError`](#superdb.js-error) - If the ID or value is invalid
<hr>

#### `find(callback, id?)`
Finds an element in the database.
You __should only__ use this function if you're finding for objects
- **Parameters**:
- `callback` - A function that handles all the elements and decides which one will be returned
    - `id?` - A string representing the ID of the root element to find another elements _(optional)_
- **Returns**: `SuperDBObject | object | any` - The element
- **Throws**: [`SuperDBError`](#superdb.js-error) - If the ID or callback is invalid
<hr>

#### `filter(callback, id?)`
Filters elements in the database.
You __should only__ use this function if you're filtering for objects
- **Parameters**:
    - `callback` - A function that handles all the elements and decides which ones will be returned
    - `id?` - A string representing the ID of the root element to find another elements _(optional)_
- **Returns**: `(SuperDBObject | object | [string, any])[]` - The elements (SuperDBObject[] if they're objects, array with ID and value if not)
- **Throws**: [`SuperDBError`](#superdb.js-error) - If the ID or callback is invalid


## SuperDB-Error
Extends [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), only used for error reference.