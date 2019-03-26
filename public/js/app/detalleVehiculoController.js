app.controller('detalleVehiculoController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', function($scope, $http, $routeParams, $timeout, $rootScope) {

	$scope.$root.URL_RETROCESO = '#/vehiculos'

	$scope.$root.TITULO_IZQUIERDA = "Detalles de vehículo"

	$('#pilotos').on('shown.bs.select', function (e) {

		$(this).selectpicker('refresh')

	})

	$(function() {
		$('.year-picker').datetimepicker({
	        viewMode: 'years',
	        format: 'YYYY'
	    })
    })

    $(function() {
	    $('.month-picker').datetimepicker({
            viewMode: 'years',
            format: 'YYYY-MM',
            locale: 'es'
        })
	})

	$(function() {
	    $('.calendar').datetimepicker({
	    	format: 'DD/MM/YYYY',
	    	locale: 'es'
	    });
	})

 	$http({

		method:'GET',
		url: 'routes/vehiculos/obtener_vehiculo.php',
		params: {id: $routeParams.id}

	}).then(function successCallback(response){

		//Informacion del vehiculo
		$scope.vehiculo = response.data[0]

		//Vales
		$scope.vales = response.data[1]

		$scope.current_grid_vales = 1
		$scope.data_limit_vales = 5
		$scope.max_size_vales = 5
		$scope.filter_data_vales = $scope.vales.length
		$scope.total_vales = $scope.vales.length

		$scope.vales_restantes = response.data[5]["COUNT(VALEID)"]

		//Bitacora
		$scope.b_eventos = response.data[2]

		$scope.current_grid_b_eventos = 1
		$scope.data_limit_b_eventos = 5
		$scope.max_size_b_eventos = 5
		$scope.filter_data_b_eventos = $scope.b_eventos.length
		$scope.total_b_eventos = $scope.b_eventos.length

		$scope.e_historial = response.data[3]

		for(i = 0; i < $scope.e_historial.length; i++){

			if (i == 0) {

				$scope.e_historial[i].ULTIMO = 1

			}else{

				$scope.e_historial[i].ULTIMO = 0

			}

		}

		$scope.current_grid_e_historial = 1
		$scope.data_limit_e_historial = 5
		$scope.max_size_e_historial = 5
		$scope.filter_data_e_historial = $scope.e_historial.length
		$scope.total_e_historial = $scope.e_historial.length

		//Cuota de combustible
		$scope.cuota = response.data[0]
		$scope.cuotas = response.data[4]

		$scope.current_grid_cuotas = 1
		$scope.data_limit_cuotas = 5
		$scope.max_size_cuotas = 5
		$scope.filter_data_cuotas = $scope.cuotas.length
		$scope.total_cuotas = $scope.cuotas.length

		//Pilotos
		$scope.pilotos = response.data[6]

		//Documentos
		$scope.documentos = response.data[7]

		$scope.current_grid_documentos = 1
		$scope.data_limit_documentos = 5
		$scope.max_size_documentos = 5
		$scope.filter_data_documentos = $scope.documentos.length
		$scope.total_documentos = $scope.documentos.length
		$scope.isImage = 0

		/* REPORTES */
		$scope.reporte_e_s = $scope.vehiculo
		$scope.reporte = $scope.vehiculo

		/* MANTENIMIENTOS */
		$scope.mantenimientos = response.data[8]
		$scope.current_grid_mantenimientos = 1
		$scope.data_limit_mantenimientos = 5
		$scope.max_size_mantenimientos = 5
		$scope.filter_data_mantenimientos = $scope.mantenimientos.length
		$scope.total_vales = $scope.mantenimientos.length


		/* Registrar mantenimiento desde gestiones pendientes */

		if ($routeParams.tipo == 2) {

			$http({

				method: 'GET',
				url: 'routes/mantenimientos/obtener_tipos.php'

			}).then(function successCallback(response){

				$http({

					method: 'GET',
					url: 'routes/solicitudes_pendientes/detalles_solicitud.php',
					params: {id: $routeParams.gestion}

				}).then(function successCallback(response){

					$scope.mantenimiento.TRABAJO_SOLICITADO = response.data["DETALLE"]

				})

				$scope.tipos_mantenimiento = response.data[0]
				$scope.proveedores = response.data[2]

				$scope.mantenimiento = {}
				$scope.mantenimiento.FECHA = moment().format('DD/MM/YYYY')
				$scope.mantenimiento.HORA = moment().format('LTS')
				$scope.mantenimiento.INVENTARIOID = $scope.vehiculo.INVENTARIOID
				$scope.mantenimiento.KILOMETRAJE_ACTUAL = $scope.vehiculo.KM_ACTUAL
				$scope.mantenimiento.KILOMETRAJE_MANTENIMIENTO = $scope.vehiculo.KM_SERVICIO
				$scope.mantenimiento.GESTIONID = $routeParams.gestion

				$('#myTabs a[data-target="#t1"]').tab('show')

				/* Se carga la plantilla del modal */
				$scope.modalBig_template_url = "views/modals/mantenimiento_vehiculos/registrar.html"
				$scope.$root.URL_RETROCESO = '#/solicitudes_vales'

				/* Mostrar modal */
				$('#modalBig').modal('show')

				$('#modalBig').on('shown.bs.modal', function (e) {

		  			$('.selectpicker').selectpicker()

		  			$('.calendar').datetimepicker({
				    	format: 'DD/MM/YYYY',
				    	locale: 'es'
	    			});

		    		$('.time').datetimepicker({
				    	format: 'HH:mm',
				    	locale: 'es'
		    		});

				})

			})


		}else{

			/* Generar vale desde gestiones pendientes */

			if ($routeParams.gestion) {

				$scope.$root.URL_RETROCESO = '#/solicitudes_vales'

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
								type: 'warning',
								showCancelButton: true,
							  	confirmButtonColor: '#3085d6',
							  	cancelButtonColor: '#d33',
							  	confirmButtonText: 'Generar Vale',
							  	cancelButtonText: 'Cancelar'
							})
							.then((result) => {

								if (result.value) {

								/*El usuario elige generar un nuevo vale*/
								   	if (response.data[1] == false) {

										//No existe un vale, mostrar alerta
										swal("Error!", "Debe registrar un  nuevo talonario de vales", "error");

									}else{

										/* Registrar excepcion en la bitacora */

										$http({

											method: 'GET',
											url: 'routes/vales/registro_excepcion_vale.php',
											params: {id: $routeParams.id}

										}).then(function successCallback(response){

											/*Actualizar la bitacora*/
											$scope.b_eventos = response.data
											$scope.filter_data_b_eventos = $scope.b_eventos.length

										})

										$http({

											method: 'GET',
											url: 'routes/solicitudes_pendientes/detalles_solicitud.php',
											params: {id: $routeParams.gestion}

										}).then(function successCallback(response){

											$scope.vale.COMISION = response.data["DETALLE"]

										})

										//Colocar datos en el modal
										$scope.vale = response.data[1]
										$scope.areas = response.data[3]
										$scope.vale.DIRECCION = "Catastro"
										$scope.vale.DEPARTAMENTO = "Catastro"
										$scope.vale.GASOLINERA = "Municipal"
										$scope.vale.INVENTARIOID = $routeParams.id
										$scope.vale.GESTION = $routeParams.gestion

										var avaibleDates = []

										$http({

											method: 'GET',
											url: 'routes/cuotas/obtener_fechas_cuotas.php',
											params: { id: $routeParams.id }

										}).then(function successCallback(response){

											availableDates = response.data

										})

										function available(date) {

											dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();

										  	if ($.inArray(dmy, availableDates) !== -1) {

										    	return [true, "","Available"];

										  	} else {

										    	return [false,"","unAvailable"];

										  	}

										}

										$('.selectpicker').selectpicker();

										$(".datepicker").datepicker({ beforeShowDay: available })
										$scope.vale.FECHA = moment().format('DD/MM/YYYY')

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

								/* Obtener detalles de la gestion */

								$http({

									method: 'GET',
									url: 'routes/solicitudes_pendientes/detalles_solicitud.php',
									params: {id: $routeParams.gestion}

								}).then(function successCallback(response){

									$scope.vale.COMISION = response.data["DETALLE"]

								})

								//Colocar datos en el modal
								$scope.vale = response.data[1]
								$scope.vale.GASOLINERA = "Municipal"
								$scope.areas = response.data[3]
								$scope.vale.DIRECCION = "Catastro"
								$scope.vale.DEPARTAMENTO = "Catastro"
								$scope.vale.INVENTARIOID = $routeParams.id
								$scope.vale.GESTION = $routeParams.gestion

								var avaibleDates = []

								$http({

									method: 'GET',
									url: 'routes/cuotas/obtener_fechas_cuotas.php',
									params: { id: $routeParams.id }

								}).then(function successCallback(response){

									availableDates = response.data

								})

								function available(date) {

									dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();

								  	if ($.inArray(dmy, availableDates) !== -1) {

								    	return [true, "","Available"];

								  	} else {

								    	return [false,"","unAvailable"];

								  	}

								}

								$('.selectpicker').selectpicker();

								$(".datepicker").datepicker({ beforeShowDay: available })
								$(".fecha_despacho").datepicker()
								$scope.vale.FECHA = moment().format('DD/MM/YYYY')

								//Existe un vale, mostrar modal para la creacion
								$('#valeModal').modal('show')

							}

						}

					}

				})
			}

		}

	})

	/* VEHICULOS */

	/*
	Metodos para paginacion y busqueda de vehiculos
	*/
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

	$scope.editar_kilometraje = function(){

		swal({
			title: 'Actualización de kilometraje',
		  	input: 'text',
		  	inputPlaceholder: 'Ingrese el nuevo kilometraje',
		  	showCancelButton: true,
		  	inputValidator: (value) => {

		    	return !value && 'Es necesario ingresar el kilometraje!'

		  	}

		}).then((result) => {

			if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/vehiculos/editar_kilometraje.php',
					params: {id: $scope.vehiculo.INVENTARIOID, km: result.value}

				}).then(function successCallback(response){

					$scope.vehiculo.KM_ACTUAL = result.value

					//Actualizar la bitacora
					$scope.b_eventos = response.data[2]
					$scope.filter_data_b_eventos = $scope.b_eventos.length

					swal(
				    	'Excelente!',
				      	'El kilometraje se ha editado con éxito.',
				      	'success'
			    	)

				})

		  	}

		})
	}

	$scope.agregar_piloto = function(){

		$scope.modalMed_template_url = "views/modals/historial_vehiculos/agregar_piloto.html"

		$('#nombre_piloto').val('')
		$('#piloto').find('option').remove().end()

		$('#modalMed').modal('show')
	}

	$scope.buscar_piloto = function(){

		$scope.nombre_piloto = $('#nombre_piloto').val()

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

		}
	}

	$scope.registrar_nuevo_piloto = function(){

		$scope.piloto = $('#piloto').val()
		$scope.piloto_txt = $('#piloto').text()

		$http({

			method: 'GET',
			url: 'routes/historial/registrar_piloto.php',
			params: {nit_piloto: $scope.piloto}

		}).then(function successCallback(response){

			$scope.pilotos = response.data[0]

			$('#modalMed').modal('hide')

			$scope.piloto = ''
			$scope.nombre_piloto = ''


		})

	}

	/* VALES DE COMBUSTIBLE */

	/*Metodos para paginacion y busqueda de vales*/

	$scope.page_position_vales = function(page_number){

		$scope.current_grid_vales = page_number
	}

	$scope.filter_vales = function(){

		$timeout(function(){
			$scope.filter_data_vales = $scope.searched_vales.length

		}, 20)
	}

	$scope.sort_with_vales = function(base_vales){

		$scope.base_vales = base_vales
		$scope.reverse_vales = !$scope.reverse_vales
	}

	$scope.registrarVale = function(){

    	$http({

			method:'POST',
			url: 'routes/vales/registrar_vale.php',
			data: $scope.vale,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			if (response.data[0] == 1) {

				swal("Excelente!", "El vale se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#valeModal').modal('hide')

				});

				//Actualizar la tabla de los vales
				$scope.vales = response.data[1]
				$scope.filter_data_vales = $scope.vales.length

				//Actualizar vales restantes
				$scope.vales_restantes = response.data[2]["COUNT(VALEID)"]

				//Actualizar la bitacora
				$scope.b_eventos = response.data[3]
				$scope.filter_data_b_eventos = $scope.b_eventos.length

			} else {

				/* No existe cuota de combustible */
				swal("Error!", "La fecha del vale debe estar en el rango de la cuota de combustible activa", "error");
			}




		})
    }

    $scope.validarVale = function(id){

 		/* Envio de petición */
    	$http({

			method:'GET',
			url: 'routes/vales/validar_existencia_vale.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			if (response.data[0] == 0) {

				/* No existe cuota de combustible */
				swal("Error!", "Debe registrar una cuota de combustible", "error");

			} else {

				if (response.data[2] == 1) {

					swal({
						title: "Alerta",
						text: "Existen vales pendientes de entrega. ¿Seguro que desea generar un nuevo vale?",
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Generar Vale',
						cancelButtonText: 'Cancelar'
					})
					.then((result) => {
						if (result.value) {

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
								$scope.vale.DIRECCION = "Catastro"
								$scope.vale.DEPARTAMENTO = "Catastro"
								$scope.vale.GASOLINERA = "Municipal"
								$scope.vale.INVENTARIOID = $scope.vehiculo.INVENTARIOID
								$scope.vale.GESTION = 0

								var avaibleDates = []

								$http({

									method: 'GET',
									url: 'routes/cuotas/obtener_fechas_cuotas.php',
									params: { id: id }

								}).then(function successCallback(response){

									availableDates = response.data

								})

								function available(date) {

									dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();

								  	if ($.inArray(dmy, availableDates) !== -1) {

								    	return [true, "","Available"];

								  	} else {

								    	return [false,"","unAvailable"];

								  	}

								}

								//Existe un vale, mostrar modal para la creacion
								$('.selectpicker').selectpicker()

								$(".datepicker").datepicker({ beforeShowDay: available })
								$scope.vale.FECHA = moment().format('DD/MM/YYYY')

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
						$scope.vale.INVENTARIOID = $scope.vehiculo.INVENTARIOID
						$scope.vale.GESTION = 0

						var avaibleDates = []

						$http({

							method: 'GET',
							url: 'routes/cuotas/obtener_fechas_cuotas.php',
							params: { id: id }

						}).then(function successCallback(response){

							availableDates = response.data

						})

						function available(date) {

							dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();

						  	if ($.inArray(dmy, availableDates) !== -1) {

						    	return [true, "","Available"];

						  	} else {

						    	return [false,"","unAvailable"];

						  	}

						}

						$('.selectpicker').selectpicker()

						/* Calendario para fecha */
						$(".datepicker").datepicker({ beforeShowDay: available })

						$scope.vale.FECHA = moment().format('DD/MM/YYYY')

						$('#valeModal').modal('show')

					}

				}

			}


		})
    }

    $scope.registrarTalonario = function(){

    	$scope.talonario.INVENTARIOID = $scope.vehiculo.INVENTARIOID;

    	$http({

			method:'POST',
			url: 'routes/vales/registrar_talonario.php',
			data: $scope.talonario,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			if (response.data[0] == 1) {

				swal("Excelente!", "El talonario se ha registrado con éxito!", "success")
				.then((value) => {

					$('#talonarioModal').modal('hide')

				});

				//Actualizar cantidad de vales restantes
				$scope.vales_restantes = response.data[1]["COUNT(VALEID)"]

				//Actualizar la bitacora
				$scope.b_eventos = response.data[2];
				$scope.filter_data_b_eventos = $scope.b_eventos.length;

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

			/* Actualizar tabla de Vales */
			$scope.vales = response.data[0]

			/* Actualizar la tabla de cuotas */
			//$scope.cuotas = response.data[2]

			/* Actualizar Bitacora */
			$scope.b_eventos = response.data[1]
			$scope.filter_data_b_eventos = $scope.b_eventos.length

		})
    }

    $scope.mostrarDetalleVale = function(id_vale){

    	/*
		Enviar peticion para traer los datos del vale y
		mostrarlos en modal de detalles
    	*/
    	$http({

			method:'GET',
			url: 'routes/vales/detalle_vale.php',
			params: {id: id_vale}

		}).then(function successCallback(response){

			//Asignar datos al scope del vale
			$scope.vale = response.data

			//Mostrar modal
			$('#modalDetalleVale').modal('show')

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

    $scope.modalArchivoVale = function(id){

    	$scope.documento_vale = id
    	$('#modalArchivoVale').modal('show')
    }

 	$scope.subirArchivoVale = function(){

 		console.log($scope.documento_vale)
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

			//console.log(response.data);
			$scope.vales = response.data

		})

	}

	$scope.modalDetallesVale = function(id){

		$http({
			method: 'GET',
			url: 'routes/vales/obtener_vale.php',
			params: {id: id}
		}).then(function successCallback(response){

			console.log(response.data);

			$scope.detalle_vale = response.data[0]

			$('#modalDetallesVale').modal('show')

		})


	}

	/* CUOTAS DE COMBUSTIBLE */

	/*Metodos para paginacion y busqueda de cuotas de combustible*/

	$scope.page_position_cuotas = function(page_number){

		$scope.current_grid_cuotas = page_number
	}

	$scope.filter_cuotas = function(){

		$timeout(function(){
			$scope.filter_data_cuotas = $scope.searched_cuotas.length

		}, 20)
	}

	$scope.sort_with_cuotas = function(base_cuotas){

		$scope.base_cuotas = base_cuotas
		$scope.reverse_cuotas = !$scope.reverse_cuotas
	}

	$scope.establecerCuota = function(){

		//Enviar peticion
		$http({
			method:'POST',
			url: 'routes/cuotas/establecer_cuota.php',
			data: $scope.cuota,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).then(function successCallback(response){

			console.log(response.data)

			if (response.data[0] == 1) {

				swal("Excelente!", "La cuota se ha registrado con éxito!", "success")
				.then((value) => {

					$('#cuotaCombustibleModal').modal('hide')

				});

				//Actuaiizar tabla de cuotas
				$scope.cuotas = response.data[1]

				//Actualizar paginacion
				$scope.filter_data_cuotas = response.data[1].length

				//Actualizar bitacora
				$scope.b_eventos = response.data[2]
				$scope.filter_data_b_eventos = $scope.b_eventos.length

			}else if(response.data[0] == 'rango_invalido'){

				swal("Error!", "La fecha de inicio no puede ser mayor a la fecha de finalización", "error");

			}else if(response.data[0] == 'cuota_existente'){

				swal("Error!", "El rango de fechas entra en conflicto con cuotas ya existentes", "error");

			}

		})
	}

	$scope.mostrarEditarCuota = function(id){

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
			url: 'routes/cuotas/editar_cuota.php',
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

			/* Se actualiza la bitacora */
			$scope.b_eventos = response.data[1]
			$scope.filter_data_b_eventos = $scope.b_eventos.length

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
					url: 'routes/cuotas/eliminar_cuota.php',
					params: {id: id, inventario_id: inventario_id}

				}).then(function successCallback(response){

					console.log(response.data)

					/* Actualizar tabla de cuotas */

					$scope.cuotas = response.data[0]
					$scope.filter_data_cuotas = $scope.cuotas.length

					/* Actualizar la bitacora */

					$scope.b_eventos = response.data[1]
					$scope.filter_data_b_eventos = $scope.b_eventos.length

					swal("La cuota ha sido eliminada éxito!", {
			      		icon: "success",
			    	});

				})

		  	}
		});
	}

	/* HISTORIAL DE ENTRADAS Y SALIDAS */

	$scope.page_position_e_historial = function(page_number){

		$scope.current_grid_e_historial = page_number
	}

	$scope.filter_e_historial = function(){

		$timeout(function(){
			$scope.filter_data_e_historial = $scope.searched_e_historial.length

		}, 20)
	}

	$scope.sort_with_e_historial = function(base_e_historial){

		$scope.base_e_historial = base_e_historial
		$scope.reverse_e_historial = !$scope.reverse_e_historial
	}

	$scope.registroHistorialVehiculo = function(){


		$scope.historial.HORA_SALIDA = $('#hora_salida').val()
		$scope.historial.HORA_ENTRADA = $('#hora_entrada').val()


		$http({

			method:'POST',
			url: 'routes/historial/registrar_historial.php',
			data: $scope.historial,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			if (response.data[0] == 1) {

				swal("Excelente!", "Se ha creado el registro en el historial con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalBitacoraVehiculo').modal('hide')

				});

				//Se actualiza la tabla del historial
				$scope.e_historial = response.data[1]

				for(i = 0; i < $scope.e_historial.length; i++){

					if (i == 0) {

						$scope.e_historial[i].ULTIMO = 1

					}else{

						$scope.e_historial[i].ULTIMO = 0

					}

				}

				//Actualizar paginacion
				$scope.filter_data_e_historial = $scope.e_historial.length

				//Se actualiza el Km actual de vehiculo
				$scope.vehiculo.KM_ACTUAL = response.data[2]

				$scope.b_eventos = response.data[3]
				$scope.filter_data_b_eventos = $scope.b_eventos.length


			}else if(response.data[0] == 2) {

				swal("Error!", "La hora de entrada no puede ser menor a la de salida", "error");

			}else if(response.data[0] == 0) {

				swal("Error!", "El kilometraje de entrada no puede ser menor al de salida", "error");

			}else if(response.data[0] == 3){

				swal("Error!", "El kilometraje de entrada no puede ser menor al kilometraje actual del vehículo", "error");

			}else if(response.data[0] == 4){

				swal("Error!", "El kilometraje de salida no puede ser menor al kilometraje actual del vehículo", "error");

			}



		})
	}

	$scope.modalRegistro = function(){

		/*
		$scope.modalBig_template_url = "views/modals/historial_vehiculos/registrar.html"

		$('#modalBig').modal('show')

		$('#modalBig').on('shown.bs.modal', function (e) {

  			$('.selectpicker').selectpicker()

  			$(".timepicker").datetimepicker({
				format: 'HH:mm'
			})

			$(".datepicker").datepicker()

		})
		*/

		$('#modalBitacoraVehiculo').modal('show')


		$('.selectpicker').selectpicker()

  			$(".timepicker").datetimepicker({
				format: 'HH:mm'
			})

			$(".datepicker").datepicker()
		/*

		*/

		$scope.historial = {}

		$scope.historial.FECHA_SALIDA = moment().format('DD/MM/YYYY')
		$scope.historial.FECHA_ENTRADA = moment().format('DD/MM/YYYY')

		$scope.historial.OBSERVACION = ""
		$scope.historial.NO_VALE = ""
		$scope.historial.GALONES = ""
		$scope.historial.NO_VIAJES = ""
		$scope.historial.PERSONAS = ""
		$scope.historial.VISITAS_CAMPO = ""
		$scope.historial.JURIDICO = ""
		$scope.historial.TECNICO = ""
		$scope.historial.SIMA = ""
		$scope.historial.IUSI = ""
		$scope.historial.AVISOS_NOT = ""
		$scope.historial.EXPEDIENTES = ""
		$scope.historial.CARTAS = ""
		$scope.historial.UDI = ""
		$scope.historial.ADMINISTRACION = ""
		$scope.historial.REGENCIA = ""
		$scope.historial.OTROS = ""

		$scope.historial.KM_SALIDA = $scope.vehiculo.KM_ACTUAL
		$scope.historial.KM_ACTUAL = $scope.vehiculo.KM_ACTUAL
		$scope.historial.INVENTARIOID = $scope.vehiculo.INVENTARIOID
		$scope.historial.KM_SERVICIO = $scope.vehiculo.KM_SERVICIO
	}

	$scope.modalDetalle = function(id){

		$http({

			method: 'GET',
			url: 'routes/historial/detalle_historial.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.registro_historial = response.data

			$('#modalDetalleBitacoraVehiculo').modal('show')

		})
	}

	$scope.modalEditar = function(id){

		$http({

			method: 'GET',
			url: 'routes/historial/detalle_historial.php',
			params: {id: id}

		}).then(function successCallback(response){

			$scope.registro_historial = response.data

			$('#modalEditaBitacoraVehiculo').modal('show')

		})
	}

	$scope.editarHistorial = function(){

		$http({

			method: 'POST',
			url: 'routes/historial/editar_historial.php',
			data: $scope.registro_historial,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			/* Se actualiza la bitacora */
			$scope.b_eventos = response.data[1]
			$scope.filter_data_b_eventos = $scope.b_eventos.length

			$scope.e_historial = response.data[2]

			for(i = 0; i < $scope.e_historial.length; i++){

				if (i == 0) {

					$scope.e_historial[i].ULTIMO = 1

				}else{

					$scope.e_historial[i].ULTIMO = 0

				}

			}

			swal("Excelente!", "Se ha editado el registro del historial con éxito!", "success")
				.then((value) => {

				//Cerrar modal
				$('#modalEditaBitacoraVehiculo').modal('hide')

			});


		})
	}

	$scope.eliminarHistorial = function(id, inventario_id){

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
					url: 'routes/historial/eliminar_historial.php',
					params: {id: id, inventario_id: inventario_id}

				}).then(function successCallback(response){

					console.log(response.data)

					//Se actualiza la tabla del historial
					$scope.e_historial = response.data[0]

					for(i = 0; i < $scope.e_historial.length; i++){

						if (i == 0) {

							$scope.e_historial[i].ULTIMO = 1

						}else{

							$scope.e_historial[i].ULTIMO = 0

						}

					}

					//Actualizar paginacion
					$scope.filter_data_e_historial = $scope.e_historial.length

					/* Actualizar Bitácora */
					$scope.b_eventos = response.data[1]
					$scope.filter_data_b_eventos = $scope.b_eventos.length

					/* Actualizar kilometraje actual */
					$scope.vehiculo.KM_ACTUAL = response.data[2]

					swal("Excelente!", "Se ha eliminado el registro del historial con éxito!", "success")

				})

		  	}
		});
	}

	/* BITACORA DE EVENTOS */

	$scope.page_position_b_eventos = function(page_number){

		$scope.current_grid_b_eventos = page_number
	}

	$scope.filter_b_eventos = function(){

		$timeout(function(){
			$scope.filter_data_b_eventos = $scope.searched_b_eventos.length

		}, 20)
	}

	$scope.sort_with_b_eventos = function(base_b_eventos){

		$scope.base_b_eventos = base_b_eventos
		$scope.reverse_b_eventos = !$scope.reverse_b_eventos
	}

	/* MANTENIMIENTOS DE VEHICULOS */

	$scope.page_position_mantenimientos = function(page_number){

		$scope.current_grid_mantenimientos = page_number
	}

	$scope.filter_mantenimientos = function(){

		$timeout(function(){
			$scope.filter_data_mantenimientos = $scope.searched_mantenimientos.length

		}, 20)
	}

	$scope.sort_with_mantenimientos = function(base_mantenimientos){

		$scope.base_mantenimientos = base_mantenimientos
		$scope.reverse_mantenimientos = !$scope.reverse_mantenimientos
	}

	$scope.nuevoMantenimiento = function(){

		$http({

			method: 'GET',
			url: 'routes/mantenimientos/obtener_tipos.php'

		}).then(function successCallback(response){

			$scope.tipos_mantenimiento = response.data[0]
			$scope.proveedores = response.data[2]

			$scope.mantenimiento = {}
			$scope.mantenimiento.FECHA = moment().format('DD/MM/YYYY')
			$scope.mantenimiento.HORA = moment().format('LTS')
			$scope.mantenimiento.INVENTARIOID = $scope.vehiculo.INVENTARIOID
			$scope.mantenimiento.KILOMETRAJE_ACTUAL = $scope.vehiculo.KM_ACTUAL
			$scope.mantenimiento.KILOMETRAJE_MANTENIMIENTO = $scope.vehiculo.KM_SERVICIO
			$scope.mantenimiento.GESTIONID = ""

			console.log(response.data)

			/* Se carga la plantilla del modal */
			$scope.modalBig_template_url = "views/modals/mantenimiento_vehiculos/registrar.html"

			/* Mostrar modal */
			$('#modalBig').modal('show')

			$('#modalBig').on('shown.bs.modal', function (e) {

  				$('.selectpicker').selectpicker()

  				$('.calendar').datetimepicker({
			    	format: 'DD/MM/YYYY',
			    	locale: 'es'
	    		});

	    		$('.time').datetimepicker({
			    	format: 'HH:mm',
			    	locale: 'es'
	    		});

			})

		})
	}

	$scope.registrarMantenimiento = function(){

		/* Revisiones predeterminadas */

		var array_revisiones = []

		$('input:checked.revision').each(function () {

    		array_revisiones.push($(this).val())
		});

		$scope.mantenimiento.REVISIONES = array_revisiones

		/* Otras revisiones */

		var array_otras_revisiones = []

		$('input:checked.otra_revision').each(function () {

    		array_otras_revisiones.push($(this).val())

		});

		$scope.mantenimiento.OTROS_TRABAJOS = array_otras_revisiones
		$scope.mantenimiento.FECHA = $('#fecha').val()
		$scope.mantenimiento.HORA = $('#hora').val()

		if (array_revisiones.length == 0 && array_otras_revisiones.length == 0) {

			console.log('debe seleccionar al menos una')

			swal({
			  type: 'error',
			  title: 'Error',
			  text: 'Debe seleccionar al menos una opción!',
			})

		}else{

			$http({

				method: 'POST',
				url: 'routes/mantenimientos/registrar.php',
				data: $scope.mantenimiento,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				console.log(response.data)

				swal("Excelente!", "El mantenimiento se ha registrado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalBig').modal('hide')

					});

				$scope.mantenimientos = response.data
				$scope.filter_data_mantenimientos = $scope.mantenimientos.length
			})

		}
	}

	$scope.detalleMantenimiento = function(id){

		$http({

			method: 'GET',
			url: 'routes/mantenimientos/obtener_detalles.php',
			params: { id: id }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.detalle_mantenimiento = response.data[0]
			$scope.detalle_mantenimiento.RESPONSABLE_1 = response.data[3]
			$scope.detalle_mantenimiento.RESPONSABLE_2 = response.data[4]
			$scope.detalle_mantenimiento.REVISIONES = response.data[1]
			$scope.detalle_mantenimiento.NO_REVISIONES = $scope.detalle_mantenimiento.REVISIONES.length
			$scope.detalle_mantenimiento.OTRAS_REVISIONES = response.data[2]
			$scope.detalle_mantenimiento.NO_REVISIONES_EXTRAS = $scope.detalle_mantenimiento.OTRAS_REVISIONES.length
			$scope.detalle_mantenimiento.EVALUACION = response.data[5]

			/* Se carga la plantilla del modal */
			$scope.modalBig_template_url = "views/modals/mantenimiento_vehiculos/detalles.html"

			/* Mostrar modal */
			$('#modalBig').modal('show')

		})
	}

	$scope.mostrarEditarMantenimiento = function(id){

		$http({

			method: 'GET',
			url: 'routes/mantenimientos/obtener_tipos.php'

		}).then(function successCallback(response){

			$scope.tipos_mantenimiento = response.data[0]

		})

		$http({

			method: 'GET',
			url: 'routes/mantenimientos/obtener_detalles.php',
			params: {id: id}

		}).then(function successCallback(response){

			$scope.edit_mantenimiento = response.data[0]
			$scope.edit_mantenimiento.RESPONSABLE_1 = response.data[3]
			$scope.edit_mantenimiento.RESPONSABLE_2 = response.data[4]
			$scope.edit_mantenimiento.REVISIONES = response.data[1]

			$scope.edit_mantenimiento.OTRAS_REVISIONES = response.data[2]

			console.log($scope.edit_mantenimiento )

			/* Se carga la plantilla del modal */
			$scope.modalBig_template_url = "views/modals/mantenimiento_vehiculos/editar.html"

			/* Mostrar modal */
			$('#modalBig').modal('show')

			$('#modalBig').on('shown.bs.modal', function (e) {

  				$('.selectpicker').selectpicker()

  				$('.calendar').datetimepicker({
			    	format: 'DD/MM/YYYY',
			    	locale: 'es'
	    		});

			})

		})
	}

	/* Editar - Registro de factura */
	$scope.registrarFactura = function(){

		if ($scope.edit_mantenimiento.TIPO_MANTENIMIENTO_ID < 4) {

			if ($scope.edit_mantenimiento.KILOMETRAJE_PROXIMO > $scope.vehiculo.KM_SERVICIO) {

				$http({

				method: 'POST',
				url: 'routes/mantenimientos/registrar_factura.php',
				data: $scope.edit_mantenimiento,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

				}).then(function successCallback(response){

					console.log(response.data)

					$scope.mantenimientos = response.data[0]
					$scope.filter_data_mantenimientos = $scope.mantenimientos.length
					$scope.vehiculo.KM_SERVICIO = response.data[1]

					swal("Excelente!", "El mantenimiento se ha editado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalBig').modal('hide')

					});

				})

			}else{

				swal("Error!", "El kilometraje del próximo servicio debe ser mayor al actual", "error");

			}

		}else{

			$http({

				method: 'POST',
				url: 'routes/mantenimientos/registrar_factura.php',
				data: $scope.edit_mantenimiento,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

				}).then(function successCallback(response){

					console.log(response.data)

					$scope.mantenimientos = response.data[0]
					$scope.filter_data_mantenimientos = $scope.mantenimientos.length

					swal("Excelente!", "El mantenimiento se ha editado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalBig').modal('hide')

					});

				})

		}

	}

	/* Editar - Vehiculo Regresa de Talle */

	$scope.editarMantenimiento = function(){

		var array_revisiones_realizadas = []

		$('input:checked.realizado').each(function () {

    		array_revisiones_realizadas.push($(this).val())
		});

		var array_otras_revisiones_realizadas = []

		$('input:checked.otra_realizado').each(function () {

    		array_otras_revisiones_realizadas.push($(this).val())
		});

		$scope.edit_mantenimiento.REVISIONES_REALIZADAS = array_revisiones_realizadas
		$scope.edit_mantenimiento.OTRAS_REVISIONES_REALIZADAS = array_otras_revisiones_realizadas
		$scope.edit_mantenimiento.FECHA_ENTREGA = $('#fecha_entrega').val();

		console.log($scope.edit_mantenimiento)

		if (array_revisiones_realizadas.length == 0 && array_otras_revisiones_realizadas == 0) {

			swal({
			  type: 'error',
			  title: 'Error',
			  text: 'Debe seleccionar al menos una opción!',
			})

		}else{

			$http({

			method: 'POST',
			url: 'routes/mantenimientos/editar.php',
			data: $scope.edit_mantenimiento,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.mantenimientos = response.data[0]
				$scope.filter_data_mantenimientos = $scope.mantenimientos.length
				//$scope.vehiculo.KM_SERVICIO = response.data[1]

				swal("Excelente!", "El mantenimiento se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalBig').modal('hide')

				});

			})

		}
	}

	/* Evaluacion de Proveedor */
	$scope.evaluacionProveedor = function(id){

		$http({

			method: 'GET',
			url: 'routes/mantenimientos/obtener_detalles.php',
			params: { id: id }

		}).then(function successCallback(response){

			$scope.detalle_mantenimiento = response.data[0]
			$scope.detalle_mantenimiento.RESPONSABLE_1 = response.data[3]
			$scope.detalle_mantenimiento.RESPONSABLE_2 = response.data[4]
			$scope.detalle_mantenimiento.REVISIONES = response.data[1]
			$scope.detalle_mantenimiento.NO_REVISIONES = $scope.detalle_mantenimiento.REVISIONES.length
			$scope.detalle_mantenimiento.OTRAS_REVISIONES = response.data[2]
			$scope.detalle_mantenimiento.NO_REVISIONES_EXTRAS = $scope.detalle_mantenimiento.OTRAS_REVISIONES.length

			console.log($scope.detalle_mantenimiento)

			/* Se carga la plantilla del modal */
			$scope.modalBig_template_url = "views/modals/mantenimiento_vehiculos/evaluacion_proveedor.html"

			/* Mostrar modal */
			$('#modalBig').modal('show')

		})

		$http({

			method: 'GET',
			url: 'routes/mantenimientos/criterios_evaluacion.php'

		}).then(function successCallback(response){

			$scope.criterios_evaluacion = response.data

		})
	}

	$scope.registrarEvaluacionProveedor = function(id){

		//$scope.criterios_evaluacion.MANTENIMIENTOID = $scope.detalle_mantenimiento.MANTENIMIENTOID

		$http({

			method: 'POST',
			url: 'routes/mantenimientos/registrar_evaluacion.php',
			data: [$scope.criterios_evaluacion, $scope.detalle_mantenimiento],
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.mantenimientos = response.data[0]

			swal("Excelente!", "La evaluación del mantenimiento se ha registrado con éxito!", "success")
			.then((value) => {

				//Cerrar modal
				$('#modalBig').modal('hide')

			});

		})
	}

	$scope.reporteEvaluacion = function(id){

		var doc = new jsPDF('p', 'pt');

		var encabezado = 'data:image/jpeg;base64,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E+sjw94X1TWCgkNnbPMqE4DMBwM9snArifhF4UjttBj8Wapi78QayPtMt3J8zKjcqq8fLkYJx646AUAUT8Yde+05/wCFY+IvsH/Pfy5N2Mf3fLx14+9/hXV+DfiRoHjZpYLCSW31CEEy2N0myVADjPcEZ9CcZGcZrrq4fxL8PxqvjLRPFOlXMen6lYzZuJPLz9oixgqffGVz6MfQUAdwSAMngV5vrPxj0q21GbTPD+l6h4jv4Qd6afEWjVvQsAe/cAipPjDrF9ZeGbLR9MlMN5rl7Hp6zA4Mat94/jwv0Y11nhnwxpfhPRotM0q2SGJQC7hfmlbGCzHuT/8AWoA4C2+NbWZRvFXg3W9Bhd9ouJIXeMDsSSinr2ANenWGoWeq2MN9YXMVzazLujlibcrD61JdWtve2strdQRz28qlJIpFDK6nqCD1FeVeCIpfBHxX1fwVHIW0e9t/7S0+Nnz5JzhlAx0+8Pog7k0AetUVzd7e+K08eadaWmmWknhd7cteXrMPNjlxJhVG8HGRH/CfvHn06SgAooooAKKKKACiiigAooooAK5/w9/yHPFn/YVj/wDSK1roK5/w9/yHPFn/AGFY/wD0itaACz/5KHrP/YKsP/Rt3XQVz9n/AMlD1n/sFWH/AKNu66CgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuf8AGX/IDtv+wrpv/pbDXQVz/jL/AJAdt/2FdN/9LYaAOgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA5/wAG/wDIDuf+wrqX/pbNXQVz/g3/AJAdz/2FdS/9LZq6CgAooooAKKKKACiiigAooooA8r/aCsHvPhl56tgWV9FOwxnIIaP8OZBXp9rcR3dpDcxMGjmjWRCDkEEZFV9Y0q11zR7vS71N9tdRNFIAcHBHUe/evJdJ8R+KvhVbpoHiHQrzWdGtwRZ6np0ZciMH5Vdeg47EjHQZAzQB7PVC21rTLzVLrTLe+gkvrTBnt1f54wQCCR6cjmvLpPjl/bls8Hg7wrrGoai/yRmeACKNj0LFGbgcHkj6jrXS/DTwTeeGLO+1PW7j7T4g1aQTXsuchepCDHHBJyRxzjoBQBg/DOAaX8V/iPp8sgM011FdqMYJRmkfp7eaor1mvO/Hng/WH1q18ZeEHRPEFlGYpLeRsR3kXPyEZAzz3I7cggGsiT48WOkIkPiXwvrum33IaMQqyEjrtZmXI/DvQB6tdXEdpaTXMrBY4Y2kck4AAGTXmH7Plg9n8M/PZsi9vpZ0GMYACx/jzGaztV1Txd8WI/7F0rRrvQPDspAvL6/UpLKuQdqL6H2yD3IGQfWdK0y10XSbTTLGPy7W1iWKJc5IUDHJ7n3oA8r/AGcf+Seah/2FZP8A0VFXsFfMnwm+LOg+A/Ct1peqWmpTTy3r3CtaxoyhSiLg7nU5yh7elegw/H3R9SDx6N4b8Q39wBxEluh57Z2sxH5UAHxNgGp/FX4b2MbgSw3ct0wxk7VaN+nv5bVD+0d/yTzT/wDsKx/+ipa1vAvhrXdQ8U3fjrxdAltqM8X2exsRz9khz3Pqfz5OcZwMn9o7/knmn/8AYVj/APRUtAHV/FuwfUvhV4ggjbBWATk4zxG6yH9ENXvhzdw3vw38OSwSK6Lp0MRKnOGRAjD6gqRXSyIksbRyKGRgVZSOCD2rx+DTfFvwlv7lND0ybxD4SnczLaRv+/siTyF6lhj0BzjnackgHZeOtO8c3/2D/hC9ZsdN2eZ9r+1oG8zO3ZjMb9MP6dR17eWeNdU+MPgPRodU1TxZps0Etwtuq2tvGzBirNk7oFGMIe/pXVv8fdCjuBZyeHfEaXxHFubVAx/Dfn9Kx/ENn4x+M0Ntp50M+HdAhuBP9ovwTO7BWUEJwejHjp0+agDX+MkAg8Q+ANalkCW9lrKJISOBueNs57YERr1msXxZ4ZsvF/hu70W+3CKdRtdfvRuDlWH0P59K84sfHHij4dWx0rxnoN9qVnaLtg1fT18wSRKBzJk9cdyQfY9SAew15LqEA1L9pzSnicf8SzRmeYDnr5q4Pp/rlP8A+umn41TeIbVofBXhPWL++clEkuYlWGNsdWZWI444JX6iuk+Hfgq78OJqGra5ci78Q6tJ5t5KpJVB2jX2GT+g6AUAdxRXN3vjXTbHx5p3g+WC7OoX9ubiKRUXygoEhwx3Zz+7boD1H4dJQAUUUUAFFFFABRRRQAUUUUAFc/4e/wCQ54s/7Csf/pFa10Fc/wCHv+Q54s/7Csf/AKRWtABZ/wDJQ9Z/7BVh/wCjbuugrn7P/koes/8AYKsP/Rt3XQUAFFFFABRRRQAUUVR1jWdP0HTZNQ1O5S3to+rt3PYAdz7U0nJ2W4F6ivnPxd8bNZ1O4kt9BP8AZ1kCQJcAyyDkZJPC9eg5461xln488WWNwJ4fEOolwCMSztIv/fLZH6V69PJa8o3k0n2M3UR9f0V5J4B+MsOtXEOl+IFjtrxztjul+WKQ9gR/CT+X0r1uvOr4epQly1EWmnsFFFFYDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5/xl/yA7b/sK6b/AOlsNdBXP+Mv+QHbf9hXTf8A0thoA6CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDn/Bv/IDuf+wrqX/pbNXQVz/g3/kB3P8A2FdS/wDS2augoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuf8AD3/Ic8Wf9hWP/wBIrWugrn/D3/Ic8Wf9hWP/ANIrWgAs/wDkoes/9gqw/wDRt3XQVz9n/wAlD1n/ALBVh/6Nu62L29ttNspry8nSC2hUvJI5wFAppNuyAsUV4b4q+PDiWS18M2q7BwLy4XJbpyqdh16/kK4HTPiR4jt/FFrq95q11MqOFlj3ZVot2WUL09cV6lLKMROPNLTy6kOoj6worl9P+IvhDUbUTxa/ZRqTgrcSiJgf91sH8elTz+PPCdvA8z+ItMKoMkJcq7fgAST+Fee6FVO3K/uKujoa8p+PkSt4MsZTKysl6oEYbhso3JHfGP1NW9Y+OHhWwiP2A3OpSlcqI4zGmc9CzYI/AGvGPFvjTV/iDq9utwqRQIxFvbx9EB6knueOT7V6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PZWnUS5/Lp+h3Xwx+Etnd6faeIdfxOsy+bb2WPk2noz+ueuPpn0r3BVVEVEUKqjAUDAApkEMdtbxwRKFjjUIqjsBwKkrw8TiZ4ifNN+nke4kkFFFFcwwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5/xl/yA7b/ALCum/8ApbDXQVz/AIy/5Adt/wBhXTf/AEthoA6CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDn/Bv/IDuf8AsK6l/wCls1dBXP8Ag3/kB3P/AGFdS/8AS2augoAKKKKACiiigAqhrelW+u6HfaVdDMF3A0L+2RjI9x1q/RQB5n8FdVuX8NXnhrUiBqWgXTWkilsny8naenTO5R7KKoaYzeN/jve6h9/S/C8P2eEg/K1w2Qx/Pf8A98LWP8QNTuPhf8TZPFNrbvJZ63p8kMiKxx9pQfKSOnUR++C+PftPg74dl0H4f2st3uN/qbG+uWcksS/3ck852hc+5NACfG3/AJJDrv8A27/+lEdcX4a+FnirUfCukXtv8TtZs4LiyhljtoxLthVkBCDEwGADjoOnQV2nxt/5JDrv/bv/AOlEdY/hP4v+BNM8G6HYXmu+XdWun28MyfZJztdY1DDITBwQelAFf/hUHjD/AKKzrn5Tf/H69U0mzm07RrGyuLuS8nt7eOKS5kzumZVALnJJySM9T16muL/4Xb8PP+hh/wDJK4/+N11HhvxTo3i7TpL/AEO8+12scphZ/KePDgAkYcA9GH50AfPnwm0r4kX3hW6l8H+INN0/TxeuskV1GGYy7EywzE/G0qOvY8eul4i1j4s+GNY0+w8ReLLazsL5/LGpw2sTQofQkRBgfqB654OOp/Zx/wCSeah/2FZP/RUVek+J/Dlj4r8PXej6gmYZ0wHAy0bfwuvuDzQBgeBvh5aeFJ7rVrjUJtW1u+UefqE/Ujg4Xk4BwO5zgelbevR+HNbB8Ma1NYzS3ke5bCWZRK6jJ3Kud3G1juHTafSvP/hR4g1HR9UvPh14kO2/00f6DKT/AK+AdAPYDBHscY+WtH4o6Dq4vdG8ZeHbY3Wp6I7F7UDJmhYfMABySOeB2Y9+KAMO5+Aa2E8lx4U8V6npDu2SpYkY7DchU8Z75qjceIPiZ8LZobrxNLFr/h4yCOWeLBkiHQHdhSGPH3sgnjIJzXUad8dvBNzbBtQu7nTLkZElvcWsjMjA4Iyikf57Vz3jTxzB8T7A+C/Bdrc35vZIvtV80LJDbxq4bJ3YI5QdQPQZJxQB6T40njufhp4huIWDxS6PcujDuDCxBrD+CX/JIdC/7eP/AEokrV8T6fDpPwl1jTbfPk2mhTwR567UgKj9BWV8Ev8AkkOhf9vH/pRJQBjfAKKW18La7Z3b772DWplnYkklgkYJJPJ5Dda9ZryXXrHWfht4yvfFmiWE2paDqhDapYQAb4ZM8yqAOf4j9WOexGrB8cvh/LAsj6zJC5GTFJZzFh7fKpH60AdF8QHSP4deJWfGDplwvPqY2A/UiuM8OW9xbfszTR3LFpDod5ICST8jLKyDn/ZKiszWNe1P4yTJ4f8ADdrd2nhjzVbUNVlXZ5yg8ogPuAfXOMgDr6H4vtILD4X69Z2saxW8GjXEUSKMBVWFgAPwFAHP/B20t7/4K6TZ3cKTW86XMcsbjIdTPICD+FUfBF3ceBPFs/w+1SV3sZt1zodzJ0aMnLQk/wB4c/r6gVqfBL/kkOhf9vH/AKUSVqfEHwePF/h7y7d/J1azf7Tp1yDtMUy8jn0OMH8D2FAHF+Hv+TofFn/YKj/9Bta9grwD4T61eeIPjjruo6jb/Z79tJ8q5ixjbLGbeN+O3zITjtXs9x4p0a08UWnhqe82avdxGaC38pzvQBiTuA2j7jdT2+lAGxRRRQB4ZfeJNC+I/wAQRHq+s6XbeEdDk3RRXV2kf9oT9N21iMoOfbH+8cJ8fPEmg6x4EsbbSta029mTUo3MVrdRyMFEUozhSTjJAz7iu0/4Ul8PP+he/wDJ24/+OV5x8a/h34V8I+DbO/0PSvsl1JqCQs/2iWTKGOQkYdiOqj8qAPe9N1bTdZt2uNL1C0voFco0lrMsqhsA4JUkZwQce4q5WP4b8LaN4R06Sw0Oz+yWskpmZPNeTLkAE5ck9FH5VsUAFFFFABRRRQAVz/h7/kOeLP8AsKx/+kVrXQVz/h7/AJDniz/sKx/+kVrQAWf/ACUPWf8AsFWH/o27roK5+z/5KHrP/YKsP/Rt3XQUAFFFFABRRRQAVgeKfB2jeL7H7PqdsDIo/d3CcSR/Q+nseK36KqE5QkpRdmB8s+NPhbrfhIvcqhvtNBJFzEvKD/bXt9elcVbW095cx29tC808h2pHGpZmPsBX20QGBBAIPBBrPstA0fTrp7qx0qytriTO+WGBUZsnJyQK9ulnclC1SN2Zun2PGvBPwQllZL7xSTHGCCtlG3zNx/Gw6fQV7haWlvYWsdraQRwQRjakca7VUewqaivLxOLq4iV6j+XQtRS2CiiiuYYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXP+Mv+QHbf9hXTf/S2Gugrn/GX/IDtv+wrpv8A6Ww0AdBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBz/g3/kB3P/YV1L/0tmroK5/wb/yA7n/sK6l/6WzV0FABRRRQAUUUUAFFFFAFLUtH0zWYUh1TTrO+iRt6pdQLKqt0yAwODVxVVFCqAqgYAAwAKWigCvfWFnqdnJZ39pBd2smN8M8YkRsEEZU8HBAP4Vj/APCCeD/+hU0P/wAF0P8A8TXQUUAc/wD8IJ4P/wChU0P/AMF0P/xNamm6TpujW7W+l6faWMDOXaO1hWJS2AMkKAM4AGfYVcooAp6bpOm6Nbtb6Xp9pYwM5do7WFYlLYAyQoAzgAZ9hVyiigCjPoulXOpxanPpllLfwgCK6kgVpUAzgK5GR1PQ9zV6iigDO1Dw/ourkHUtH0+9IOQbm2STB/4EDVu2tLayhENrbxQRDokSBVH4CpqKAI54Ibq3lt7iKOaCVCkkcihldSMEEHggjjFR2NhZ6ZZx2dhaQWlrHnZDBGI0XJJOFHAyST+NWKKACsq58MeH7y8W8utC0ye6TBWeW0jZ1wcjDEZ681q0UANREjQIihVHAVRgCmzwQ3VvLb3EUc0EqFJI5FDK6kYIIPBBHGKkooAr2NhZ6ZZx2dhaQWlrHnZDBGI0XJJOFHAyST+NWKKKAKUOj6Xb6nNqcGm2cWoTrtlukgVZZBxwzgZI4HU9h6Usmk6bNqkOqS6faPqEKbIrtoVMqLzwr4yB8zcA9z61cooAKKKKACqepaTpus262+qafaX0CuHWO6hWVQ2CMgMCM4JGfc1cooAKKKKACiiigAooooAK5/w9/wAhzxZ/2FY//SK1roK5/wAPf8hzxZ/2FY//AEitaACz/wCSh6z/ANgqw/8ARt3XQVz9n/yUPWf+wVYf+jbuugoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArn/GX/IDtv+wrpv8A6Ww10Fc/4y/5Adt/2FdN/wDS2GgDoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAOf8G/8gO5/7Cupf+ls1dBXP+Df+QHc/wDYV1L/ANLZq6CgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5/wAPf8hzxZ/2FY//AEita6Cuf8Pf8hzxZ/2FY/8A0itaACz/AOSh6z/2CrD/ANG3ddBXP2f/ACUPWf8AsFWH/o27roKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5/xl/wAgO2/7Cum/+lsNdBXP+Mv+QHbf9hXTf/S2GgDoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAOf8G/8AIDuf+wrqX/pbNXQVz/g3/kB3P/YV1L/0tmroKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArn/D3/Ic8Wf9hWP/ANIrWugrn/D3/Ic8Wf8AYVj/APSK1oALP/koes/9gqw/9G3ddBWXqXhrQdZuFuNU0TTb6dUCLJdWqSsFyTgFgTjJJx7mqf8Awgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBXP8AjL/kB23/AGFdN/8AS2Gj/hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoAPBv/ACA7n/sK6l/6WzV0Fc//AMIJ4P8A+hU0P/wXQ/8AxNH/AAgng/8A6FTQ/wDwXQ//ABNAHQUVz/8Awgng/wD6FTQ//BdD/wDE0f8ACCeD/wDoVND/APBdD/8AE0AdBRXP/wDCCeD/APoVND/8F0P/AMTR/wAIJ4P/AOhU0P8A8F0P/wATQB0FFc//AMIJ4P8A+hU0P/wXQ/8AxNH/AAgng/8A6FTQ/wDwXQ//ABNAHQUVz/8Awgng/wD6FTQ//BdD/wDE0f8ACCeD/wDoVND/APBdD/8AE0AdBRXP/wDCCeD/APoVND/8F0P/AMTR/wAIJ4P/AOhU0P8A8F0P/wATQB0FFc//AMIJ4P8A+hU0P/wXQ/8AxNH/AAgng/8A6FTQ/wDwXQ//ABNAHQUVz/8Awgng/wD6FTQ//BdD/wDE0f8ACCeD/wDoVND/APBdD/8AE0AdBRXP/wDCCeD/APoVND/8F0P/AMTR/wAIJ4P/AOhU0P8A8F0P/wATQB0FFc//AMIJ4P8A+hU0P/wXQ/8AxNH/AAgng/8A6FTQ/wDwXQ//ABNAHQUVz/8Awgng/wD6FTQ//BdD/wDE0f8ACCeD/wDoVND/APBdD/8AE0AdBRXP/wDCCeD/APoVND/8F0P/AMTR/wAIJ4P/AOhU0P8A8F0P/wATQB0FFc//AMIJ4P8A+hU0P/wXQ/8AxNH/AAgng/8A6FTQ/wDwXQ//ABNAHQUVz/8Awgng/wD6FTQ//BdD/wDE0f8ACCeD/wDoVND/APBdD/8AE0AdBRXP/wDCCeD/APoVND/8F0P/AMTR/wAIJ4P/AOhU0P8A8F0P/wATQB0FFc//AMIJ4P8A+hU0P/wXQ/8AxNH/AAgng/8A6FTQ/wDwXQ//ABNAHQUVz/8Awgng/wD6FTQ//BdD/wDE0f8ACCeD/wDoVND/APBdD/8AE0AdBRXP/wDCCeD/APoVND/8F0P/AMTR/wAIJ4P/AOhU0P8A8F0P/wATQB0FFc//AMIJ4P8A+hU0P/wXQ/8AxNH/AAgng/8A6FTQ/wDwXQ//ABNAHQUVz/8Awgng/wD6FTQ//BdD/wDE0f8ACCeD/wDoVND/APBdD/8AE0AdBXP+Hv8AkOeLP+wrH/6RWtH/AAgng/8A6FTQ/wDwXQ//ABNamm6TpujW7W+l6faWMDOXaO1hWJS2AMkKAM4AGfYUAf/Z'
	  	doc.addImage(encabezado, 'PNG', 150, 20, 300, 67)

	  	doc.setFontSize(10)
	  	doc.text(100, 130, "Vehículo: " + $scope.vehiculo.MARCA + " " + $scope.vehiculo.LINEA + " " + $scope.vehiculo.MODELO)
	  	doc.text(400, 130, "KM: " + $scope.vehiculo.KM_ACTUAL)
	  	doc.text(100, 150, "Placa: " + $scope.vehiculo.PLACA)

	  	var fecha = new Date()
		var mes = fecha.getMonth() + 1

	  	doc.text(400, 150, "Fecha: " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() )

	  	$http({

			method: 'GET',
			url: 'routes/mantenimientos/obtener_detalles.php',
			params: { id: id }

		}).then(function successCallback(response){

			$scope.detalle_mantenimiento = response.data[0]
			$scope.detalle_mantenimiento.RESPONSABLE_1 = response.data[3]
			$scope.detalle_mantenimiento.RESPONSABLE_2 = response.data[4]
			$scope.detalle_mantenimiento.REVISIONES = response.data[1]
			$scope.detalle_mantenimiento.NO_REVISIONES = $scope.detalle_mantenimiento.REVISIONES.length
			$scope.detalle_mantenimiento.OTRAS_REVISIONES = response.data[2]
			$scope.detalle_mantenimiento.NO_REVISIONES_EXTRAS = $scope.detalle_mantenimiento.OTRAS_REVISIONES.length
			$scope.detalle_mantenimiento.EVALUACION = response.data[5]

			$timeout(function () {

				doc.setFontSize(8)

				/* Primera Tabla  */
				var res = doc.autoTableHtmlToJson(document.getElementById("descripcion_mantenimiento"));
			  	doc.autoTable(res.columns, res.data, {margin: {top: 180}, theme: 'grid', styles: { fontSize: 8, columnWidth: 'auto' }});

			  	/* Tercera Tabla */
			  	var options = {
				    margin: {
				      top: 40
				    },
				    theme: 'grid',
				    styles: { fontSize: 8, columnWidth: 'auto' },
				    startY: doc.autoTableEndPosY() + 20
			  	};

				var res = doc.autoTableHtmlToJson(document.getElementById("evaluacion"));
			  	doc.autoTable(res.columns, res.data, options);

				doc.save('Evaluacion de proveedor.pdf')

    		}, 500);

		})
	}

	/* Cerrar Gestión */

	$scope.eliminarMantenimiento = function(id, inventario_id){

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
					url: 'routes/mantenimientos/eliminar.php',
					params: {id: id, inventario_id: inventario_id}

				}).then(function successCallback(response){

					swal("Excelente!", "Se ha eliminado el registro del historial con éxito!", "success")

			    	$scope.mantenimientos = response.data

			    	console.log(response.data)

					$scope.filter_data_mantenimientos = $scope.mantenimientos.length

				})

		  	}
		});
	}

	$scope.cargar_detalles_mantenimiento = function(){

		$scope.mantenimiento.OTROS_TRABAJOS = []

		if ($scope.mantenimiento.TIPO_MANTENIMIENTO_ID != '') {

			$http({
				method: 'GET',
				url: 'routes/mantenimientos/obtener_detalles_tipo.php',
				params: {id: $scope.mantenimiento.TIPO_MANTENIMIENTO_ID}

			}).then(function successCallback(response){

				$scope.detalles_tipo_mantenimiento = response.data

				$scope.otros_trabajos = {}
				//$scope.otros_trabajos.NOMBRE =

			})

		}
	}

	$scope.agregar_otro_trabajo = function(){

		//console.log($scope.mantenimiento.OTRO_TRABAJO)

		if (!$scope.mantenimiento.OTROS_TRABAJOS.includes($scope.mantenimiento.OTRO_TRABAJO)) {

			$scope.mantenimiento.OTROS_TRABAJOS.push($scope.mantenimiento.OTRO_TRABAJO)

		}
	}

	/* ACCESORIOS DE VEHICULOS */

	$scope.nuevoAccesorios = function(){
	}

	/* DOCUMENTOS */

	$scope.page_position_documentos = function(page_number){

		$scope.current_grid_documentos = page_number
	}

	$scope.filter_documentos = function(){

		$timeout(function(){
			$scope.filter_data_documentos = $scope.searched_documentos.length

		}, 20)
	}

	$scope.sort_with_documentos = function(base_documentos){

		$scope.base_documentos = base_documentos
		$scope.reverse_documentos = !$scope.reverse_documentos
	}

	$scope.imageIsLoaded = function(e){
		$scope.$apply(function (){
			$scope.step = e.target.result
		})
	}

	$scope.imageUpload = function(event){

		var files = event.target.files
		var file = files[files.length-1]
		$scope.file = file
		var reader = new FileReader()
		reader.onload = $scope.imageIsLoaded
		reader.readAsDataURL(file)

		$scope.tipo_archivo = file.type

		if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/jpg") {

			$scope.isImage = 1

		} else {

			$scope.isImage = 0

		}
	}

	$scope.subirDocumento = function(){

		var fd = new FormData()

		angular.forEach($scope.files, function(file){

			fd.append('file', file)
		})

		/* Se sube el archivo al servidor */

		$http({

			method:'POST',
			url: 'routes/documentos/mover_documento.php',
			data: fd,
			transformRequest: angular.identity,
			headers : { 'Content-Type': undefined }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.documento.DIRECTORIO = response.data[0]
			$scope.documento.NOMBRE_ARCHIVO = response.data[1]
			$scope.documento.TIPO_ARCHIVO = response.data[2]
			$scope.documento.INVENTARIOID = $scope.vehiculo.INVENTARIOID

			/* Se crea el registro en la base de datos */

			$http({

				method: 'POST',
				url: 'routes/documentos/registrar_documento.php',
				data: $scope.documento,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				swal("Excelente!", "Se ha subido el archivo con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#documento').modal('hide')

					});

				/* Actualizar la tabla de Documentos */
				$scope.documentos = response.data[0]
				$scope.filter_data_documentos = $scope.documentos.length

				/* Actualizar la tabla de Bitacora */
				$scope.b_eventos = response.data[1]
				$scope.filter_data_b_eventos = $scope.b_eventos.length

			})

		})
	}

	$scope.eliminarDocumento = function(id){

		swal({
		  	title: "¿Está seguro?",
		  	text: "Una vez eliminado no se podrá recuperar el archivo!",
		  	icon: "warning",
		  	buttons: true,
		  	dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {

				/* Eliminar documento */

				$http({

					method: 'GET',
					url: 'routes/documentos/eliminar_documento.php',
					params: {id: id}

				}).then(function successCallback(response){

					$scope.documentos = response.data[0]
					$scope.filter_data_documentos = $scope.documentos.length

					/* Actualizar la tabla de Bitacora */
					$scope.b_eventos = response.data[1]
					$scope.filter_data_b_eventos = $scope.b_eventos.length

					swal("El archivo ha sido eliminado con éxito!", {
			      		icon: "success",
			    	});

				})

		  	}
		});
	}

	$scope.verEditarDocumento = function(id){

		$http({

			method: 'GET',
			url: 'routes/documentos/obtener_documento.php',
			params: {id: id}

		}).then(function successCallback(response){

			$scope.editar_documento = response.data

			if (response.data.TIPO_ARCHIVO == 'image/jpeg'
				|| response.data.TIPO_ARCHIVO == 'image/png'
				|| response.data.TIPO_ARCHIVO == 'image/jpg' ) {

				$scope.editar_documento.IS_IMAGE = 1

			} else {

				$scope.editar_documento.IS_IMAGE = 0

			}

		})

		$('#editarDocumento').modal('show')
	}

	$scope.editarDocumento = function(){

		/* Validad si ha seleccionado un nuevo archivo */

		var archivo = $('#editar_archivo').val()

		if (archivo == '') {

			/* No selecciono archivo */

			$scope.editar_documento.NUEVO_DIRECTORIO = ''

			$http({

				method: 'POST',
				url: 'routes/documentos/editar_documento.php',
				data: $scope.editar_documento,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				/* Actualizar tabla de documentos */
				$scope.documentos = response.data[0]
				$scope.filter_data_documentos = $scope.documentos.length

				/* Actualizar bitacora */

				swal("Excelente!", "Se editado el archivo con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#editarDocumento').modal('hide')

					});

			})

		} else {

			/* Selecciono archivo */

			var fd = new FormData()

			angular.forEach($scope.files, function(file){

				fd.append('file', file)
			})

			$http({

				method: 'POST',
				url: 'routes/documentos/mover_documento.php',
				data: fd,
				transformRequest: angular.identity,
				headers : { 'Content-Type': undefined }

			}).then(function successCallback(response){

				$scope.editar_documento.NUEVO_DIRECTORIO = response.data[0]
				$scope.editar_documento.NUEVO_NOMBRE_ARCHIVO = response.data[1]
				$scope.editar_documento.NUEVO_TIPO_ARCHIVO = response.data[2]

				$http({

					method: 'POST',
					url: 'routes/documentos/editar_documento.php',
					data: $scope.editar_documento,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

				}).then(function successCallback(response){

					$scope.documentos = response.data[0]
					$scope.filter_data_documentos = $scope.documentos.length

					swal("Excelente!", "Se editado el archivo con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#editarDocumento').modal('hide')

					});

				})

			})

		}
	}

	$scope.imageIsLoaded_ = function(e){
		$scope.$apply(function (){
			$scope.editar_documento.ARCHIVO = e.target.result
		})
	}

	$scope.imageUpload_ = function(event){

		var files = event.target.files
		var file = files[files.length-1]
		$scope.file = file
		var reader = new FileReader()
		reader.onload = $scope.imageIsLoaded_
		reader.readAsDataURL(file)

		$scope.tipo_archivo = file.type

		if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/jpg") {

			$scope.editar_documento.IS_IMAGE = 1

		} else {

			$scope.editar_documento.IS_IMAGE = 0

		}
	}

	/* REPORTES */

	$scope.reporteMensual = function(){

		if ($scope.tipo_reporte == 1) {

			$scope.reporte.MES = $('#mes').val()

			$http({

				method: 'POST',
				url: 'routes/reportes/reporte_mensual.php',
				data: $scope.reporte,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				$scope.reporte_template_url = "views/layouts/reportes/reporte_combustible.html"

				$scope.reporte_generado_e_s = false
				$scope.reporte_mantenimiento_ = false
				$scope.reporte_combustible_anual = false
				$scope.estado_reporte_rendimiento = false
				$scope.reporte_generado = true
				$scope.estado_reporte_vales = false
				$scope.no_reporte = 1

				$scope.semanas = response.data[0]
				$scope.total_cuota = response.data[1]
				$scope.total_abastecido = response.data[2]
				$scope.total_restante = response.data[3]
				$scope.mes = response.data[7]

				/* Reset Canvas */
				$('#myChart').remove()
				$('#graph-container').append('<canvas id="myChart" style="width: 25%;"></canvas>')

				/* Cargar grafica */
				var ctx = document.getElementById("myChart").getContext('2d');

				var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			    	/* Etiquetas de cada conjunto de barras */
			        labels: response.data[5],
			        datasets: response.data[6]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
			});

				$('#modalReporteMensual').modal('hide')

			})

		}else if($scope.tipo_reporte == 2){

			$scope.reporte.YEAR = $('#year').val()

			$http({

				method: 'POST',
				url: 'routes/reportes/reporte_anual_combustible.php',
				data: $scope.reporte,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.reporte_generado_e_s = false
				$scope.reporte_mantenimiento_ = false
				$scope.reporte_generado = false
				$scope.estado_reporte_rendimiento = false
				$scope.reporte_combustible_anual = true

				$scope.year = response.data[0]
				$scope.galones_total = response.data[1]
				$scope.galones_autorizados = response.data[2]
				$scope.diferencias = response.data[3]
				$scope.pendientes = response.data[4]

				/* Reset Canvas */
				$('#grafica_combustible_anual').remove()
				$('#graph-container_combustible_anual').append('<canvas id="grafica_combustible_anual" style="width: 25%;"></canvas>')

				var ctx = document.getElementById("grafica_combustible_anual").getContext('2d')

				var myChart = new Chart(ctx, {
						type: 'line',
						data: {
							labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
							datasets: [{
								label: 'Galones Total',
								backgroundColor: 'rgba(54, 162, 235, 0.2)',
								borderColor: 'rgba(54, 162, 235, 1)',
								data: response.data[1],
								fill: false,
							}, {
								label: 'Galones Autorizados',
								fill: false,
								backgroundColor: 'rgba(255, 99, 132, 0.2)',
								borderColor: 'rgba(255, 99, 132, 1)',
								data: response.data[2],
							},{
								label: '% Diferencia',
								fill: false,
								backgroundColor: 'rgba(80, 23, 170, 0.2)',
								borderColor: 'rgba(80, 23, 170, 1)',
								data: response.data[3],
							},{
								label: 'Galones Pendientes',
								fill: false,
								backgroundColor: 'rgba(105, 186, 35, 0.2)',
								borderColor: 'rgba(105, 186, 35, 1)',
								data: response.data[4],
							}]
						},
						options: {
							responsive: true,
							title: {
								display: true,
								text: 'Consumo de Combustible - ' + $scope.year
							},
							tooltips: {
								mode: 'index',
								intersect: false,
							},
							hover: {
								mode: 'nearest',
								intersect: true
							},
							scales: {
								xAxes: [{
									display: true,
									scaleLabel: {
										display: true,
										labelString: 'Mes'
									}
								}],
								yAxes: [{
									display: true,
									scaleLabel: {
										display: true,
										labelString: 'Valores'
									}
								}]
							}
						}
					});

				$('#modalReporteMensual').modal('hide')

			})

		}
	}

	$scope.reporteAnual = function(){

		console.log('reporte anual')
	}

	$scope.imprimirReporte = function(no_reporte){

		if (no_reporte == 1) {

			var doc = new jsPDF('p', 'pt');

			var encabezado = 'data:image/jpeg;base64,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+hJf/wAGkNH9v+K/+hJf/wAGkNdVRQByv9v+K/8AoSX/APBpDR/b/iv/AKEl/wDwaQ11VFAHK/2/4r/6El//AAaQ0f2/4r/6El//AAaQ11VFAHK/2/4r/wChJf8A8GkNH9v+K/8AoSX/APBpDXVUUAcr/b/iv/oSX/8ABpDR/b/iv/oSX/8ABpDXVUUAcr/b/iv/AKEl/wDwaQ0f2/4r/wChJf8A8GkNdVRQBleG9aXxFoFrqq2723n7swuwYoVYqRkcHla1a5X4b/8AIh6f/vz/APo566qgDlPCX/If8Xf9hNf/AETHXV1ynhL/AJD/AIu/7Ca/+iY66ugAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAOV13/koPhL/cvf/Ra11Vcrrv8AyUHwl/uXv/ota6qgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDldA/wCR88X/AO/af+ia6quV0D/kfPF/+/af+ia6qgAooooAKK5KbzvFus6hpxubiz07TJRDMLeQxyzylQwO9eVQBhwOSc54q5p3h250S/jbT9RuJrKTIuYL6d5m6cMjEkg9sdCD60AamqapBpNqJ51lfe4jjjhQu7uegA9au1xdhaP46s11e8vLy1smd1tLa0uGhZQrFSzsp+ZiVPHQDHqaqaxqV/ouma/oDXcsskGjzXtlebsSJGMqFY92B6N3A55oA7+iuL0/wPZzaZa3A1bXFneFH3nUpWAYqDnBODz2qnb65qNx410bSrqc+dZXFzb3bRHbHc/6OHRivrgjI7HOOKAPQKK49IpfGl5qAnu7q002wuntEhtZmikklQ4Z2dedvPAHrk9q1dMsbvQo7mN7xrvTY498HnMWnQ8llLH7w7gnnnHQCgDbori9P0tvGlhBrmo399BDdIJLS2s7p4RDEegYqRuY9ST07cVb0zVtRtLrUdEnjbUr3T445Y5FYIZo3JChs8BxtOex470AdTRRRQAUUUUAcr8N/wDkQ9P/AN+f/wBHPXVVyvw3/wCRD0//AH5//Rz11VAHKeEv+Q/4u/7Ca/8AomOurrlPCX/If8Xf9hNf/RMddXQAUUUUAFFFch44+Iel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'
	  		doc.addImage(encabezado, 'JPEG', 90, 20, 400, 90)

	  		var res = doc.autoTableHtmlToJson(document.getElementById("tabla_reporte_semanal"));
	  		doc.autoTable(res.columns, res.data, {margin: {top: 210}});

	  		var text = "Resumen Mes de " + $scope.mes
	  		var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
		    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
		    doc.text(textOffset, 140, text);

		    var text = "Vehículo " + $scope.vehiculo.PLACA;
	  		var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
		    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
		    doc.text(textOffset, 160, text);

		    var fecha = new Date()
		    var mes = fecha.getMonth() + 1
			doc.setFontSize(8)
		    doc.text(400, 800, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())


			/* Captura de la tabla */

			html2canvas(document.querySelector("#myChart")).then(canvas => {

    			//document.body.appendChild(canvas)
    			var tabla = canvas.toDataURL(
	                    'image/jpeg', 1.0)

    			doc.addImage(tabla, 'JPEG', 100, 400, 400, 200)

    			var nombre_archivo = "Consumo de combustible - " + $scope.vehiculo.PLACA + " - " + $scope.mes + ".pdf"

    			doc.save(nombre_archivo)

			});


		} else if (no_reporte == 2) {

			/* Se imprimie reporte de Entradas y Salidas */

			var doc = new jsPDF('l', 'pt');

			var encabezado = 'data:image/jpeg;base64,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'
	  		doc.addImage(encabezado, 'JPEG', 300, 20, 240, 54)

	  		doc.setFontSize(8)
	  		doc.text(10, 90, "PLACA: " + $scope.vehiculo.PLACA)
	  		doc.text(210, 90, "TIPO: " + $scope.vehiculo.TIPO)
	  		doc.text(410, 90, "MES: " + $scope.mes)
	  		var resp = $scope.vehiculo.NOMBRE + " " + $scope.vehiculo.APELLIDO
	  		doc.text(610, 90, "RESPONSABLE: " + resp.toUpperCase())

	  		var options = {
			    margin: {
			    	top: 30,
			      	left: 10,
			      	right: 10
			    },
			    styles: { fontSize: 5, columnWidth: 'auto' },
			    startY: 100,
			    addPageContent: function(data) {

    				var fecha = new Date()
		    		var mes = fecha.getMonth() + 1
		    		doc.text(10, 570, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())

    			}
  			};

			var res = doc.autoTableHtmlToJson(document.getElementById("table_reporte_e_s"));
	  		doc.autoTable(res.columns, res.data, options);

		    var nombre = "Reporte Salidas/Entradas - " + $scope.vehiculo.PLACA + " - " + $scope.mes + ".pdf"

	  		doc.save(nombre)

		} else if (no_reporte == 3) {

			/* Reporte de Mantenimiento */

			var doc = new jsPDF('p', 'pt');

			/* Encabezado */
			var encabezado = 'data:image/jpeg;base64,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E+sjw94X1TWCgkNnbPMqE4DMBwM9snArifhF4UjttBj8Wapi78QayPtMt3J8zKjcqq8fLkYJx646AUAUT8Yde+05/wCFY+IvsH/Pfy5N2Mf3fLx14+9/hXV+DfiRoHjZpYLCSW31CEEy2N0myVADjPcEZ9CcZGcZrrq4fxL8PxqvjLRPFOlXMen6lYzZuJPLz9oixgqffGVz6MfQUAdwSAMngV5vrPxj0q21GbTPD+l6h4jv4Qd6afEWjVvQsAe/cAipPjDrF9ZeGbLR9MlMN5rl7Hp6zA4Mat94/jwv0Y11nhnwxpfhPRotM0q2SGJQC7hfmlbGCzHuT/8AWoA4C2+NbWZRvFXg3W9Bhd9ouJIXeMDsSSinr2ANenWGoWeq2MN9YXMVzazLujlibcrD61JdWtve2strdQRz28qlJIpFDK6nqCD1FeVeCIpfBHxX1fwVHIW0e9t/7S0+Nnz5JzhlAx0+8Pog7k0AetUVzd7e+K08eadaWmmWknhd7cteXrMPNjlxJhVG8HGRH/CfvHn06SgAooooAKKKKACiiigAooooAK5/w9/yHPFn/YVj/wDSK1roK5/w9/yHPFn/AGFY/wD0itaACz/5KHrP/YKsP/Rt3XQVz9n/AMlD1n/sFWH/AKNu66CgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuf8AGX/IDtv+wrpv/pbDXQVz/jL/AJAdt/2FdN/9LYaAOgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA5/wAG/wDIDuf+wrqX/pbNXQVz/g3/AJAdz/2FdS/9LZq6CgAooooAKKKKACiiigAooooA8r/aCsHvPhl56tgWV9FOwxnIIaP8OZBXp9rcR3dpDcxMGjmjWRCDkEEZFV9Y0q11zR7vS71N9tdRNFIAcHBHUe/evJdJ8R+KvhVbpoHiHQrzWdGtwRZ6np0ZciMH5Vdeg47EjHQZAzQB7PVC21rTLzVLrTLe+gkvrTBnt1f54wQCCR6cjmvLpPjl/bls8Hg7wrrGoai/yRmeACKNj0LFGbgcHkj6jrXS/DTwTeeGLO+1PW7j7T4g1aQTXsuchepCDHHBJyRxzjoBQBg/DOAaX8V/iPp8sgM011FdqMYJRmkfp7eaor1mvO/Hng/WH1q18ZeEHRPEFlGYpLeRsR3kXPyEZAzz3I7cggGsiT48WOkIkPiXwvrum33IaMQqyEjrtZmXI/DvQB6tdXEdpaTXMrBY4Y2kck4AAGTXmH7Plg9n8M/PZsi9vpZ0GMYACx/jzGaztV1Txd8WI/7F0rRrvQPDspAvL6/UpLKuQdqL6H2yD3IGQfWdK0y10XSbTTLGPy7W1iWKJc5IUDHJ7n3oA8r/AGcf+Seah/2FZP8A0VFXsFfMnwm+LOg+A/Ct1peqWmpTTy3r3CtaxoyhSiLg7nU5yh7elegw/H3R9SDx6N4b8Q39wBxEluh57Z2sxH5UAHxNgGp/FX4b2MbgSw3ct0wxk7VaN+nv5bVD+0d/yTzT/wDsKx/+ipa1vAvhrXdQ8U3fjrxdAltqM8X2exsRz9khz3Pqfz5OcZwMn9o7/knmn/8AYVj/APRUtAHV/FuwfUvhV4ggjbBWATk4zxG6yH9ENXvhzdw3vw38OSwSK6Lp0MRKnOGRAjD6gqRXSyIksbRyKGRgVZSOCD2rx+DTfFvwlv7lND0ybxD4SnczLaRv+/siTyF6lhj0BzjnackgHZeOtO8c3/2D/hC9ZsdN2eZ9r+1oG8zO3ZjMb9MP6dR17eWeNdU+MPgPRodU1TxZps0Etwtuq2tvGzBirNk7oFGMIe/pXVv8fdCjuBZyeHfEaXxHFubVAx/Dfn9Kx/ENn4x+M0Ntp50M+HdAhuBP9ovwTO7BWUEJwejHjp0+agDX+MkAg8Q+ANalkCW9lrKJISOBueNs57YERr1msXxZ4ZsvF/hu70W+3CKdRtdfvRuDlWH0P59K84sfHHij4dWx0rxnoN9qVnaLtg1fT18wSRKBzJk9cdyQfY9SAew15LqEA1L9pzSnicf8SzRmeYDnr5q4Pp/rlP8A+umn41TeIbVofBXhPWL++clEkuYlWGNsdWZWI444JX6iuk+Hfgq78OJqGra5ci78Q6tJ5t5KpJVB2jX2GT+g6AUAdxRXN3vjXTbHx5p3g+WC7OoX9ubiKRUXygoEhwx3Zz+7boD1H4dJQAUUUUAFFFFABRRRQAUUUUAFc/4e/wCQ54s/7Csf/pFa10Fc/wCHv+Q54s/7Csf/AKRWtABZ/wDJQ9Z/7BVh/wCjbuugrn7P/koes/8AYKsP/Rt3XQUAFFFFABRRRQAUUVR1jWdP0HTZNQ1O5S3to+rt3PYAdz7U0nJ2W4F6ivnPxd8bNZ1O4kt9BP8AZ1kCQJcAyyDkZJPC9eg5461xln488WWNwJ4fEOolwCMSztIv/fLZH6V69PJa8o3k0n2M3UR9f0V5J4B+MsOtXEOl+IFjtrxztjul+WKQ9gR/CT+X0r1uvOr4epQly1EWmnsFFFFYDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5/xl/yA7b/sK6b/AOlsNdBXP+Mv+QHbf9hXTf8A0thoA6CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDn/Bv/IDuf+wrqX/pbNXQVz/g3/kB3P8A2FdS/wDS2augoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuf8AD3/Ic8Wf9hWP/wBIrWugrn/D3/Ic8Wf9hWP/ANIrWgAs/wDkoes/9gqw/wDRt3XQVz9n/wAlD1n/ALBVh/6Nu62L29ttNspry8nSC2hUvJI5wFAppNuyAsUV4b4q+PDiWS18M2q7BwLy4XJbpyqdh16/kK4HTPiR4jt/FFrq95q11MqOFlj3ZVot2WUL09cV6lLKMROPNLTy6kOoj6worl9P+IvhDUbUTxa/ZRqTgrcSiJgf91sH8elTz+PPCdvA8z+ItMKoMkJcq7fgAST+Fee6FVO3K/uKujoa8p+PkSt4MsZTKysl6oEYbhso3JHfGP1NW9Y+OHhWwiP2A3OpSlcqI4zGmc9CzYI/AGvGPFvjTV/iDq9utwqRQIxFvbx9EB6knueOT7V6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RXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AdBRXP/APCCeD/+hU0P/wAF0P8A8TR/wgng/wD6FTQ//BdD/wDE0AHg3/kB3P8A2FdS/wDS2augrn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoKK5//hBPB/8A0Kmh/wDguh/+Jo/4QTwf/wBCpof/AILof/iaAOgorn/+EE8H/wDQqaH/AOC6H/4mj/hBPB//AEKmh/8Aguh/+JoA6Ciuf/4QTwf/ANCpof8A4Lof/iaP+EE8H/8AQqaH/wCC6H/4mgDoK5/w9/yHPFn/AGFY/wD0itaP+EE8H/8AQqaH/wCC6H/4mtTTdJ03RrdrfS9PtLGBnLtHawrEpbAGSFAGcADPsKAP/9k='
	  		doc.addImage(encabezado, 'JPEG', 180, 20, 240, 54)

			/* Tabla de Detalles del Vehiculo */

			doc.setFontSize(8)
			doc.text(20, 130, "Descripción general de vehículo " + $scope.vehiculo.PLACA)
			doc.setFontSize(12)
			doc.text(160, 90, "Reporte de Mantenimiento " + $scope.reporte_m.FECHA_INICIO + " - " + $scope.reporte_m.FECHA_FIN)
			var res = doc.autoTableHtmlToJson(document.getElementById("table_detalles_vehiculo"));
	  		doc.autoTable(res.columns, res.data, {margin: {top: 140, left: 20}, theme: 'grid', styles: { fontSize: 8, columnWidth: 'auto' }});

	  		var options = {
			    margin: {
			    	top: 30,
			      	left: 20

			    },
			    theme: 'grid',
			    styles: { fontSize: 5, columnWidth: 'auto' },
			    startY: 385,
			    addPageContent: function(data) {

			    	doc.setFontSize(8)

    				var fecha = new Date()
		    		var mes = fecha.getMonth() + 1
		    		doc.text(20, 820, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())

    			}
  			};

			/* Tabla de Mantenimientos */
			doc.setFontSize(8)
			doc.text(20, 375, "Descripción pormenorizada de todo lo acontecido al vehículo " + $scope.vehiculo.PLACA)
			var res = doc.autoTableHtmlToJson(document.getElementById("table_reporte_mantenimiento"));
	  		//doc.autoTable(res.columns, res.data, {margin: {top: 265, left: 20, right: 20}, styles: { fontSize: 8, columnWidth: 'auto' }});
	  		doc.autoTable(res.columns, res.data, options);

			var nombre = "Reporte Mantenimiento - " + $scope.vehiculo.PLACA + ".pdf"

			doc.save(nombre)

		} else if(no_reporte == 4){

			/* Reporte de Rendimiento */

			var doc = new jsPDF('p', 'pt');

			doc.setFontSize(18)
		  	doc.text(65, 50, 'Reporte de Rendimiento - ' + $scope.mes_inicio + ' a ' + $scope.mes_fin)
		  	doc.setFontSize(14)
		  	doc.text(240, 70, 'Vehículo ' + $scope.vehiculo.PLACA)


			var fecha = new Date()
			var mes = fecha.getMonth() + 1
			doc.setFontSize(8)
			doc.text(450, 450, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())

			var res = doc.autoTableHtmlToJson(document.getElementById("tabla_rendimiento_mensual"));
		  	doc.autoTable(res.columns, res.data, {margin: {top: 400}, styles: { columnWidth: 'auto', halign: 'right' }});

		  	html2canvas(document.querySelector("#grafica_rendimiento_mensual")).then(canvas => {

	    		//document.body.appendChild(canvas)
	    		var grafica = canvas.toDataURL('image/jpeg', 1.0)

	    		doc.addImage(grafica, 'JPEG', 47, 130, 500, 250)

	    		doc.save('Consumo de combustible - ' + $scope.mes +'.pdf')

	    		//doc.save('dataurlnewwindow')

			});

		}else if(no_reporte == 5){

			//alert('reporte 5')

			var doc = new jsPDF('l', 'pt');

			var encabezado = 'data:image/jpeg;base64,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'

			doc.addImage(encabezado, 'JPEG', 300, 20, 240, 54)

			doc.setFontSize(10)
			doc.text(325, 100, "Reporte de Vales - " + $scope.fecha_inicio + " a " + $scope.fecha_fin)

			var options = {
				theme: 'grid',
			    margin: {
			    	top: 30,
			      	left: 10,
			      	right: 10
			    },
			    styles: { fontSize: 7, columnWidth: 'auto',},
			    startY: 125,
			    addPageContent: function(data) {

    				var fecha = new Date()
		    		var mes = fecha.getMonth() + 1
					doc.setFontSize(8)
		    		doc.text(10, 570, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())

					doc.text(350, 570, "Cantidad de registros: " + $scope.datos_reporte_vales.length)

    			},
				columnStyles:{
				        0: {halign:'right'},
						1: {halign:'right'},
						2: {halign:'left'},
						3: {halign:'left'},
						4: {halign:'right'},
						5: {halign:'left'},
						6: {halign:'left'},
						7: {halign:'left'},
						8: {halign:'left'},
						9: {halign:'left'}
				},
				headerStyles: {
					halign:'center',

				},
  			};

			var res = doc.autoTableHtmlToJson(document.getElementById("tabla_reporte_vales"));
	  		doc.autoTable(res.columns, res.data, options);


			doc.save('Reporte de Vales.pdf')

		}
	}

	$scope.reporteEntradasSalidas = function(){

		var fecha = new Date($('#mes2').val())
		$scope.reporte_e_s.MES = $('#mes2').val()

		$http({

			method: 'POST',
			url: 'routes/reportes/reporte_entradas_salidas.php',
			data: $scope.reporte_e_s,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.movimientos = response.data[0]
			var mes = response.data[1]
			$scope.mes = mes.toUpperCase()

			$scope.reporte_generado_e_s = true
			$scope.reporte_generado = false
			$scope.reporte_mantenimiento_ = false
			$scope.reporte_combustible_anual = false
			$scope.estado_reporte_rendimiento = false
			$scope.estado_reporte_rendimiento = false
			$scope.estado_reporte_vales = false
			$scope.no_reporte = 2

			$scope.current_grid_movimientos = 1
			$scope.data_limit_movimientos = 5
			$scope.max_size_movimientos = 5
			$scope.filter_data_movimientos = $scope.movimientos.length

			$('#modalReporteEntradaSalidas').modal('hide')

		})
	}

	$scope.reporteMantenimiento = function(){

		$scope.reporte_mantenimiento = {}

		$scope.modalMed_template_url = "views/modals/reportes/reporte_mantenimiento.html"

		/* Mostrar modal */
		$('#modalMed').modal('show')

		$('#modalMed').on('shown.bs.modal', function (e) {

  			$(".datepicker").datepicker()

		})
	}

	$scope.generarReporteMantenimiento = function(){

		$http({

			method: 'POST',
			url: 'routes/reportes/reporte_mantenimiento.php',
			data: $scope.reporte_mantenimiento,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.reporte_mantenimiento = response.data[0]

			$scope.reporte_m = {}
			$scope.reporte_m.FECHA_INICIO = response.data[1]
			$scope.reporte_m.FECHA_FIN = response.data[2]

			$scope.reporte_mantenimiento_ = true
			$scope.reporte_generado_e_s = false
			$scope.reporte_generado = false
			$scope.reporte_combustible_anual = false
			$scope.estado_reporte_rendimiento = false
			$scope.estado_reporte_vales = false
			$scope.no_reporte = 3

			$('#modalMed').modal('hide')

		})
	}

	$scope.modalReporteRendimiento = function(){

		$scope.modalMed_template_url = "views/modals/reportes/reporte_individual_rendimiento.html"

		$scope.reporte_rendimiento = {}

		$('#modalMed').modal('show')

		$('#modalMed').on('shown.bs.modal', function (e) {

  			$('.month-picker').datetimepicker({
	            viewMode: 'years',
	            format: 'YYYY-MM',
	            locale: 'es'
        	})

		})
	}

	$scope.generarReporteRendimiento = function(){

		$scope.reporte_rendimiento.FECHA_INICIO = $('#fecha_reporte_rendimiento_inicio').val()
		$scope.reporte_rendimiento.FECHA_FIN = $('#fecha_reporte_rendimiento_fin').val()

		$scope.reporte_rendimiento.INVENTARIOID = $scope.vehiculo.INVENTARIOID

		$http({

			method: 'POST',
			url: 'routes/reportes/reporte_individual_rendimiento.php',
			data: $scope.reporte_rendimiento,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)
			$scope.reporte_generado_e_s = false
			$scope.reporte_generado = false
			$scope.reporte_mantenimiento_ = false
			$scope.reporte_combustible_anual = false
			$scope.estado_reporte_rendimiento = true
			$scope.estado_reporte_vales = false
			$scope.mes_inicio = response.data[3]
			$scope.mes_fin = response.data[4]

			$scope.no_reporte = 4

			$scope.meses = response.data[0]

			/* Reset Canvas */
			$('#grafica_rendimiento_mensual').remove()
			$('#graph-container_rendimiento_mensual').append('<canvas id="grafica_rendimiento_mensual"></canvas>')

			var ctx = document.getElementById("grafica_rendimiento_mensual").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: response.data[1],
			        datasets: [{
						label: 'Kilometros por galón',
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderColor: 'rgba(54, 162, 235, 1)',
						data: response.data[2],
						fill: false,
						lineTension: 0
					}]
			    },
			    options: {
			    	legend: {
			    		labels: {
			    			fontColor: 'black',
			    			fontSize: 13
			    		}
			    	},
			    	scales: {
			    		xAxes: [{
			    			ticks: {
			    				fontSize: 13,
			    				fontColor: 'black',
			    				fontFamily: 'Arial',
			    				fontStyle: 'bold'
			    			}
			    		}]
			    	}
			    }
			});

			Chart.plugins.register({
				afterDatasetsDraw: function(chart) {
					var ctx = myChart.ctx;

					chart.data.datasets.forEach(function(dataset, i) {
						var meta = chart.getDatasetMeta(i);
						if (!meta.hidden) {
							meta.data.forEach(function(element, index) {
								// Draw the text in black, with the specified font
								ctx.fillStyle = 'rgb(0, 0, 0)';

								var fontSize = 24;
								var fontStyle = 'normal';
								var fontFamily = 'Helvetica Neue';
								ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

								// Just naively convert to string for now
								var dataString = dataset.data[index].toString();

								// Make sure alignment settings are correct
								ctx.textAlign = 'center';
								ctx.textBaseline = 'middle';

								var padding = 5;
								var position = element.tooltipPosition();
								ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
							});
						}
					});
				}
			});

			$('#modalMed').modal('hide')

		})
	}

	$scope.reporteVales = function(){

		$scope.modalMed_template_url = "views/modals/reportes/reporte_individual_vales.html"

		$scope.reporte_vales = {}

		$('#modalMed').modal('show')

		$('#modalMed').on('shown.bs.modal', function (e) {

  			$('.date-picker').datetimepicker({
	            format: 'DD/MM/YYYY',
	            locale: 'es'
        	})

		})

	}

	$scope.generarReporteVales = function(){

		$scope.reporte_vales.INVENTARIOID = $scope.vehiculo.INVENTARIOID
		$scope.reporte_vales.FECHA_INICIO = $('#reporte_vales_fecha_inicio').val()
		$scope.reporte_vales.FECHA_FIN = $('#reporte_vales_fecha_fin').val()

		$http({

			method: 'POST',
			url: 'routes/reportes/reporte_vales.php',
			data: $scope.reporte_vales

		}).then(function successCallback(response){

			console.log(response.data);

			$scope.datos_reporte_vales = response.data[0]
			$scope.fecha_inicio = response.data[1]
			$scope.fecha_fin = response.data[2]

			$scope.current_grid_reporte_vales = 1
			$scope.data_limit_reporte_vales = 5
			$scope.max_size_reporte_vales = 5
			$scope.filter_data_reporte_vales = $scope.datos_reporte_vales.length

			$scope.reporte_generado_e_s = false
			$scope.reporte_generado = false
			$scope.reporte_mantenimiento_ = false
			$scope.reporte_combustible_anual = false
			$scope.estado_reporte_rendimiento = false
			$scope.estado_reporte_vales = true

			$scope.no_reporte = 5

			$('#modalMed').modal('hide')

			$('#modalMed').on('hidden.bs.modal', function () {

				window.scrollTo(0,document.body.scrollHeight);

			})

		})

		//console.log($scope.reporte_vales)

	}

 }])
