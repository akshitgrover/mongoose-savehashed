const mongoose = require('mongoose');
const expect = require('expect');
const bcrypt = require('bcrypt-nodejs');

const savehashed = require('./../index.js');

mongoose.plugin(savehashed);

const model = require('./model.js');

before((done)=>{
	
	mongoose.connect("mongodb://localhost:27017/savehashedTest",(err,db)=>{

		if(err){
			return done(err);
		}
		done();

	});

});	

describe("saveHashed Tests",()=>{

	beforeEach((done)=>{
		model.remove({}).then((data)=>{
			done();
		}).catch((err)=>{
			done(err);
		});
	});

	it("Should Hash Password",(done)=>{
		model.create({username:"akshitgrover",password:"1516"}).then((data)=>{
			return data.saveHashed();
		}).then((str)=>{
			return model.findOne({username:"akshitgrover"})
		}).then((fdata)=>{
			expect(bcrypt.compareSync("1516",fdata.password)).toBeTruthy();
			done();
		}).catch((err)=>{
			done(err)
		});
	});

	it("Should Hash Multiple Values",(done)=>{
		model.create({username:"akshitgrover",password:"1516",confirmpassword:"1516"}).then((data)=>{
			return data.saveHashed(["password","confirmpassword"]);
		}).then((str)=>{
			return model.findOne({username:"akshitgrover"});
		}).then((fdata)=>{
			expect(bcrypt.compareSync("1516",fdata.password)).toBeTruthy();
			expect(bcrypt.compareSync("1516",fdata.confirmpassword)).toBeTruthy();
			done();
		}).catch((err)=>{
			done(err);
		});
	});

});

describe("compareHashed Tests",()=>{

	before((done)=>{

		model.remove({}).then((data)=>{
			return model.create({username:"akshitgrover",password:"1516",confirmpassword:"1516"});
		}).then((data)=>{
			return data.saveHashed(["password","confirmpassword"]);
		}).then((data)=>{
			done();
		}).catch((err)=>{
			done(err);
		});

	});

	it("Should Compare Hashed Password",(done)=>{
		model.compareHashed({username:"akshitgrover"},{password:"1516"}).then((data)=>{
			expect(data.username).toBe("akshitgrover");
			done();
		}).catch((err)=>{
			done(err);
		});
	});

	it("Should Compare Multiple Hashed Values",(done)=>{
		model.compareHashed({username:"akshitgrover"},{password:"1516",confirmpassword:"1516"},{size:1}).then((data)=>{
			expect(data.username).toBe("akshitgrover");
			done();
		}).catch((err)=>{
			done(err);
		});
	});

	it("Should Find Multiple Docs",(done)=>{
		model.create({username:"akshitgrover",password:"1516",confirmpassword:"1516"}).then((data)=>{
			return data.saveHashed(["password","confirmpassword"]);
		}).then((data)=>{
			return model.compareHashed({username:"akshitgrover"},{password:"1516",confirmpassword:"1516"});
		}).then((data)=>{
			expect(data[0].username).toBe("akshitgrover");
			expect(data[1].username).toBe("akshitgrover");
			done();	
		}).catch((err)=>{
			done(err);
		});
	});	

	it("Should Find Single Doc When Multiple Docs Exists",(done)=>{
		model.compareHashed({username:"akshitgrover"},{password:"1516",confirmpassword:"1516"},{size:1}).then((data)=>{
			expect(data.username).toBe("akshitgrover");
			done();	
		}).catch((err)=>{
			done(err);
		});
	});	

});