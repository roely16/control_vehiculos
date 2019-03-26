app.controller('mailController', ['$scope', '$http', function($scope, $http) {

	$http({

		method: 'GET',
		url: 'routes/mail/enviar.php',
		params: {id: 1}

	}).then(function successCallback(response){

		console.log(response.data)

	})

}]) 