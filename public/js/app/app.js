var app = angular.module("app", ["ngRoute", "ui.bootstrap", "checklist-model","ngSanitize"])
    

app.filter('beginning_data', function(){
    return function(input, begin){
        if (input) {
            begin = +begin
            return input.slice(begin)
        }
        return []
    }
})

app.directive('fileInput', function($parse){
    return{
        restrict : 'A',
        link: function(scope, elem, attrs){
            elem.bind('change', function(){
                $parse(attrs.fileInput).assign(scope,elem[0].files)
            })
        }
    }
})

//Configuracion de rutas
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
	.when('/', {
		templateUrl: 'views/layouts/home.html',
        controller: 'HomeController'
	})
    .when('/vehiculos', {
        templateUrl: 'views/layouts/vehiculos.html'
    })
    .when('/vales', {
        templateUrl: 'views/layouts/vales/lista_vales.html'
    })
    .when('/cuotas_combustible', {
        templateUrl: 'views/layouts/cuotas_combustible/cuotas_combustible.html',
        controller: 'cuotasCombustibleController'
    })
    .when('/solicitudes_vales', {
        templateUrl: 'views/layouts/solicitudes_vales/solicitudes_vales.html',
        controller: 'solicitudesValesController'
    })
    .when('/reportes', {
        templateUrl: 'views/layouts/reportes/reportes.html',
        controller: 'reportesController'
    })
    .when('/configuracion', {
        templateUrl: 'views/layouts/configuracion/configuracion.html',
        controller: 'configuracionCtrl'
    })
    .when('/vehiculos/detalles/:id', {
        templateUrl: 'views/layouts/detalles_vehiculo.html',
        controller: 'detalleVehiculoController'
    })
    .when('/vales/detalles/:id', {
        templateUrl: 'views/layouts/vales/detalles_vale.html',
        controller: 'detalleValeController'
    })
    .when('/vehiculos/detalles/:id/:gestion/:tipo/:idvale', {
        templateUrl: 'views/layouts/detalles_vehiculo.html',
        controller: 'detalleValeController'
    })
    .when('/vehiculos/detalles/:id/:gestion/:tipo', {
        templateUrl: 'views/layouts/detalles_vehiculo.html',
        controller: 'detalleValeController'
    })
    .when('/correo/enviar/1/1', {
        controller: 'mailController'
    })
    .otherwise({redirectTo:'/'})
	
}])