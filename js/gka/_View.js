define([
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_Container",
	"dijit/form/_FormMixin",
	"dijit/form/Button"
], function(){

dojo.declare(
	"gka._View",
	[dijit._Widget, dijit._TemplatedMixin, dijit._WidgetsInTemplateMixin, dijit._Container, dijit.form._FormMixin],
{
	// controller: [gka.ViewController]
	controller: null,
	
	close: function(view, message, params){
		this.controller.onViewClosed(view, message, params)
	},
	
	onShow: function(){}
})

})
