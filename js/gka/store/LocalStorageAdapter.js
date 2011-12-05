define([
	"dojo/_base/declare",
	"dojo/_base/connect",
	"dojo/store/Memory"
], function(declare, connect, memoryStore){


return declare(null, {
	
	store: null,
	
	constructor: function(){
		var i = 0, l, key, items = []
		for(l = localStorage.length; i < l; ++i){
			key = localStorage.key(i)
			if(key.indexOf("transaction_") === 0){
				items.push(JSON.parse(localStorage.getItem(key)))
			}
		}
		this.store = new memoryStore({data: items})
		this._connects = [
			connect.connect(this.store, "put", this, "_put"),
			connect.connect(this.store, "remove", this, "_remove")
		]
	},
	
	_put: function(object, options){
		localStorage.setItem("transaction_" + object.id, JSON.stringify(object))
console.log('localStorage.setItem(transaction_' + object.id + ', ' + JSON.stringify(object) + ')')
	},
	
	_remove: function(id){
		localStorage.removeItem("transaction_" + id)
console.log('localStorage.removeItem(transaction_' + id + ')')
	}

})

})
