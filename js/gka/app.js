define([
	"gka/store/LocalStorageAdapter"
], function(LSA){

var store = new LSA({localStorageKey: "badminton", dataArrayKey: "transactions"}).store

return {
	
	store: store,
	
	getAccounts: function(transactions){
		var costs = 0, share = 0, accounts = {}
		transactions.forEach(function(transaction){
			transaction.payments.forEach(function(payment){
				costs += payment.amount
				share = payment.amount / transaction.participants.length
				transaction.participants.forEach(function(participant){
					accounts[participant] = accounts[participant] || 0
					accounts[participant] -= share
					if(payment.participant == participant){
						accounts[participant] += payment.amount
					}
				})
			})
		})
		return accounts
	},
	
	saveEntry: function(data){
		store.put(data)
	},
	
	deleteEntry: function(id){
		store.remove(id)
	}
}

})
