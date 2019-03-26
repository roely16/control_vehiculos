app.controller('configuracionCtrl', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

	$scope.$root.URL_RETROCESO = "#/"

	$scope.$root.TITULO_IZQUIERDA = "Módulo de Configuración"

	$(function () {
  		$('[data-toggle="tooltip"]').tooltip()
	})

	/* Cargar informacion */
	$http({

		method: 'GET',
		url: 'routes/configuracion/obtener_configuracion.php'

	}).then(function successCallback(response){

		$scope.administradores = response.data[0]

		$scope.roles = response.data[1]
		$scope.filter_data = $scope.roles.length
		$scope.current_grid = 1
		$scope.data_limit = 5
		$scope.maxSize = 5
		$scope.bigCurrentPage = 1

	})

	/* Roles */

	$scope.mostrar_editar_rol = function(id){

		$http({

			method: 'GET',
			url: 'routes/configuracion/obtener_roles_responsable.php',
			params: {id: id}

		}).then(function successCallback(response){

			$('#select_rol').val('')

			$scope.modalMed_template_url = "views/modals/configuracion/editar_rol.html"

			$('#modalMed').modal('show')

			$scope.roles_responsable = response.data[0]
			$scope.responsable_rol = response.data[1]

		})
	}

	$scope.editar_rol = function(){

		$http({

			method: 'POST',
			url: 'routes/configuracion/editar_roles.php',
			data: $scope.roles_responsable,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.roles = response.data[0]
			$scope.administradores = response.data[1]

			swal("Excelente!", "Los roles se han actualizado con éxito!", "success")
			.then((value) => {

				//Cerrar modal
				$('#modalMed').modal('hide')

			});

		})
	}

	$scope.eliminar_responsable = function(id){
	}

	$scope.agregar_rol = function(){

		var data = $('#select_rol').val()

		if (data == 'FIRMA_REGISTRADA') {

			$scope.roles_responsable.FIRMA_REGISTRADA = 1

		}else if(data == 'PILOTO'){

			$scope.roles_responsable.PILOTO = 1

		}else if(data == 'SOLICITAR_VALE'){

			$scope.roles_responsable.SOLICITAR_VALE = 1

		}else if(data == 'ADMINISTRADOR'){

			$scope.roles_responsable.ADMINISTRADOR = 1
			
		}
	}

	$scope.eliminar_rol_modal = function(rol){

		//delete $scope.roles_responsable[rol]

		if (rol == 'FIRMA_REGISTRADA') {

			$scope.roles_responsable.FIRMA_REGISTRADA = null

		}else if(rol == 'PILOTO'){

			$scope.roles_responsable.PILOTO = null

		}else if(rol == 'SOLICITAR_VALE'){

			$scope.roles_responsable.SOLICITAR_VALE = null

		}else if(rol == 'ADMINISTRADOR'){

			$scope.roles_responsable.ADMINISTRADOR = null
			
		}
	}

	$scope.modal_nuevo_rol = function(){

		$scope.modalMed_template_url = "views/modals/configuracion/nuevo_rol.html"

		$('#modalMed').modal('show')
	}

	$scope.buscar_responsable = function(){

		if ($scope.nombre_piloto != '') {

			$http({

				method: 'GET',
				url: 'routes/historial/buscar_piloto.php',
				params: { nombre_piloto: $scope.nombre_piloto }

			}).then(function successCallback(response){

				$scope.empleados = response.data

			})

		}else{

			$scope.empleados = ''
			$scope.piloto.NIT = null

		}
	}

	$scope.registrar_rol = function(){

		$scope.nuevo_rol = {}
		$scope.nuevo_rol.NIT = $('#piloto').val()

		var array_roles = []

		$('input:checked.rol').each(function () {

    		array_roles.push($(this).val())
		});

		$scope.nuevo_rol.ROLES = array_roles

		$http({

			method: 'POST',
			url: 'routes/configuracion/registrar_rol.php',
			data: $scope.nuevo_rol,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.roles = response.data[0]
			$scope.administradores = response.data[1]

			swal("Excelente!", "Se ha registrado un nuevo responsable con éxito!", "success")
			.then((value) => {

				//Cerrar modal
				$('#modalMed').modal('hide')

			});

		})
	}

	$scope.eliminar_rol = function(id){

		swal({
		  	title: "¿Está seguro?",
			text: "Una vez eliminado el registro no se podrá recuperar!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Eliminar',
			cancelButtonText: 'Cancelar'
		})
		.then((result) => {

			if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/configuracion/eliminar_rol.php',
					params: {id: id}

				}).then(function successCallback(response){

					swal("Excelente!", "Se ha eliminado el registro con éxito!", "success");

					$scope.roles = response.data[0]
					$scope.administradores = response.data[1]

				})
		  	} 

		});	
	}

	/* Administracion de Vehiculos */

	$scope.cargar_vehiculos_administrador = function(){

		$http({

			method: 'GET',
			url: 'routes/configuracion/obtener_vehiculos_administrador.php',
			params: {empleado_nit: $scope.responsable}

		}).then(function successCallback(response){

			$scope.vehiculos = response.data
			$scope.cantidad_vehiculos = $scope.vehiculos.length

		})
	}

	$scope.eliminar_vehiculo = function(id, nit){


		swal({
		  	title: "¿Está seguro?",
			text: "Una vez eliminado el registro no se podrá recuperar!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Eliminar',
			cancelButtonText: 'Cancelar'
		})
		.then((result) => {

			if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/configuracion/eliminar_vehiculo.php',
					params: {id: id, empleado_nit: $scope.responsable}

				}).then(function successCallback(response){

					console.log(response.data)

					$scope.vehiculos = response.data
					$scope.cantidad_vehiculos = $scope.vehiculos.length

					swal("Excelente!", "Se ha eliminado el vehículo con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalMed').modal('hide')

					});

					

				})

		  	} 

		});	
	}

	$scope.modal_agregar_vehiculo = function(){

		$scope.modalMed_template_url = "views/modals/configuracion/agregar_vehiculo.html"

		$http({

			method: 'GET',
			url: 'routes/configuracion/obtener_vehiculos.php',
			params: {empleado_nit: $scope.responsable}

		}).then(function successCallback(response){

			$scope.vehiculos_disponibles = response.data

			console.log(response.data)

			$('#modalMed').modal('show')

		})
	}

	$scope.registrar_vehiculos = function(){

		var array_vehiculos = []

		$('input:checked.vehiculo').each(function () {

    		array_vehiculos.push($(this).val())
		});


		if (array_vehiculos.length <= 0) {

			swal({
			  type: 'error',
			  title: 'Error',
			  text: 'Debe seleccionar al menos un vehículo!',
			})

		}else{

			$scope.registrar_vehiculo = {}
			$scope.registrar_vehiculo.RESPONSABLE = $scope.responsable
			$scope.registrar_vehiculo.VEHICULOS = array_vehiculos

			$http({

				method: 'POST',
				url: 'routes/configuracion/registrar_vehiculo.php',
				data: $scope.registrar_vehiculo,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				$scope.vehiculos = response.data
				$scope.cantidad_vehiculos = $scope.vehiculos.length

				swal("Excelente!", "Se ha registrado el vehículo con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalMed').modal('hide')

				});


			})

		}

	}

	/* Paginación Roles */

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