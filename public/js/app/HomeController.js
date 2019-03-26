app.controller('HomeController', ['$scope', '$http', function($scope, $http) {
	
	$scope.$root.URL_RETROCESO = "../../GestionServicios"

	$scope.$root.TITULO_IZQUIERDA = "Logística de Vales y Vehículos"

	$http({

		method: 'GET',
		url: 'routes/home/solicitudes_pendientes.php'

	}).then(function successCallback(response){

		console.log(response.data)

		$scope.pendientes = response.data[0]
		$scope.pendientes_m = response.data[1]
		$scope.usuario = response.data[2]

	})

}])