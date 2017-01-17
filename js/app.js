(function() {
    angular.module("NarrowItDownApp", [])
        .service("MenuSearchService", MenuSearchService)
        .controller("NarrowItDownController", NarrowItDownController)
        .component("foundItems", {
            templateUrl: "foundItems.html",
            controller: FoundItemsComponentController,
            bindings: {
                list: "<",
                onRemove: "&"
            }
        })
        .constant('MenuItemsUrl', "https://davids-restaurant.herokuapp.com/menu_items.json");
 
 
    NarrowItDownController.$inject = ['MenuSearchService']; 
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        
        ctrl.found = [];

        ctrl.onNarrow = function() {
            if (ctrl.searchTerm === "") {
                ctrl.found = [];
                return;
            }
            
            var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
            promise.then(function (result) {
                // process result and only keep items that match
                var filtered = [];
                var menuItems = result.data.menu_items;
                for (index = 0; index < menuItems.length; ++index) {
                    item = menuItems[index];
                    if (item.description.indexOf(ctrl.searchTerm) !== -1) {
                        filtered.push(item);
                    }
                }
                // return processed items
                ctrl.found = filtered;
            });
            //ctrl.found = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
        };
        
        ctrl.onDelete = function(idx) {
            ctrl.found.splice(idx, 1);
        };
        
    };

    MenuSearchService.$inject = ['$http', 'MenuItemsUrl'];
    function MenuSearchService($http, MenuItemsUrl) {
        var service = this;
        
        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                url: MenuItemsUrl
            });
        };
    };

    FoundItemsComponentController.$inject = ["$element"];
    function FoundItemsComponentController($element) {
        var $ctrl = this;
        
        $ctrl.remove = function (myIndex) {
            $ctrl.onRemove({ index: myIndex });
        };
    };
})();