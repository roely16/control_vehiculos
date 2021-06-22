app.controller('solicitudesValesController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {

	$scope.$root.URL_RETROCESO = '#/'

	$scope.$root.TITULO_IZQUIERDA = "Solicitudes de Vales"

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1
	$scope.id_talonario = null

	angular.element(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

	$http({

		method: 'GET',
		url: 'routes/solicitudes_pendientes/solicitudes_pendientes.php'

	}).then(function successCallback(response){

		console.log(response.data)

		$scope.solicitudes_pendientes = response.data[0]
		$scope.solicitudes_mantenimiento_pendientes = response.data[1]
		$scope.solicitudes_repuestos_pendientes = response.data[2]
        
		$scope.current_grid = 1
		$scope.data_limit = 5
		$scope.filter_data = $scope.solicitudes_pendientes.length

		$scope.current_grid_m = 1
		$scope.data_limit_m = 5
		$scope.filter_data_m = $scope.solicitudes_mantenimiento_pendientes.length
        
        $scope.current_grid_r = 1
		$scope.data_limit_r = 5
		$scope.filter_data_r = $scope.solicitudes_repuestos_pendientes.length

	})

	$scope.modalDetalleGestion = function(id){

		$http({

			method: 'GET',
			url: 'routes/solicitudes_pendientes/detalles_solicitud.php',
			params: {id: id}

		}).then(function successCallback(response){

			$('#modalDetalleGestion').modal('show')

			$scope.gestion = response.data

		})
	}
    
	$scope.modalDetalleGestionPC = function(id){

		$http({

			method: 'GET',
			url: 'routes/solicitudes_pendientes/detalles_solicitud_preventiva_correctiva.php',
			params: {id: id}

		}).then(function successCallback(response){

			$('#modalDetalleGestionPC').modal('show')

			$scope.gestion = response.data

		})
	} 

	$scope.cancelarGestion = function(id){

		swal({

			title: '¿Está seguro?',
			text: "Para rechazar la gestión, escriba RECHAZAR",
		  	input: 'text',
		  	inputPlaceholder: 'RECHAZAR',
		  	showCancelButton: true,
		  	inputValidator: (value) => {

		    	return !value && 'Es necesario ingresar RECHAZAR!'

		  	}

		})
		.then((result) => {

			if (result.value.toUpperCase() == "RECHAZAR") {

				$http({

					method: 'GET',
					url: 'routes/solicitudes_pendientes/cancelar_gestion.php',
					params: {id: id}

				}).then(function successCallback(response){

					console.log(response.data)

					$scope.solicitudes_pendientes = response.data[0]

					$scope.current_grid = 1
					$scope.data_limit = 5
					$scope.filter_data = $scope.solicitudes_pendientes.length

    				swal(
						'Excelente',
					  	'Las notificaciones han sido enviadas!',
					  	'success'
					)

				})

			} else {

				swal("Error!", "No se puede cancelar la gestión", "error");

			} 

		})
	}

	$scope.cancelarGestionMantenimiento = function(id){

		swal({

	  		title: '¿Está seguro?',
			text: "Para rechazar la gestión, escriba RECHAZAR",
		  	input: 'text',
		  	inputPlaceholder: 'RECHAZAR',
		  	showCancelButton: true,
		  	inputValidator: (value) => {

		    	return !value && 'Es necesario ingresar RECHAZAR!'

		  	}

		})
		.then((result) => {

			if (result.value.toUpperCase() == "RECHAZAR") {

				$http({

					method: 'GET',
					url: 'routes/solicitudes_pendientes/cancelar_gestion_m.php',
					params: {id: id}

				}).then(function successCallback(response){

					console.log(response.data)

					$scope.solicitudes_mantenimiento_pendientes = response.data

					$scope.current_grid_m = 1
					$scope.data_limit_m = 5
					$scope.filter_data_m = $scope.solicitudes_mantenimiento_pendientes.length

					swal(
						'Excelente',
					  	'La gestión se ha cancelado con éxito!',
					  	'success'
					)

				})

			} else {

				swal("Error!", "No se puede cancelar la gestión", "error");

			} 

		})
	}

    //Cancelar Gestion Mantenimiento correctivo/preventivo
    $scope.cancelarGestionMantenimientoPC = function(id){

		swal({

	  		title: '¿Está seguro?',
			text: "Para rechazar la gestión, escriba RECHAZAR",
		  	input: 'text',
		  	inputPlaceholder: 'RECHAZAR',
		  	showCancelButton: true,
		  	inputValidator: (value) => {

		    	return !value && 'Es necesario ingresar RECHAZAR!'

		  	}

		})
		.then((result) => {

			if (result.value.toUpperCase() == "RECHAZAR") {

				$http({

					method: 'GET',
					url: 'routes/solicitudes_pendientes/cancelar_gestion_m_p_c.php',
					params: {id: id}

				}).then(function successCallback(response){

					console.log(response.data)

					$scope.solicitudes_mantenimiento_pendientes = response.data

					$scope.current_grid_m = 1
					$scope.data_limit_m = 5
					$scope.filter_data_m = $scope.solicitudes_mantenimiento_pendientes.length

					swal(
						'Excelente',
					  	'La gestión se ha cancelado con éxito!',
					  	'success'
					)

				})

			} else {

				swal("Error!", "No se puede cancelar la gestión", "error");

			} 

		})
	}
    //Fin Cancelar Gestion Mantenimiento correctivo/preventivo
    
	$scope.modalUnirVale = function(id_gestion){

		$scope.unir_vale = {}
		$scope.unir_vale.GESTIONID = id_gestion

		$http({

			method: 'GET',
			url: 'routes/solicitudes_pendientes/obtener_vales.php',
			params: {id: id_gestion}

		}).then(function successCallback(response){

			$scope.vales = response.data

			$scope.modalMed_template_url = "views/modals/solicitudes_vales/unir_vale.html"

			$('#modalMed').modal('show')

			$('#modalMed').on('shown.bs.modal', function (e) {
	  		
	  			$('.selectpicker').selectpicker()

			})

		})
	}

	$scope.unirVale = function(){

		$http({

			method: 'POST',
			url: 'routes/solicitudes_pendientes/unir_vale_gestion.php',
			data: $scope.unir_vale,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

		})
	}

	$scope.asignar_vale = function(data){

		/* 

			Validación
			Determinar si el vale amerita que se seleccione el tipo de talonario

		*/

		$scope.solicitud_vale = data

		$http({

			method: 'POST',
			url: 'routes/solicitudes_pendientes/verificar_asignacion_vale.php',
			data: data

		}).then(function successCallback(response){

			$scope.modalMed_template_url = "views/modals/solicitudes_vales/asignar_vale.html"

			$scope.talonarios = response.data.talonarios
			$scope.vehiculo = response.data.vehiculo

			$('#modalMed').modal('show')

		})

	}

	$scope.obtener_vale = function(id_talonario){

		const data = {
			id_talonario: id_talonario
		}

		$http({

			method: 'POST',
			url: 'routes/solicitudes_pendientes/obtener_vale_asignado.php',
			data: data

		}).then(function successCallback(response){

			$scope.valeid = response.data.valeid
			$scope.no_vale = response.data.no_vale
			$scope.restantes = response.data.restantes

		})

	}

	$scope.emitir_vale = function(){

		
		$('#modalMed').on('hide.bs.modal', function () {
			
			$location.path( "/vehiculos/detalles/" + $scope.solicitud_vale.INVENTARIOID  + "/" + $scope.solicitud_vale.GESTIONID + "/" + $scope.valeid )

		})

	}

}]) 