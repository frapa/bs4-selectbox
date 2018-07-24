require('./bs4-selectbox.css');
require('./bs4-selectbox.module.js');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

angular.module('bs4-selectbox').directive('bs4selectbox', [function () {
    return {
        restrict: 'E',
        template: require('./bs4-selectbox.directive.html'),
        scope: {
            options: '=', // must be array of objects
            model: '=', // must be array of objects
            multiple: '@',
            searchAttrs: '@',
            key: '@',
        },
        transclude: true,
        bindToController: true,
        controllerAs: 'bs4selectboxCtrl',
        controller: scBs4selectboxController,
    };
}]);

scBs4selectboxController.$inject = ['$scope'];

function scBs4selectboxController($scope) {
    const ctrl = this;

    ctrl.search = '';
    $scope.item = {};
    ctrl.uuid = uuidv4();

    ctrl.available = available;
    ctrl.select = select;
    ctrl.deselect = deselect;
    ctrl.keydown = keydown;

    // --------------------------------

    function search(obj) {
        const searchAttrs = ctrl.searchAttrs.split(',').map(s => s.trim());

        let found = false;
        for (const attr of searchAttrs) {
            if (obj[attr].toLowerCase().indexOf(ctrl.search.toLowerCase()) !== -1) {
                found = true;
                break;
            }
        }

        return found;
    }

    function inModel(option) {
        if (ctrl.key) {
            return ctrl.model.findIndex(opt => opt[ctrl.key] === option[ctrl.key]) !== -1;
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

    function select(evt, option) {
        if (ctrl.multiple) {
            ctrl.model.push(option);
        } else {
            $scope.item = option;
            ctrl.model[0] = option;
        }
    }

    function deselect(evt, option) {
        if (!ctrl.multiple) {
            $scope.item = {};
        }

        ctrl.model.splice(ctrl.model.indexOf(option), 1);
        evt.stopPropagation();
    }

    function keydown(evt) {
        if (evt.keyCode === 8 && !evt.target.value && ctrl.model.length) {
            deselect(evt, ctrl.model.slice(-1)[0]);
        }
    }
}