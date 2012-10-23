App = Ember.Application.create({
  
  ApplicationView: Ember.View.extend({
    templateName: 'application'
  }),
  
  ApplicationController: Ember.Controller.extend(),
  
  Transaction: Ember.Object.extend(),
  
  TransactionsView: Ember.View.extend({
    templateName: 'transactions'
  }),
  
  TransactionsController: Ember.ArrayController.extend({
    content: []
  }),
  
  TransactionView: Ember.View.extend({
    templateName: 'transaction'
  }),
  
  TransactionController: Ember.ObjectController.extend(),
  
  Router: Ember.Router.extend({
    enableLogging: true,
  //  goToCars: Ember.Route.transitionTo('cars'),
  //  goToShoes: Ember.Route.transitionTo('shoes.index'),
  //  goHome: Ember.Route.transitionTo('index'),
    root: Ember.Route.extend({
      index: Ember.Route.extend({
        route: '/',
        showTransaction: Ember.Route.transitionTo('root.transaction'),
        connectOutlets: function(router){
          router.get('applicationController').connectOutlet('transactions', App.Transaction.find());
        }
      }),
      transaction: Ember.Route.extend({
        route: '/:transaction_id',
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
  })
});

App.Transaction.reopenClass({
  find: function(id){
    var prefix = 'gka_transaction_';
    function doPrefix(key){
      return prefix + key;
    }
    function json2model(json){
      var obj = JSON.parse(json);
      var model = App.Transaction.create(obj);
      return model;
    }
    if(id){
      var json = localStorage.getItem(doPrefix(id));
      return json2model(json);
    }else{
      var models = [];
      for(var i = 0, l = localStorage.length; i < l; ++i){
        var key = localStorage.key(i);
        if(key.indexOf(prefix) === 0){
          var json = localStorage.getItem(key);
          models.push(json2model(json));
        }
      }
      return models;
    }
  }
});

App.initialize();
