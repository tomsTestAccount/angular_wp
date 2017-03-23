"use strict";
var User = (function () {
    function User(
        //"@id" : string;
        description, email, fullname, home_page, id, location, username) {
        this.description = description;
        this.email = email;
        this.fullname = fullname;
        this.home_page = home_page;
        this.id = id;
        this.location = location;
        this.username = username;
    }
    ;
    return User;
}());
exports.User = User;
var User4Create = (function () {
    function User4Create(email, lastName, firstName, password) {
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.password = password;
    }
    ;
    return User4Create;
}());
exports.User4Create = User4Create;
/*
export class User
{

    constructor(){};

    "@id" : string;
    "description" :  string;
    "email":  string;
     "fullname":   string;
     "home_page":   string;
     "id":  string;
     "location":   string;
     "username":   string;

}


export class User4Create
{

    constructor(){};


    "email":  string;
    "lastName":   string;
    "firstName":   string;

}

*/
/*export function create_test_Hash(givenString:string) {
 var hash = 0;
 if (givenString.length == 0) return hash;
 for (let i = 0; i < givenString.length; i++) {
 let char = givenString.charCodeAt(i);
 hash = ((hash<<5)-hash)+char;
 hash = hash & hash; // Convert to 32bit integer
 }
 return hash;
 }

 export class User {
 constructor(
 public email: string,
 public password: string,
 public firstName: string,
 public lastName: string
 ){}
 }
 */
//# sourceMappingURL=user.js.map