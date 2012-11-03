Model = Ember.Object.extend({
  willDestroy: function(){
    this.deleteRecord();
  },
  deleteRecord: function(){
    App.store.deleteRecord(this.constructor, this.get('id'));
  }
});
Model.reopenClass({
  find: function(){
    var args = [].slice.call(arguments);
    args.unshift(this);
    return App.store.find.apply(App.store, args);
  }
});

App = Ember.Application.create({
  
  ApplicationView: Ember.View.extend({
    templateName: 'application'
  }),
  
  ApplicationController: Ember.Controller.extend(),
  
  Transaction: Model.extend(),
  
  TransactionsView: Ember.View.extend({
    templateName: 'transactions',
    classNames: 'listView'
  }),
  
  TransactionsController: Ember.ArrayController.extend({
    content: []
  }),
  
  TransactionView: Ember.View.extend({
    templateName: 'transaction'
  }),
  
  TransactionController: Ember.ObjectController.extend(),
  
  AccountsView: Ember.View.extend({
    templateName: 'accounts'
  }),
  
  AccountsController: Ember.ArrayController.extend({
    content: [],
    accounts: [],
    contentChanged: (function(){
      var transactions = this.get('content').content;
      var costs = 0, share = 0, accounts = {};
      transactions.forEach(function(transaction){
        transaction.payments.forEach(function(payment){
          costs += payment.amount;
          share = payment.amount / transaction.participants.length;
          transaction.participants.forEach(function(participant){
            accounts[participant] = accounts[participant] || 0;
            accounts[participant] -= share;
            if(payment.participant == participant){
              accounts[participant] += payment.amount;
            }
          });
        });
      });
      var accountList = [];
      for(var participant in accounts){
        accountList.push({participant: participant, balance: accounts[participant]});
      }
      this.set('accounts', accountList);
    }).observes('content.@each')
  }),
  
  NewEntryView: Ember.View.extend({
    templateName: 'new-entry',
    classNames: ['newEntryView']
  }),
  
  NewEntryController: Ember.ArrayController.extend({
    content: [],
    
    createNewTransaction: function(){
      var participants = this.get('participants').split(',');
      var payments = [];
      this.get('payments').split(',').forEach(function(payment){
        var p = payment.split(':');
        payments.push({participant: p[0], amount: parseFloat(p[1])});
      });
      this.pushObject(App.Transaction.create({
        id: '' + new Date().getTime(),
        box: 'this.app.box',
        type: 'spending',
        title: this.get('title'),
        date: new Date(parseInt(this.get('date'), 10)).getTime(),
        participants: participants,
        payments: payments
      }));
    }
  }),
  
  Router: Ember.Router.extend({
    enableLogging: true,
  //  goToCars: Ember.Route.transitionTo('cars'),
  //  goToShoes: Ember.Route.transitionTo('shoes.index'),
  //  goHome: Ember.Route.transitionTo('index'),
    root: Ember.Route.extend({
      showAccounts: Ember.Route.transitionTo('index'),
      showTransactions: Ember.Route.transitionTo('transactions'),
      showTransaction: Ember.Route.transitionTo('transaction'),
      showNewTransaction: Ember.Route.transitionTo('newTransaction'),
      deleteTransaction: function(router, event){
        var transactionController = event.context;
        var transactionModel = transactionController.get('content');
        router.get('transactionsController').removeObject(transactionModel);
        transactionModel.destroy();
        router.transitionTo('transactions');
      },
      submitNewTransaction: function(router, event){
        var controller = event.context;
        controller.createNewTransaction();
        router.transitionTo('index');
      },
      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router){
          router.get('applicationController').connectOutlet('accounts', App.Transaction.find());
        }
      }),
      transactions: Ember.Route.extend({
        route: '/transactions',
        connectOutlets: function(router){
          router.get('applicationController').connectOutlet('transactions', App.Transaction.find());
        }
      }),
      transaction: Ember.Route.extend({
        route: '/transactions/:transaction_id',
        // deserialize: function(router, context){
        //   var transactionsControllerContent = router.get('transactionsController').content;
        //   for(var i = 0, l = transactionsControllerContent.length; i < l; ++i){
        //     var transaction = transactionsControllerContent[i];
        //     if(transaction.get('id') === context.id){
        //       return transaction;
        //     }
        //   }
        // },
        connectOutlets: function(router, transaction){
          router.get('applicationController').connectOutlet('transaction', transaction);
        }
      }),
      newTransaction: Ember.Route.extend({
        route: '/transactions/new',
        connectOutlets: function(router){
          router.get('applicationController').connectOutlet('newEntry', App.Transaction.find());
        }
      })//,
      // shoes: Ember.Route.extend({
      //   showShoe: Ember.Route.transitionTo('shoes.shoe'),
      //   route: '/shoes',
      //   index: Ember.Route.extend({
      //     route: '/',
      //     enter: function ( router ){
      //       console.log("The shoes sub-state was entered.");
      //     },
      //     connectOutlets: function(router, context){
      //       router.get('applicationController').connectOutlet('greeting', 'salutation',
      //                                                         { greeting: "Shoes Route" });
      //       router.get('applicationController').connectOutlet('body', 'shoes', App.Shoe.all());
      //       router.get('applicationController').connectOutlet('footer', 'traversal');
      //       router.get('traversalController').connectOutlet('home');
      //     }
      //   }),
      //   shoe: Ember.Route.extend({
      //     route: '/shoe/:id',
      //     enter: function ( router ){
      //       console.log("The shoe detail sub-state was entered.");
      //     },
      //     deserialize: function(router, context){
      //       return App.Shoe.find( context.id );
      //     },
      //     serialize: function(router, context){
      //       return {
      //         id: context.id
      //       }
      //     },
      //     connectOutlets: function(router, aShoe){
      //       router.get('applicationController').connectOutlet('greeting', 'salutation',
      //                                                         { greeting: "Shoes.Shoe Route" });
      //       router.get('applicationController').connectOutlet('body', 'shoe', aShoe);
      //       router.get('applicationController').connectOutlet('footer', 'traversal');
      //     }
      //   })
      // }),
      // cars: Ember.Route.extend({
      //   route: '/cars',
      //   enter: function ( router ){
      //     console.log("The cars sub-state was entered.");
      //   },
      //   connectOutlets: function(router, context){
      //     router.get('applicationController').connectOutlet('greeting', 'salutation',
      //                                                       { greeting: "Cars Route" });
      //     router.get('applicationController').connectOutlet('body', 'cars');
      //     router.get('applicationController').connectOutlet('footer', 'traversal');
      //     router.get('traversalController').connectOutlet('home');
      //   }
      // })
    })
  }),
  store: Ember.Object.create({
    localStoragePrefix: 'gka_transaction_',
    doLocalStoragePrefix: function(key){
      return this.localStoragePrefix + key;
    },
    init: function(){
      this.loadData();
    },
    loadData: function(){
      var prefix = this.localStoragePrefix;
      var transactions = [];
      for(var i = 0, l = localStorage.length; i < l; ++i){
        var key = localStorage.key(i);
        if(key.indexOf(prefix) === 0){
          var json = localStorage.getItem(key);
          var transaction = JSON.parse(json);
          transactions.push(transaction);
        }
      }
      this.data = transactions;
    },
    find: function(type, id) {
      var transactions = this.data;
      if(id){
        var transactionModel = this.transactionModel;
        if(transactionModel){
          return transactionModel;
        }
        for(var i = 0, l = transactions.length; i < l; ++i){
          var transaction = transactions[i];
          if(transaction.id === id){
            transactionModel = this.transactionModel = type.create(transaction);
            return transactionModel;
          }
        }
      } else {
        var array = this.transactionArrayProxy;
        if(array){
          return array;
        }
        array = Ember.ArrayProxy.create({content: []});
        transactions.forEach(function(transaction){
          array.pushObject(type.create(transaction));
        });
        this.transactionArrayProxy = array;
        return array;
      }
    },
    deleteRecord: function(type, id){
      localStorage.removeItem(this.doLocalStoragePrefix(id));
    }
  })
});

Handlebars.registerHelper('formatDate', function(property, options){
  var value = Ember.Handlebars.get(this, property, options);
  return new Date(value).toLocaleDateString();
});
Handlebars.registerHelper('currency', function(property, options){
  var value = Ember.Handlebars.get(this, property, options);
  return value.toFixed(2) + " €";
});

App.initialize();
