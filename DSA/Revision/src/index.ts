// Parse JSON string thanh object
const jsonString = `{"name": "Alice", "age": 25, "isStudent": true}`;
const parsedUser = JSON.parse(jsonString);

console.log(parsedUser.name);
console.log(parsedUser.age);
