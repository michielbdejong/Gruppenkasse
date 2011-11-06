define([
	"dojo/_base/declare",
	"dojo/_base/connect",
	"dojo/store/Memory"
], function(declare, connect, memoryStore){


return declare(null, {
	
	store: null,
	
	constructor: function(){
		var index, key, items = []
		index = JSON.parse(localStorage.getItem('_remoteStorageIndex'))
		for(key in index){
			items.push(JSON.parse(remoteStorage.getItem(key)))
		}
		this.store = new memoryStore({data: items})
		this._connects = [
			connect.connect(this.store, "put", this, "_put"),
			connect.connect(this.store, "remove", this, "_remove")
		]
	},
	
	_put: function(object, options){
		remoteStorage.setItem(object.id, JSON.stringify(object))
console.log('remoteStorage.setItem(' + object.id + ', ' + JSON.stringify(object) + ')')
	},
	
	_remove: function(id){
		remoteStorage.removeItem(id)
console.log('remoteStorage.removeItem(' + id + ')')
	}

})

})
