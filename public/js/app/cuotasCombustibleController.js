app.controller('cuotasCombustibleController', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

	$scope.$root.URL_RETROCESO = "#/"

	$scope.$root.TITULO_IZQUIERDA = "Cuotas de Combustible"

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	$http({

		method: 'GET',
		url: 'routes/cuotas/obtener_cuotas.php'

	}).then(function successCallback(response){

		$scope.cuotas = response.data

		$scope.current_grid = 1
		$scope.data_limit = 10
		$scope.filter_data = $scope.cuotas.length
		$scope.total_cuotas = $scope.cuotas.length

	})

	/* PAGINA DE CUOTAS */

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

	$scope.cargarModalCuotas = function(){

		$http({

			method: 'GET',
			url: 'routes/vehiculos/obtener.php'

		}).then(function successCallback(response){

			$scope.vehiculos = response.data[0]

			$scope.cuota = [{ vehiculoid: '', cuota: '' }]

			for (var i = 0; i < 11; i++) {

				$scope.cuota.length+1;
				$scope.cuota.push({'vehiculoid': '', 'cuota': ''})

			}

			$(".datepicker").datepicker()

			$('#modalRegistrarCuotas').modal('show')

		})
	}

	$scope.registrarCuotas = function(){

		var cuotasVehiculos = new Array();
		var i = 1;

		cuotasVehiculos.push({fecha_inicio: $('#fecha_inicio').val()})
		cuotasVehiculos.push({fecha_fin: $('#fecha_fin').val()})

		$("input[name=cuota]").each(function() {

		   cuotasVehiculos.push({cuota : $(this).val(), inventario_id: $('input[name='+ i +']').val()});

		   i++

		});	


		$http({

			method: 'POST',
			url: 'routes/cuotas/registrar_cuotas.php',
			data: cuotasVehiculos,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			if (response.data[0] == 1) {

				console.log(response.data)

				swal("Error!", "La fecha de inicio no puede ser menor a la de la última cuota registrada", "error");

			}else if(response.data[0] == 2){

				console.log(response.data)

				swal("Error!", "La fecha de inicio debe ser menor a la fecha fin", "error");

			}else{

				console.log(response.data)

				$scope.cuotas = response.data[0]
				$scope.filter_data = $scope.cuotas.length

				swal("Excelente!", "Las cuotas se han registrado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalRegistrarCuotas').modal('hide')

					});

			}


		})
	}

	$scope.modalEditarCuota = function(id){

		//Obtener la informacion de la cuota
		$http({

			method:'GET',
			url: 'routes/cuotas/obtener_cuota.php',
			params: {id: id}

		}).then(function successCallback(response){

			$('#modalEditarCuota').modal('show')

			$scope.edit_cuota = response.data
	
		})
	}

	$scope.editarCuota = function(){

		$http({

			method:'POST',
			url: 'routes/cuotas/editar_cuota_modulo.php',
			data: $scope.edit_cuota,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			swal("Excelente!", "La cuota se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarCuota').modal('hide')

				});

			/* Se actualiza la tabla de Cuotas */	
			$scope.cuotas = response.data[0]

		})
	}

	$scope.eliminarCuota = function(id, inventario_id){

		swal({
		  	title: "¿Está seguro?",
		  	text: "Una vez eliminada la cuota no se podra recuperar!",
		  	icon: "warning",
		  	buttons: true,
		  	dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {

				/* Eliminar documento */

				$http({

					method: 'GET',
					url: 'routes/cuotas/eliminar_cuota_modulo.php',
					params: {id: id, inventario_id: inventario_id}

				}).then(function successCallback(response){

					console.log(response.data)

					/* Actualizar tabla de cuotas */

					$scope.cuotas = response.data[0]
					$scope.filter_data = $scope.cuotas.length				

					swal("La cuota ha sido eliminada éxito!", {
			      		icon: "success",
			    	});

				})

		  	} 
		});	
	}

}])