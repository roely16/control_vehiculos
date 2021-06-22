app.controller('ValesCtrl', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

	$scope.$root.URL_RETROCESO = "#/"

	$scope.$root.TITULO_IZQUIERDA = "Vales"

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	$scope.obtenerVales = function(){

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

	}

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

	$scope.mostrarEditarVale = function(id_vale){

    	/*
		Enviar peticion para traer los datos del vale y
		mostrarlos en modal de edición
    	*/

    	$http({

			method:'GET',
			url: 'routes/vales/detalle_vale.php',
			params: {id: id_vale}

		}).then(function successCallback(response){

			/*
			Si es estado 5, mostrar modal para
			agregar fecha de entrega y nombre de responsable
			*/

			if (response.data["ESTADO"] == 5) {

				//alert('mostrar modal entrega')

				$scope.entrega_vale = {}
				$scope.entrega_vale.RESPONSABLE = response.data["RESPONSABLE"]
				$scope.entrega_vale.ID_VALE = response.data["VALEID"]
				$scope.entrega_vale.INVENTARIO_ID = response.data["INVENTARIOID"];

				var dd = moment();

				$("#fecha_entrega_vale").datetimepicker({
					format: 'DD/MM/YYYY HH:mm',
			        defaultDate: dd,
				})

				//$('#fecha_entrega_vale').val(Date());
				$('#modalEntregaVale').modal('show')

			}else{

				//Asignar datos al scope del vale
				$scope.edit_vale = response.data

				$scope.estado_vale = response.data.ESTADO

				if ($scope.edit_vale.CONSUMO > 0) {

					/* El vale ya fue entregado como finalizado */

					$scope.edit_vale.ESTADO_ENTREGA = 1

				} else if($scope.edit_vale.CONSUMO == 0) {

					/* El vale ya fue entregado como anulado */

					$scope.edit_vale.ESTADO_ENTREGA = 2

				}else if($scope.edit_vale.CONSUMO == null) {

					/* El vale aun no ha sido entregado */

					$scope.edit_vale.ESTADO_ENTREGA = 0

				}

				//Mostrar modal
				$('#modalEditarVale').modal('show')

				// $('#modalEditarVale').on('show.bs.modal', function (e) {

				// 	console.log('Mostrar modal')

				// })

				$('#modalEditarVale').on('shown.bs.modal', function () {

					$(".fecha_despacho").datepicker()

				})

			}

		})
    }

	$scope.estadoSelected = function(){

    	$scope.edit_vale.ESTADO = $scope.edit_vale.ESTADO_

    	if ($scope.edit_vale.ESTADO == 6) {

    		$scope.edit_vale.CONSUMO = ''
    		$scope.edit_vale.KILOMETRAJE = ''

    	} else if($scope.edit_vale.ESTADO == 7) {

    		$scope.edit_vale.CONSUMO = 0
    		$scope.edit_vale.KILOMETRAJE = 0

    	}
	}
	
	$scope.editarVale = function(){

    	/*
		Se envia el formulario para actualizar el vale
		Se actualiza el consumo, estado y se puede subir
		un imagen del vale
    	*/

    	console.log($scope.edit_vale)

    	$http({

			method:'POST',
			url: 'routes/vales/editar_vale.php',
			data: $scope.edit_vale

		}).then(function successCallback(response){

			console.log(response.data)

			swal("Excelente!", "El vale se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarVale').modal('hide')

				});

			$scope.obtenerVales()

		})
    }


	$scope.registrarEntregaVale = function(){

		$scope.entrega_vale.FECHA = $('#fecha_entrega_vale').val()

		$http({

			method: 'POST',
			url: 'routes/vales/entrega_vale.php',
			data: $scope.entrega_vale

		}).then(function successCallback(response){

			swal("Excelente!", "El vale se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEntregaVale').modal('hide')

				});

			$scope.obtenerVales()

		})

	}

	$scope.obtenerValesDisponibles = function(){

		$http({

			method: 'GET',
			url: 'routes/vales/vales_disponibles.php',

		}).then(function successCallback(response){

			$scope.vales_disponibles = response.data

		})
		
	}

	$scope.cambiarEstadoVale = function(vale){

		$http({

			method: 'POST',
			url: 'routes/vales/cambiar_estado_vale.php',
			data: vale

		}).then(function successCallback(response){

			$scope.obtenerValesDisponibles()

		})		

	}

	$scope.modal_talonario = function(){

		$http({

			method: 'GET',
			url: 'routes/vales/tipos_talonarios.php',

		}).then(function successCallback(response){

			//$scope.obtenerValesDisponibles()
			$scope.tipos_talonarios = response.data

			console.log($scope.tipos_talonarios)
			$('#talonarioModal').modal('show')

		})	

	}

}])