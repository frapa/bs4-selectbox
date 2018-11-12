require('./bs4-selectbox.css');
require('./bs4-selectbox.module.js');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

angular.module('bs4-selectbox').directive('bs4Selectbox', [function () {
    return {
        restrict: 'E',
        template: require('./bs4-selectbox.directive.html'),
        scope: {
            options: '=', // must be array of objects
            model: '=', // must be array of objects
            multiple: '@',
            searchAttrs: '@',
            key: '@',
            callback: '=?', // callback to be called on change
        },
        transclude: true,
        bindToController: true,
        controllerAs: 'bs4SelectboxCtrl',
        controller: bs4SelectboxController,
    };
}]);

bs4SelectboxController.$inject = ['$scope'];

function bs4SelectboxController($scope) {
    const ctrl = this;

    ctrl.search = '';
    $scope.item = {};
    ctrl.uuid = uuidv4();

    ctrl.available = available;
    ctrl.select = select;
    ctrl.deselect = deselect;
    ctrl.keydown = keydown;
    ctrl.$onInit = $onInit;
    
    $scope.$watchCollection('bs4SelectboxCtrl.model', function () {
        if (!ctrl.multiple && ctrl.model.length) {
            $scope.item = ctrl.model[0];
        }
    });

    // --------------------------------

    function $onInit() {
        if (!ctrl.multiple && ctrl.model.length) {
            $scope.item = ctrl.model[0];
        }
    }

    function search(obj) {
        if (!ctrl.searchAttrs) {
            throw new Error('You must specify the search-attrs (potentially comma separated list) for the search in bs4-selectbox to work properly.');
        }

        const searchAttrs = ctrl.searchAttrs.split(',').map(s => s.trim());
        const search = ctrl.search.toLowerCase();

        let found = false;
        for (const attr of searchAttrs) {
            let value = obj[attr];

            if (value) {
                if (typeof value == 'string') {
                    value = value.toLowerCase();
                } else {
                    value = value.toString().toLowerCase();
                }

                if (value.indexOf(search) !== -1) {
                    found = true;
                    break;
                }
            }
        }

        return found;
    }

    function inModel(option) {
        if (ctrl.key) {
            return ctrl.model.findIndex(opt => opt[ctrl.key] == option[ctrl.key]) !== -1;
        } else {
            return ctrl.model.indexOf(option) !== -1;
        }
    }

    function available(option) {
        if (ctrl.search) {
            return !inModel(option) && search(option);
        } else {
            return !inModel(option);
        }
    }

    function focus() {
        const input = document.querySelector('#bs4-selectbox-' + ctrl.uuid + ' input');
        input.focus();
    }

    function select(evt, option) {
        if (ctrl.multiple) {
            ctrl.model.push(option);
        } else {
            $scope.item = option;
            ctrl.model[0] = option;
        }

        ctrl.search = '';

        evt.preventDefault();
        // keep focus
        focus();

        ctrl.callback && ctrl.callback('add', option, this.model, evt);
    }

    function deselect(evt, option) {
        if (!ctrl.multiple) {
            $scope.item = {};
        }

        ctrl.model.splice(ctrl.model.indexOf(option), 1);
        evt.stopPropagation();

        ctrl.callback && ctrl.callback('remove', option, this.model, evt);
    }

    function keydown(evt) {
        if (evt.keyCode === 8 && !evt.target.value && ctrl.model.length) {
            deselect(evt, ctrl.model.slice(-1)[0]);
        }
    }
}