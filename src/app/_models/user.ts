export class User
{

    constructor(

    //"@id" : string;
    public description :  string,
    public email:  string,
    public fullname:   string,
    public home_page:   string,
    public id:  string,
    public location:   string,
    public username:   string
    ){};

}


export class User4Create
{

    constructor(


    public email:  string,
    public lastName:   string,
    public firstName:   string,
    public password: string
    ){};

}


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
