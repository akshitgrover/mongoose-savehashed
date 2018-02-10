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

	Schema.statics.compareHashed = function(obj,hobj,options){
		var hdata = [];
		if(!hobj){
			hdata.push("password");
		}
		else{
			hdata = Object.keys(hobj);
		}
		return new Promise((resolve,reject)=>{
			this.find(obj).then((data)=>{
				if(data.length == 0){
					resolve(null);
				}
				var flag = [];
				data.forEach((inst)=>{
					var f = 1;
					hdata.forEach((kinst)=>{
						if(!bcrypt.compareSync(hobj[kinst],inst[kinst])){
							f = 0;
						}
					});
					if(f == 1){
						flag.push(inst);
					}
				});
				if(flag.length == 0){
					resolve(null);
				}
				else if(options && options.size == 1){
					resolve(flag[0]);
				}
				else if(flag.length == 1){
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