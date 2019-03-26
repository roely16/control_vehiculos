app.controller('ValesCtrl', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

	$scope.$root.URL_RETROCESO = "#/"

	$scope.$root.TITULO_IZQUIERDA = "Vales"

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	$http({

		method:'GET',
		url: 'routes/vales/listar_vales.php'

	}).then(function successCallback(response){

		$scope.vales = response.data[0]
		$scope.vales_restantes = response.data[1]["COUNT(VALEID)"]

		$scope.current_grid = 1
		$scope.data_limit = 10
		$scope.filter_data = $scope.vales.length
		$scope.total_vales = $scope.vales.length

	}, function errorCallback(response){


	})

	/* PAGINA DE VALES */

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

	$scope.registrarTalonario = function(){

    	$scope.talonario.INVENTARIOID = 0;

    	$http({

			method:'POST',
			url: 'routes/vales/registrar_talonario.php',
			data: $scope.talonario,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			if (response.data[0] == 1) {

				swal("Excelente!", "El talonario se ha registrado con éxito!", "success")
				.then((value) => {

					$('#talonarioModal').modal('hide')

				});

				//Actualizar cantidad de vales restantes
				$scope.vales_restantes = response.data[1]["COUNT(VALEID)"]

			}else{

				swal("Error!", "Datos del talonario ingresados incorrectamente", "error")

			}

		})
    }



}])