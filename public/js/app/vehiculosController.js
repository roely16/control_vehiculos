app.controller('vController', ['$scope', '$http', '$routeParams', '$timeout',function($scope, $http, $routeParams, $timeout) {

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1
	$scope.$root.URL_RETROCESO = "#/"

	$scope.$root.TITULO_IZQUIERDA = "Vehículos"

	//Se obtienen todos los vehiculos para mostrarlos en la tabla
	$http({

		method:'GET',
		url: 'routes/vehiculos/obtener.php'

	}).then(function successCallback(response){

		console.log(response.data)

		$scope.vehiculos = response.data[0]

		$scope.current_grid = 1
		$scope.data_limit = 10
		$scope.filter_data = $scope.vehiculos.length
		$scope.total_vehiculos = $scope.vehiculos.length

		$scope.$root.NOMBRE = response.data[1]["NOMBRE"] + " " + response.data[1]["APELLIDO"]

	}, function errorCallback(response){

		console.log(response.data)

	})

	$scope.page_position = function(page_number){

		$scope.current_grid = page_number
	}

	$scope.filter = function(){
		
		$timeout(function(){
			$scope.filter_data = $scope.searched.length
		}, 20)
	}

	$scope.sort_with = function(base){
		$scope.base = base
		$scope.reverse = !$scope.reverse
	}


}])
