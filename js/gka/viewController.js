define(function(){

var viewController = {
	views: []
}

var getViewByName = function(viewName){
	var view
	viewController.views.forEach(function(_view){
		if(_view.name == viewName){
			view = _view
			return
		}
	})
	return view
}

return {
	viewController: viewController,

	refreshAll: function(){
		viewController.views.forEach(function(view){
			view.refresh && view.refresh()
		})
	},
	
	addView: function(view){
		view.placeAt(dojo.byId("views"))
		viewController.views.push(view)
	},

	selectView: function(view, params){
		viewController.views.forEach(function(_view){
			dojo.style(_view.domNode, "display", "none")
		})
		if(typeof view == "string"){
			view = getViewByName(view)
		}
		dojo.style(view.domNode, "display", "")
		view.onShow(params)
		viewController.selectedView = view
	},
	
	onViewClosed: function(view, message, params){
		this.selectView(message, params)
	}
}

})
