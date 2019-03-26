app.controller('detalleValeController', ['$scope', '$http', '$routeParams', '$rootScope', '$timeout', function($scope, $http, $routeParams, $rootScope, $timeout) {
	
	$scope.$root.URL_RETROCESO = '#/vales'

	$scope.$root.TITULO_IZQUIERDA = "Detalles de vale"

	$scope.$root.TITULO_DERECHA = new Date()

	$http({

		method: 'GET',
		url: 'routes/vales/obtener_vale.php',
		params: {id: $routeParams.id}

	}).then(function successCallback(response){

		$scope.vale = response.data[0]
		$scope.documentos = response.data[1]
		$scope.filter_data_documentos = $scope.documentos.length
		$scope.current_grid_documentos = 1
		$scope.max_size_documentos = 5
		$scope.data_limit_documentos = 5

	})

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

	$scope.modalNuevoDocumento = function(){

		//$scope.modalMed_template_url = "views/modals/documentos_vale/nuevo_documento.html"

		$('#modalDocumento').modal('show')
	}

	$scope.registrarDocumento = function(){

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

			$scope.documento.DIRECTORIO = response.data[0]
			$scope.documento.NOMBRE_ARCHIVO = response.data[1]
			$scope.documento.TIPO_ARCHIVO = response.data[2]
			$scope.documento.VALEID = $scope.vale.VALEID

			$http({

				method: 'POST',
				url: 'routes/documentos/registrar_documento_vale.php',
				data: $scope.documento,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				swal("Excelente!", "Se ha subido el archivo con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalDocumento').modal('hide')

					});

				$scope.documentos = response.data
				$scope.filter_data_documentos = $scope.documentos.length

			})
			

		})
	}

	$scope.modalEditarDocumento = function(id){
		
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

		var archivo = $('#editar_archivo').val()

		if (archivo == '') {

			/* No selecciono archivo */

			$scope.editar_documento.NUEVO_DIRECTORIO = ''

			$http({

				method: 'POST',
				url: 'routes/documentos/editar_documento_vale.php',
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
					url: 'routes/documentos/editar_documento_vale.php',
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
					url: 'routes/documentos/eliminar_documento_vale.php',
					params: {id: id}

				}).then(function successCallback(response){

					$scope.documentos = response.data[0]
					$scope.filter_data_documentos = $scope.documentos.length

					swal("El archivo ha sido eliminado con éxito!", {
			      		icon: "success",
			    	});

				})

		  	} 
		});
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

}])