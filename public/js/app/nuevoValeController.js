app.controller('nuevoValeController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	
		/* Obtener pilotos */
		$http({

			method:'GET',
			url: 'routes/vehiculos/obtener_vehiculo.php',
			params: {id: $routeParams.id}

		}).then(function successCallback(response){

			//Pilotos
			$scope.pilotos = response.data[6]

			console.log($scope.pilotos)


		})


		/* Envio de petición */
    	$http({

			method:'GET',
			url: 'routes/vales/validar_existencia_vale.php',
			params: {id: $routeParams.id}
			
		}).then(function successCallback(response){
		
			if (response.data[0] == 0) {

				/* No existe cuota de combustible */
				swal("Error!", "Debe registrar una cuota de combustible", "error");

			} else {

				if (response.data[2] == 1) {

					swal({
						title: "Alerta",
					  	text: "Existen vales pendientes de entrega. ¿Seguro que desea generar un nuevo vale?",
					  	icon: "warning",
					  	buttons: true,
					  	dangerMode: true,
					})
					.then((willDelete) => {
						if (willDelete) {

					    	/*El usuario elige generar un nuevo vale*/
					    	if (response.data[1] == false) {

								//No existe un vale, mostrar alerta
								swal("Error!", "Debe registrar un  nuevo talonario de vales", "error");

							}else{

								/* Registrar excepcion en la bitacora */

								$http({

									method: 'GET',
									url: 'routes/vales/registro_excepcion_vale.php',
									params: {id: id}

								}).then(function successCallback(response){

									/*Actualizar la bitacora*/	
									$scope.b_eventos = response.data
									$scope.filter_data_b_eventos = $scope.b_eventos.length	

								})

								//Colocar datos en el modal
								$scope.vale = response.data[1]
								$scope.areas = response.data[3]
								$scope.vale.DIRECCION = "DCAI"
								$scope.vale.INVENTARIOID = $scope.vehiculo.INVENTARIOID
								
								//Existe un vale, mostrar modal para la creacion 
								$('#valeModal').modal('show')

							}

					  	} 
					});

				}else{

					if (response.data[1] == false) {

					//No existe un vale, mostrar alerta
					swal("Error!", "Debe registrar un  nuevo talonario de vales", "error");

					}else{

						//Colocar datos en el modal
						$scope.vale = response.data[1]
						$scope.vale.GASOLINERA = "Municipal"
						$scope.areas = response.data[3]
						$scope.vale.DIRECCION = "Catastro"
						$scope.vale.DEPARTAMENTO = "Catastro"
						$scope.vale.INVENTARIOID = $routeParams.id
						
						$('.selectpicker').selectpicker();
						

						//Existe un vale, mostrar modal para la creacion 
						$('#valeModal').modal('show')

					}

				}

			}
	
			
		})

}])