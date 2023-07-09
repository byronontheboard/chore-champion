const date= new Date();
date.setHours(date.getHours()-12);
console.log(date.toJSON());


let encodedDate = encodeURIComponent(date.toISOString());
console.log(decodeURIComponent(encodedDate))

console.log( new Date(encodedDate))