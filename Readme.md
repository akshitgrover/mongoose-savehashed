# What is mongoose-savehashed?

<b>mongoose-savehashed</b> is mongoose plugin built for node.js which helps you to save and compare hashed values.

<b>Note:</b> Right Now, This plugin completely functions on promises, Based on feedback callback support will be added.

-----------

# How to install?

<b>Type</b> (On CLI):

```
npm install mongoose-savehashed --save
```

-----------

# Usage:

<br>

-----------

### <b>NOTE: Register The Plugin Before Calling Model In Any File In Your App, Register Only Once.</b>

<br>

## Register The Plugin For All Schemas:

```javascript
const mongoose-savehashed = require('mongoose-savehashed');

mongoose.plugin(mongoose-savehashed); // To Register For All Schemas
```

<br>

## Register The Plugin For Specific Schemas:

```javascript
const mongoose = require('mongoose');

const mongoose-savehashed = require('mongoose-savehashed');

const Schema = mongoose.Schema;

const someSchema = new Schema({
		someAttr:{
			type:'string'
		}
	});

someSchema.plugin(mongoose-savehashed);

const someModel = mongoose.model('someModel',someSchema);
```

-----------


## Calling saveHashed

### Consider a userModel.js

Here you want to hash password and a secretKey before storing in MongoDb.

```javascript
const mongoose = require('mongoose');

const mongoose-savehashed = require('mongoose-savehashed');

const Schema = mongoose.Schema;

const userSchema = new Schema({
		username:{
			type:'string'
		},
		password:{
			type:'string'
		},
		secretKey:{
			type:'string'
		}
	});

userSchema.plugin(mongoose-savehashed);

module.exports = mongoose.model('user',userSchema);
```

### Consider userController.js

```javascript
const User = require('./userModel.js');

User.create({username:"akshitgrover",password:"1516",secretKey:"151617"}).then((user)=>{
	

	//Pass list of object properties to hash, If no list passed by default "password" is chosen.

	user.saveHashed(["password","secretKey"]).then((str)=>{

		console.log(str);

	}).catch((err)=>{

		console.log(err);

	}); 
});
```

## Calling compareHased

### Consider userController.js

```javascript
const User = require('./userModel.js');

// Pass A Query to find the documents and acctual values to compare which are hashed in MongoDb

const query = {username:"akshitgrover"};

const values = {password:"1516",secretKey:"151617"};

cosnt options = {size:1} // To Get A Single Document, As Many Documents Can Match (optional)

User.compareHashed(query,values).then((users)=>{
	
	console.log(users); // List of matched with hashed values documents.

}).catch((err)=>{

	console.log(err);

});

//Passing Options

User.compareHashed(query,values,options).then((user)=>{
	
	console.log(users); // First Document matched and compared wiht hashed values.

}).catch((err)=>{

	console.log(err);

});


```


