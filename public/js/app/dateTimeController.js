app.controller('dateTimeController', ['$scope', '$interval', function($scope, $interval){
	
	var tick = function(){
		$scope.clock = Date.now()
	}
	tick()
	$interval(tick, 1000)

}])