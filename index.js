const bcrypt = require('bcrypt-nodejs');

const func = (Schema,options)=>{

	Schema.methods.saveHashed = function(arr){
		var hdata = [];
		if(!arr){
			hdata.push("password");
		}
		else{
			hdata = arr;
		}
		hdata.forEach((inst)=>{
			if(this[inst]){
				this[inst] = bcrypt.hashSync(this[inst]);
			}
		});
		return new Promise((resolve,reject)=>{
			this.save().then(()=>{
				resolve("Saved");
			}).catch((err)=>{
				reject(err);
			});
		});
	}

	Schema.statics.compareHashed = function(obj,hobj){
		var hdata = [];
		if(!hobj){
			hdata.push("password");
		}
		else{
			hdata = hobj.keys();
			console.log(hobj.keys());
		}
		return new Promise((resolve,reject)=>{
			this.find(obj).then((data)=>{
				if(!data){
					resolve(null);
				}
				var flag = [];
				data.forEach((inst)=>{
					hobj.keys().forEach((kinst)=>{
						if(bcrypt.compareSync(hobj[kinst],inst[kinst])){
							flag.push(data);
						}
					});
				});
				if(flag.length == 1){
					resolve(flag[0]);
				}
				else{
					resolve(flag);
				}
			})
		});
	}
}

module.exports = func;