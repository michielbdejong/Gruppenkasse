var App = Em.Application.create();

App.TransactionsView = Em.View.extend();

App.Transaction = Em.Object.extend();

App.TransactionsController = Em.ArrayController.extend({
  content: [],
  init: function(){
    this._super();
    var json = '{"id":"1348302935202","box":"test","type":"spending","title":"test","date":1348264800000,"participants":["er","sie"],"payments":[{"participant":"er","amount":54}]}';
    var transaction = App.Transaction.create(JSON.parse(json));
    this.pushObject(transaction);
  }
});

App.transactionsController = App.TransactionsController.create();
