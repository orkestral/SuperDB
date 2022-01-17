console.time('SuperDB');

const SuperDB = require('../src');

const db = new SuperDB({
    dir: __dirname,
    name: 'test',
    raw: false,
    filename: 'filename' // Filename (optional, default: null)
});

console.log('Object creation (only if it doesn\'t exist)');
console.log(db.create('0001', {
    name: 'David',
    country: 'CO',
    info: 'Nothing to show'
}), '\n');

console.log('Object creation (only if it doesn\'t exist)');
console.log(db.create('0002', {
    name: 'Free',
    country: 'NI',
    info: 'Nothing to show'
}), '\n');

console.log('Obtaining an object with ID 0001');
const object = db.get('0001');
console.log(object, '\n');

console.log('Editing \'name\' key and saving');
process.stdout.write(`${object.name} - `);
object.name = 'Deivid';
object.save();
console.log(object.name, '\n');

console.log('Setting directly the value of an element');
console.log(db.set('0002.info', 'Just a person'), '\n');

console.log('List of objects');
let temp = '';
Object.entries(db.all()).forEach((u) => {
    temp += `   - ${u[1].name} (${u[0]})\n`;
});
console.log(temp.trimRight(), '\n');

console.log('Finding an object with property \'country\' as \'NI\'');
console.log(db.find((u) => u.country === 'NI'), '\n');

console.log('Filtering objects with property \'name\' (all objects have it*)');
console.log(db.filter((u) => u.name), '\n');

console.log('Deleting an object');
console.log(db.delete('0001'), '\n');

console.timeEnd('SuperDB');