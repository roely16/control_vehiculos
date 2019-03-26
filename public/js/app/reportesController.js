app.controller('reportesController', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

	$scope.$root.URL_RETROCESO = "#/"

	$scope.$root.TITULO_IZQUIERDA = "Reportes"

	$scope.reporte_generado = 0
	$scope.tipo_reporte_vale = 1
	$scope.vale_anulado = 1

	$http({

		method:'GET',
		url: 'routes/vehiculos/obtener.php'

	}).then(function successCallback(response){

		$scope.listado_vehiculos = response.data[0]

	})

	$('.month-picker').datetimepicker({
	    viewMode: 'years',
	    format: 'YYYY-MM',
	    locale: 'es'
    })

	$('.date-picker').datetimepicker({
		format: 'DD/MM/YYYY',
	    locale: 'es'
    })

	$scope.reporte_combustible = function(){

		var fecha = $('#mes3').val()
		//console.log(fecha)
		$scope.reporte = {}
		$scope.reporte.MES = $('#mes3').val()

		$http({

			method: 'POST',
			url: 'routes/reportes/reporte_general_combustible.php',
			data: $scope.reporte,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.semanas = response.data[0]
			$scope.vehiculos = response.data[1]
			$scope.total_cuota_v = response.data[6]
			$scope.total_abastecido_v = response.data[10]
			$scope.total_sobrante_v = response.data[11]
			$scope.total_cuota = response.data[7]
			$scope.total_abastecido = response.data[8]
			$scope.total_sobrante = response.data[9]

			$scope.reporte_generado = true
			$scope.reporte_rendimiento_generado = false
			$scope.reporte_kilometraje_generado = false
			$scope.reporte_vales_generado = false

			$scope.mes = response.data[13]

			/* Reset Canvas */
			$('#graficaSemanas').remove()
			$('#graph-container').append('<canvas id="graficaSemanas"></canvas>')

			$('#graficaVehiculos').remove()
			$('#graph-container_').append('<canvas id="graficaVehiculos"></canvas>')

			var ctx = document.getElementById("graficaSemanas").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: response.data[2],
			        datasets: response.data[3]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }],
			            xAxes: [{
			                ticks: {
			                    fontSize: 9
			                }
			            }]

			        }
			    }
			});

			var ctx_ = document.getElementById("graficaVehiculos").getContext('2d');
			var myChart_ = new Chart(ctx_, {
			    type: 'bar',
			    data: {
			        labels: response.data[4],
			        datasets: response.data[5]
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

			/* Cerrar modal */
			$('#modalReporteCombustible').modal('hide')

		})
	}

	$scope.imprimirReporteMensual = function(){

	  	var doc = new jsPDF('l', 'pt');

	  	var encabezado = 'data:image/jpeg;base64,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+hJf/wAGkNH9v+K/+hJf/wAGkNdVRQByv9v+K/8AoSX/APBpDR/b/iv/AKEl/wDwaQ11VFAHK/2/4r/6El//AAaQ0f2/4r/6El//AAaQ11VFAHK/2/4r/wChJf8A8GkNH9v+K/8AoSX/APBpDXVUUAcr/b/iv/oSX/8ABpDR/b/iv/oSX/8ABpDXVUUAcr/b/iv/AKEl/wDwaQ0f2/4r/wChJf8A8GkNdVRQBleG9aXxFoFrqq2723n7swuwYoVYqRkcHla1a5X4b/8AIh6f/vz/APo566qgDlPCX/If8Xf9hNf/AETHXV1ynhL/AJD/AIu/7Ca/+iY66ugAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAOV13/koPhL/cvf/Ra11Vcrrv8AyUHwl/uXv/ota6qgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDldA/wCR88X/AO/af+ia6quV0D/kfPF/+/af+ia6qgAooooAKK5KbzvFus6hpxubiz07TJRDMLeQxyzylQwO9eVQBhwOSc54q5p3h250S/jbT9RuJrKTIuYL6d5m6cMjEkg9sdCD60AamqapBpNqJ51lfe4jjjhQu7uegA9au1xdhaP46s11e8vLy1smd1tLa0uGhZQrFSzsp+ZiVPHQDHqaqaxqV/ouma/oDXcsskGjzXtlebsSJGMqFY92B6N3A55oA7+iuL0/wPZzaZa3A1bXFneFH3nUpWAYqDnBODz2qnb65qNx410bSrqc+dZXFzb3bRHbHc/6OHRivrgjI7HOOKAPQKK49IpfGl5qAnu7q002wuntEhtZmikklQ4Z2dedvPAHrk9q1dMsbvQo7mN7xrvTY498HnMWnQ8llLH7w7gnnnHQCgDbori9P0tvGlhBrmo399BDdIJLS2s7p4RDEegYqRuY9ST07cVb0zVtRtLrUdEnjbUr3T445Y5FYIZo3JChs8BxtOex470AdTRRRQAUUUUAcr8N/wDkQ9P/AN+f/wBHPXVVyvw3/wCRD0//AH5//Rz11VAHKeEv+Q/4u/7Ca/8AomOurrlPCX/If8Xf9hNf/RMddXQAUUUUAFFFch44+Iel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'
	  	doc.addImage(encabezado, 'JPEG', 220, 20, 400, 90)

	  	doc.setFontSize(12)
	  	doc.text(40, 155, 'Información por Semana')
	  	doc.text(450, 155, 'Información por Vehículo')
	  	doc.text(40, 340, 'Resumen de ' + $scope.mes)

		var fecha = new Date()
		var mes = fecha.getMonth() + 1
		doc.setFontSize(8)
		doc.text(650, 550, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())


	  	var res = doc.autoTableHtmlToJson(document.getElementById("tabla_detalle_semanal"));
	  	doc.autoTable(res.columns, res.data, {margin: {top: 160}, tableWidth: 350});

	  	var options = {
		    margin: {
		      top: 160,
		      left: 450
		    },
	    	tableWidth: 350
	  	};

	  	var vehiculos = doc.autoTableHtmlToJson(document.getElementById("tabla_detalle_vehiculo"));
	  	doc.autoTable(vehiculos.columns, vehiculos.data, options);

		/* Grafico por vehiculos */

		html2canvas(document.querySelector("#graficaVehiculos")).then(canvas => {

    		//document.body.appendChild(canvas)
    		var grafica = canvas.toDataURL('image/jpeg', 1.0)

    		doc.addImage(grafica, 'JPEG', 20, 350, 400, 200)

    		doc.save('Consumo de combustible - ' + $scope.mes +'.pdf')

		});
	}

	$scope.generar_reporte_rendimiento = function(){

		$scope.reporte_rendimiento = {}
		$scope.reporte_rendimiento.MES = $('#mes_rendimiento').val()
		$scope.reporte_rendimiento.FUENTE = $('#fuente_reporte_rendimiento').val()

		console.log($scope.reporte_rendimiento);

		$http({

			method: 'POST',
			url: 'routes/reportes/reporte_general_rendimiento.php',
			data: $scope.reporte_rendimiento,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.reporte_generado = false
			$scope.reporte_kilometraje_generado = false
			$scope.reporte_vales_generado = false
			$scope.reporte_rendimiento_generado = true

			$scope.vehiculos = response.data[0]
			$scope.mes = response.data[1]

			/* Reset Canvas */
			$('#graficaRendimiento').remove()
			$('#graph-container_rendimiento').append('<canvas id="graficaRendimiento"></canvas>')

			/* Generar Gráfica */
			var ctx = document.getElementById("graficaRendimiento").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: response.data[2],
			        datasets: [{
						label: 'Km por galón',
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderColor: 'rgba(54, 162, 235, 1)',
						data: response.data[3],
						fill: false,
						lineTension: 0
					}]
			    },
			    options: {
			    	legend: {
			    		labels: {
			    			fontColor: 'black',
			    			fontSize: 20
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

			$('#modalReporteRendimiento').modal('hide')

		})
	}

	$scope.imprimirReporteRendimiento = function(){

		var doc = new jsPDF('p', 'pt');

		doc.setFontSize(18)
	  	doc.text(45, 50, 'Reporte de Rendimiento')
		if ($scope.reporte_rendimiento.FUENTE == 1) {

			doc.setFontSize(14)
		  	doc.text(45, 70, 'Fuente: Historial de Entradas y Salidas')

		}else{

			doc.setFontSize(14)
		  	doc.text(45, 70, 'Fuente: Registro de Vales')

		}

	  	doc.setFontSize(12)
	  	doc.text(45, 90, $scope.mes)

		var fecha = new Date()
		var mes = fecha.getMonth() + 1
		doc.setFontSize(8)
		doc.text(450, 820, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())

		var res = doc.autoTableHtmlToJson(document.getElementById("detalle_mensual_rendimiento"));
	  	doc.autoTable(res.columns, res.data, {margin: {top: 120}, styles: { columnWidth: 'auto', halign: 'right' }});

	  	html2canvas(document.querySelector("#graficaRendimiento")).then(canvas => {

    		//document.body.appendChild(canvas)
    		var grafica = canvas.toDataURL('image/jpeg', 1.0)

    		doc.addImage(grafica, 'JPEG', 45, 450, 500, 250)

    		//doc.save('Consumo de combustible - ' + $scope.mes +'.pdf')

			doc.save('Reporte de Rendimiento.pdf')

		});
	}

	$scope.reporteKilometraje = function(){

		$http({

			method: 'GET',
			url: 'routes/reportes/reporte_general_kilometraje.php'

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.reporte_generado = false
			$scope.reporte_rendimiento_generado = false
			$scope.reporte_kilometraje_generado = true
			$scope.reporte_vales_generado = false

			$scope.reporte_kilometraje = response.data[0]

		})
	}

	$scope.imprimirReporteKilometraje = function(){

		var doc = new jsPDF('l', 'pt');

		var encabezado = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAC+BNIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDsb6PUdX8W3NjDetAkYLZXHt6iry+ENTA/5Dk2foP/AImm6X/yP+of7ldoME1oZnHf8IjqJ/5j1xn6L/8AE0v/AAh+pdtfuR+C/wDxNdeAM0/HFAHFnwhqvbxBdfkn/wATSHwjrH/Qx3H/AHyv/wATXaEU0gUgOMHhTWl6eIpz9VX/AOJpf+EX1v8A6D8v5L/8TXY4oxQBxx8O67/0HJPyX/4mm/8ACPa8OBrsmP8AdX/4muyIFMIFMDj/AOwNeHTXXP8AwFf/AImj+wdf7auv5f8A1q63AzTsAUgZyB0LxB/0FwPwH/xNH9heIP8AoMgfQD/4muubrSDrQn3Ecl/YPiL/AKDjf98r/wDE00+HvELc/wBvMP8AgK//ABNdjgGjAFCA44eHfEQP/Iec/wDAV/8Aiad/wj3iL/oOP/3yv/xNdfgUoqrDORGg+IRwdaf/AL5X/wCJpf7E8QqPk1kk/wC0ox/6DXXYowKVgOSGleJl/wCYpEfw/wDrUv8AZfib/oJRfl/9auspcCnYDkv7O8UL93UYCf8AaHH8qPsPiv8A5/7T8j/hXW4FNIosByv2HxT/AM/9r+R/woNj4q/h1C0H4H/Cur2ijAosByQsPFgOf7RtP++T/hUhtPFRH/H9afkf8K6nAowKLAcmLTxbn/j8tfyP+FL9j8Xf8/lr+R/wrrFApcCiwHJ/Y/Ff/P7afkf8KRrTxWCP9LtT+B/wrrtoprAUWA5QQeKwP+Pm1/I/4Uvk+LP+fi1/L/61dTgUuBRYDlfL8WL/AMtbNvrmjb4tHIey/WupIFGBRYDl/N8Xr2sT+dIZvFxOdll+tdQQKAoxRYDlxL4uzzHZ4/Gned4r/wCedp+tdPtFG0UWA5cyeKic7bUH0o87xUOq2xFdMVGaUqMUgOYM/ij/AJ5W/wCdZLeIPEh1xdLW3tvMK7jyenPPX2ruyoArjBgfEpf+vb/4ugC55niqMELDa9eMk/404XPiwdYLP9a6ZsYz9KMAigDmRd+K8/8AHtZ/mf8AGl+2eK8cW1n+Z/xrpdoxTdtAHNm88Wf8+1n+Z/xpv23xR/z423/fX/166bbS4HpQBzAv/FC/8uFv+Df/AF6X+0fE/wDz4Qfn/wDXrptoPal2CgDmTqPif/oGwf8AfX/16adR8TjrpcZ/3WH/AMVXUcelL24FOwHKf2p4kzj+yh/30P8A4qpBqXiRemlq3/Ah/wDFV0wQntRsAosBzLav4lz82kKP+BD/AOKpv9r+IgedJX/vof8AxVdTjPYUm3noKLAcz/bXiD/oFL/30P8A4qmNrmvA/wDIJH4Ef411BU+goAAHOAaQHLHXde/6BP6j/GkGu6+emk/qv/xVdVhTwMH8KMbf4BQBy39ua/8A9Ac/99L/APFUo13X8/8AIHb8GX/4qunOCfuCjj+4KAOZ/t7X/wDoDP8A99L/APFUf294hzxojn/gSf8AxVdLn/YFOAyegp2A5j+3fEX/AEBH/wC+k/8AiqP+Eg14fe0Z/wDvpf8A4qupIwvCg0w47oKQHLnxBref+QO35r/8VSf8JBrQ66O35j/4quowntRtQ+n5UAcyPEGsn/mEN+Y/+Kpf7c17/oE/+PL/APFV0vyD0/Kl4/uD8qAOZ/tzX+2kZ/4Ev/xVH9ueIf8AoD/+PL/8VXTYB/hAo2j0FFgOY/tnxJ/0B/8Ax5f/AIqnrrPiMA50f/x5f/iq6UfQUvHcCnYDmDrfiMf8wbj/AHl/+KpDr2vn/mDn/vpf/iq6Y7fSkyP7ooA5ldd1/vo5H/Al/wDiqd/buvAc6R+o/wDiq6TI9AKTIPcUgOZ/t/Xc/wDIJ/Uf/FU4eIdaH3tIOfqP/iq6TC+o/KlCpjnH5UDOa/4SHWf+gQ35j/4qk/4SLWv+gQ/5r/8AFV05CD0/KmEp7flQFzmj4k1r/oCSH33L/wDFUg8R63n/AJAMp9gyf/FV042EdvypRsB6igDmP+Ek1z/oXp/++0/+KpD4k1jvoMwP+8n/AMVXVZX1FMIUnt+VAjlm8S6vj/kBzD6sv/xVKviTV/8AoDSfmv8A8VXTYXsF/Knqvsv5UAcx/wAJLrA/5hEn5r/8VS/8JJrJ6aRJ+a//ABVdTtB7L+VLjHZfyp2A5X/hIta/6BEn5r/8VQPEeuHpo7/mv/xVdV/3z+VNCIDnj8qLAcwfEOvdtFc/8CX/AOKo/wCEg8Qf9AOT/vpP/iq6glewBoBH9wUWA5f+3/EX/QFf/vpP/iqDr/iDvorfiy//ABVdRs9hRtA6qDRYDlv+Eg1//oCn/vpf/iqX+3vEH/QGH/fQ/wDiq6jap/gFGF/uCiwXOYGueIT00gD/AIEP/iqP7b8Rf9Akf99D/wCKrqAB/cFKQMfcFFh3OV/tvxF/0B//AB5f/iqT+2/EHfRz+DL/APFV1OwegpRxwFBosFzlv7a8Q9tGP/fS/wDxVH9s+I/+gKf++l/+Krq+o5QYpuF9KLCucwNb8RAc6GT/AMDX/wCKpDrviDvohH1Zf/iq6jHoOKXaO6iiwHK/29r4/wCYOP8Avof/ABVH9v6530c/gy//ABVdQyr/AHBSYXHYfhSA5j/hINb/AOgOR+K//FUf8JBrf/QIP5j/AOKrpsKDzj8qcNnt+VAHKnxBrf8A0B2/Nf8A4qkHiHXFP/IGb8Cv/wAVXVYX2/Kj5PQflQBy/wDwkmu/9AZ/zX/4ql/4SLX/APoAyf8AfSf/ABVdR8noPypMj+4KAOXPiDxAemhOPqy//FUDXvEP/QDb/vpf/iq6kY/uCnjH9wUWA5H+3fEH/QGH/fQ/+KpRruv99HH/AH0P/iq6s7fUflQACDgA0NAcp/b+u/8AQIH/AH0P/iqU69rp6aT+o/8Aiq6cqM/cFO2qB2pJAcmde14Af8Sgk57Ef/FVRbxzqiaounnSj57LkJkZx/31713SsgGMA8+lcLcID8S7cgj/AFLcf980x3NBfEWvn/mCv/30v/xVOPiHXs/8gKQ/8CT/AOKrpwpUfcFIeeqCgRy//CRa920GQH/eT/4qg+I9fA50R/8AvpP/AIquo4/uClAU9UFAHML4h1srltHcH6r/APFUHxHrKjP9kP8Amv8A8VXUYQDGAPwppCngbc/Si4HL/wDCTaweukv+a/40f8JNq3/QJf8ANf8AGun2ey/lRtHov5UgOZ/4SbVsf8gl/wDx3/Gj/hJdX/6BL/mv+NdOAP7q/lS8f3V/KmByh8Sax/Do0hP1X/4qkHiXXM86FKR7Mn/xVdVtQHJC/lRlDwMflQBzH/CS6328Pz/99p/8VR/wkuvf9AGT/vpP/iq6pdvt+VO2p6j8qAOUHiTXe+huPqy//FUf8JJrn/QFb/vpf/iq6pgg9PypPk9B+VAHLjxDrZ/5hJ/Mf/FUHxBr3bSD+a//ABVdRhB6flSEqfT8qdgOX/t/Xz/zCP1X/wCKpP7c8Rf9Af8A8eX/AOKrqhtx2pMj+4KTA5b+2/EJ66Mf++l/+KoOt+IAP+QMf++l/wDiq6nAP8IFN2jPQUAcwuu+If8AoCN/30v/AMVTzrviD/oDEf8AAl/+Krp1QegpWAB+6DSHc5X+3dfzzpHH1X/4qlbXde7aR+o/+Krpjj+6BSnbxyKErAcodc1/dn+yP1H/AMVUg17Xf+gV+o/xrp/l9RQFXPUflTA5n+3te/6BP6j/ABqte+KdYsbc3E+mMkasAzZXjJA9a7EhQOo/Kud8Z7P+EZuflHVOf+BCgLmhbau9xawzfZz+8RX/ADGfWiqemAf2TZ8/8sE/9BFFAXKGm4Pj/Ux6RjFdktcXpRz8QtVHpGtdqB8tAgGM0ucdKbzmgnHWgBcmm5NLkU2gGOXvSmmZwcDNIzEZ9utF0AE03qaUg0zODzRZjFYADgc03JYYzhqQ5PSua8WeJo/D9sSrAzMOBTjq7B0uzeuLyG1AM7oo9zSQahaXL7YJUcjnrXz/AKx4mvdXYtO7BT0Aas+y1q80+XzLaRt3u1dH1dvoK8d7n0yGwctwKdnJrzrwV45/tMpZXx/enOOpr0LBB68VhUi4vUaV9iRsAUoxioi2fWnA8UxOw/rRimbsAU7kEZFK6AXAo6UZFJ70AKTQelIOtHekA4A460hB70vNAPrQA3FLilyKKAFGKXim0c0AKxweKCAQKRjk0uRigBMCilpDxQAox3pCBTSeeKUUANpw6UYpaAClpKWgBpHNLxincYqPBz7UgBhxXFqufiWM9Ps3/wAXXat0rjMj/hZIA6/Zs/q9AHZsq7enpShQBTe35U7tQA3FAFP4ooATApDS0hoASijFFADuKTANJg0oB70wFHHSg80UmaAEI9KTbzTqDnFACbF9P1pCNvAoyaKQDcnNKVJ6mjoc0u6gBACBijmnZooATmkxTqSmAZI6U0gseacCB1pQMmkwIsc4p/3elLt+Y0pxigBh59KMmlyKMUAIc96cqg0hzSggdaaAbtxQBSnNKuaAE2ikpSTRxQA3mjJpT1oApAHNKCcUuKOlACEnFNx9KfkUlACBRjpQRgcU7IpcUAMHvQT6UrD0pMUAN5NLgincClGDQA0ZzTiKMYNKSMUwG4peTS0oFACYFJz2pxpQKAG80hzTsUoFADRmnYo4p3bNADelIeRTjSUAM20oGKfxRigBtFOxRigBuKSn4pMUAMPNLnAxSnijGRSAapycGn4HpTdpHSjDUAKSf8imksf/ANVO7UnSgBvzU6jNFACgUEkd6BxSHNNAJR9KXFAoAbinZOKKP4aQCIeCK4e7+X4nwj0i4/Su4XofU9K4e85+KEOe8Rx/47QB3AJIpvI6UqjijFACZNGadijAoAAeKaSaXik70AFFLRQAgoNO4pDQAgJPBpSABwKaOtP60ANyRT8nFJinnpQA0HPWg0hIFKCKAAkmkwPSiimAUGkyKUUmA1ulIo9aeSKTIoAOlOB45ptOA4oADg0mKdiigBnen9BSY5zS5GMUADdK53xp/wAivcfVP/QhXRN0rnfGf/IsXP1T/wBCFAEumRr/AGTZ8f8ALBP/AEEUU/S/+QTZf9cE/wDQRRQBkaTz8Q9W/wCua12ozjFcXpH/ACUTWP8AcWu0HSgBaRhxS0jdKEA3pTm6ZFNPSsHxR4lj8PWBlwrMegNVZsenU2JLlIlZnkCBQTzVCDXdPup0hjuA0rnBFeH61421TWOA7RpzgA9jWRp2py6bqUeoRnlOoFarD6XYm+x9MbsimHrXmcPxahWH57UlvUg00/FiFgSIApxwDmp9hLqCuz0x5AnXpXkPxNvIZtSSKNyzc8flVC++Jep3Vu6wrsJ4yCawLZbrVL37VcOSfek+WjHme5rTpSqSUegtrozy24aQjPb6U9tCARsEZxW7FHJIQkak49KJFaJwpzu7+1easVXlPmT0PoI5dQ5LdTM8IqLTxXA0r7Y14P5V75G0cnzI+5ScivnjVLdxmaIlWBzkVpaT8QNU0qBIipmQH+MmvRpy9srtnhYjDypVLI953YO3FKSAK8vtvivhB9otlyewzUrfFi12n/Rj+RoVOS0Zz2PQLnUbSyAa5mCA9BU8N5FcR7opA6mvnvxP4mm8Q6hJKmVhONqntgYp+k+LdS0hoxHM7Ip5XPFaex0uK9j6IBBFJnnFcj4T8ZR+IrdopAkU69AOprrM5Y8Y9qxaadmO9xwpc0g64pcVTVhC5JoINN3c0uSe9R1GH1p1AA70lVYBaKKQmiwDttBGKTfRuzRYAoPNGabQAYxR3oo70AOoozijOaACiimnNAD6Q9KQE96UnipARulcWP8Akpf/AG6D+b12Ttha42M5+JQz/wA+v/xdAHaZwB9BS546UjD5R+FPUjHNADaKD1pCcUABzSZoyfWkyKAFopM+lJmgCSkJxSbqTINMBd1FJkUuRQAo6Up6U3NGaAEopN1GaQC0cUmaM0ALRSUZ96AFopuaUGgBwGaM7aM4pM5HNAC9aCM0lFABtoozSUALTTTqYxoAXmjOKYrE96cTQA7rQOtNzSZO7rQA7vSikbqKXPFAC0hpM0ZoAWikzS5oATvUg6VHmlDUAKaSgmgdKAENOWmMacpoAU9aKMijIpgFPptGaAFbtTlpmaepFACUUUhoAU9KQt8gpQRjmm8UAOzkCikooAdRnFJSGkA7NFNzRmmgHUU3NGaABqTdig0cYpABOelJg0A4NLu96AEzSE5oyM0mQKAHClHWkDUm6gB/akNJuozQAuc0uMUzNKGoQCmg/cppNJu4pgPTqPrXDXf/ACVC3/64t/7LXcRHJH1/pXEXeP8AhZsB/wCmLf8AstJgduvSikU/LSb8dqAHUGmbjS5NAAabnJxTwfbNN43DAoAUZpc1VvNSsrFgLicRk/3jUK63pkkyxR3sDO/TmgC+WFG4UKocDaQw7kH+VZmuX6afZPsljWbHyB2HNAGiGBNPyAKwPD9+JrUCe+imnkIZgGyUJ6gc9v6VvHG4bcGMd24OaAF3Cn7gRWZcaxpttKYpr2COQdVLio18R6MSSuowD2dxQBqnFMLgVDBOtzEJYpFdG6FWBFNW9tpLh7ZHRpo1yy9+3+NAFjdSg1GMHIzhx1B6Vnza9pds7R3F0qFT82D0PtQBpkijdUNtd215B5tu6yR9iDzUvOVBXCnuKAFyKXIqheapZWD7bi4jjHXJPaltNWsNRcpaTpNgdVNAF0nPSlUkDBpoAQ5JI9qeSCaAFzS00YzS55oAd2ptLnimk0AKTxXPeMz/AMUxc/8AAP8A0IV0BIxWB4zx/wAIvccf3P8A0IUAT6Wf+JRZf9cE/wDQRRTNLb/iU2X/AFwT/wBBFFAGbpAx8QtX90Wu1A4ritG+bx7qx/2FrtADigBaQ0tI3FADHOBXm/xU0+WTTI50b5QRkZ5716O4yKo6vp8ep6fLDKuSR8oq4N8wpK6PmV2IAIOABxVmzsPtcgSNx83JDGtW98L6nHqctqlqxAJ21mPFdaVclJYysi9jXZVc+X3QouDdpk7aNcjALDmkbRZgQSVJA71v2t19ptlcMKlZjnB5yK8apjaylZn0EMBQlG8TFs9CMk6LI4AY8AV39t4FaKzRkZMsobqaw9OWP7fDvOMHNd7pOtteam1oigxRoBmslUdd8stiatL6u04GHpFgkF28MigyDj9KL6ysbOaWS6Iy+doXrXR6lpqyagk8LbXA5qjqvhtda2OSVZO4I5qJ0be7HYypYpKd5nAXkULyMqDKHpWTc6PGzFkYg46dq6W+0Sew3kAlVPWs8twOO1ZxqTpPRnounSxHvI5l9InLZLLx05pBpNwwIBrpSoI9KjlkEERYsK7I42rJWja5zPLqMbyd7HNS6ZJbwlpXX8DzVNMKOGJJPFXr27e6ndVG4HGMfSl/sfUIhGHtiA5wDXr0ufkTnueDiFTU2qZ1Hw5s55/EQkVyEjHzAHryK9uOQ/zdTzXGeAdDbS9IMsi7Zn55rtCc7i3U1hVd5ERStqKAeoIpRknGQPrXNeJvEg8OWySMAxJxg5rC0/4n293eRQyxgBjjoanlb1Gj0IYzThycA4+tQRXCTqJE+643L9DUhGRUuy3AXPzEAilDZOM1yvinxhb+HfLj2Au3qDWDpvxMS+vI4fJC7jjoa0VOTVw0PSOTS4x1qJZAwVgeozUmciovYVmP4ppI7Cjdmg4pXQBmik3UmcUroNeg/FJ3pu+gt8px1ouFmK3PSmFxGpLsFUdz0pVY7TxzXnHxH1bUrVFt4BiFh973qormdkF0tz0WK4imBMcisB6GphwM14z8PdTvzrKW8jFo2J3V7IDlRTnBxdhpp7DjjNBxikP3qWs2A1lytcZEP+Ll49LbH/oddq3I4rjYhj4lZ/6dv/i6AO0PKimtnFGcgj6UjA4oAUdBSsOKbnAFAbNABtNIUIGcUpfFVTfWMcrK9xGCB/eoAslSO1JjFQwXttcDMEqvg84PSpnPHFAAMMODRUctxDB/rZkWmrd2kv3bhSe2KLgTYoAJ7imkqR149ajE0BPlrJ89FwJQckjBFKQRQOev51E80McgXzQGJ4HvRcB/4UEgHFRPdxg4eZBTBc24H/Hwn50mBY3D1oyPUVAt1AWAEyMfSpPOjj/1zquelUA8g+opuTnGDTDcQg7vPT86UXCucCRWHtSAeTihck8Umc0m5FOS+KAJSCBTRnFNEyMMK2TTwQaAFyABzS1HviXK5+Y0/cQgUj3oAM4oHNHWlUBRnNACE9qayn1FNaaJSd0gX61Gbu3/AOe6fnQA4Ag4pS2PU/SkWWNhmJt1BlERDswQd80APxkZzTAwDYzk+1MN3AW3GdMH3pPPhXlZVJoAmzk06o0fdzkH6U9uRgnHvQApBApASexoEiyfIjhiKkJLrgcY60ARg5z2o/Gk3RuwAf5h2pjOqtjNAEmCe9GD61H5i461IjAjNAByOtIWJ4FDGlTIGSOKAEGSduRml5Xtn6UxpYA33sGnLID91s0AO5PODRnHWkLsvLHAponiJwrZNFwJsHGaCMDqKaWwuaYGiPSTmmgHknPQ05TUZYKMluKjE0BPzSYqtALAyaAfU1H5sQ/jpfOiH8Y/GpEKTz94Uu4etRmeL++tAuIicealAyXNIWxTHkRP+WyCmfaou8yUATZPoaM0xZUb7j7qcWOeRih2AdmgEk9DUZcAelOWVSMbhSAfg0DrTd3bOaXNFwFNJg00so70oYY3buKYAVam4NDToRguBTd8Z/5aikA+kP0oz6HIpCW7UAPUZoCk1FvX+J8UeaOzUASN8tIDmgc85zTS+KQC7vY0ZPoRUSyqf+WgqUOnds1WgDgMjrRxigAHkUlK4CpwQa4e7OfiZbH/AKYt/wCy13Arhrn/AJKVbf8AXFv/AGWmB3A4WkGaaG4pVPFIB9IeKM0HmgBu/BxWbrerjSLITlSzOwRMDuSB/WtQqMKfeuV8bg/2ba/9fCf+hrQBNa6E2qZn1dhIrDciqT/9all8F6YYmeBDHKOQdx4P51v22XtICo6IM/lT5D85PbvQBzM+r3Hh3S1a9AcBhHH5ZyT1xnOPSm2/hxdZJvdVdm3DKornAH6VT+IpDaZalen2hM/ka6y0INnbhemwZoAwZfCtvYqlzpX7udecOxwfr1q7oOutqkM0csQE1u+x+ODwOn51sOQI2rkPBp/0nVv+u/8ARaAKVtpFnq/jbUlvIgyRjgA+pb/CugPg/QnUo1mp44PIIrP0Uj/hNtW/4B/N66s8NQBx07y+DU8/zDLZM6r5Y5K844z9areHbn7X481KRc7Wt1ZQT0yENWPiL/yAU/67J/6EKzPB2f8AhNL3/r1T/wBBjoA6LW9WkbUk0W1JSeRd3mHjjnv+BqW38K6e8KG8USztyxYnFY10CvxNt2b7vlf/ABVdZqX2z7EWsQhkLYG78fegDOGjXOl6pH/Z8i/ZmGTGWOO9S+Itc/sTThIwYtK4jTAHBOa5/UNT8VabZPPJHFhDg/Tv/FUHi2d77w3pFw/3pJI3I/CgDbsfD0VzE0mqYuGc527jgClufDUVmgn0b/RZkO7Zk7Wx0BrctsfZYiO6inyf6tuccUAY2ja82o2VyZI2M1s2xwAOTx0/OtOwu2voPNMbx/MVw4weK5vwXlJdT77rj/2Va7A8OenBxxQAEEDHel7UH1pM0AKAcUhBHNGaQnIoACeKxPGA3+F7hR1wv/oQraPSsLxa3/FO3A9h/wChCgCxpUZOj2R4/wCPeP8A9BFFP0g/8SWx/wCveP8A9BFFAGRof/I+at9K7btXEaEd3jvVz6D+tdv2oASiignFAEbCjbxTi3tTRwKdgK0lrEXMnkoX/vFRn868u+J+jpbqt/GqgkjIAx2/+tXrHJPp9a434jQCTwy77dxDdvoaunNr4mJU4s8e0afypjGxyp6A9K6H+JSPSuStGxdR/Wuq8wbRx1FcOY04xndH0WTzlUp6lizdUuQzDIBrrtCv7eDVSVjAV1xkACuK5A4PNXLXUWiVVwNwPWuCnUUXc7cRRc42sdhqvia1huAkZJZPvc1e0rxLbX0TEDb5a5rzy7j/AHzThlbzD09KtfalsrQJEPncfMa1WIV9TjllylBW3Ohv7pJBcxu2VkHyknpXHkBfl67eM1blkd7Fd7gsDnIqjg5PvzWVSpFvc7aNF0lZDgwDcjIrK1uURIAP4q0QQHG7getc/rEwa5Mbche9dOBpKdVO5zZjUdOgzX8CaJ/a2tgsoKRjJBGR1Fe2tpVnJhWtoSE6ZjHFec/CuMDzpV67Tz+Ir1MKRjI+pr2KjfNa+x8vCCtzMI40jQIoAA7AUvc5pcADijqDWOrZT8jzX4qvm0iwMncP5V5Ok3kskik7geK9W+KYItoiO7f0rze00qS+tHlt1yU5NdtNLlMndM9o8B6yup6JDFndLEihixyen/1q6S7u1tbSWZj9znFeG+B9afRtZMbvtikIVvY55rsfiF4kSGzjtLV90sgBOO4rCVLmnZFra5wHijWW1bV5pXdmVWO0Fsgc9qh8Nkf23CTyM96Zp+kzahbPcquVj5k56f55p+gADXIUHZjXXzWhyozbaZ7fq/iO08PWEE10pOemPwqppXj7TdVvobSNGBkOeorm/iYf+JbaA/dwf6Vx/geMHxRbHP0/Suf2ScLlObTPdru8Sws3uZQcKMkVyD/EzTFuNpBznGMiuj8QHdol3uwV2HivniVQdRcYH+sP86mnSTKe2p9I2+pQXNh9tQHZgmuYn+I+kW9w0TK5Ktt+9V7RSy+FCMjGw/yrwjU2L6lfDp+/bH5miFNSegnJo96uPGWkWdmtxLNhTzt4J/nWcnxM0F5gI5W54+YD/GvKbDQ9V1xQ8QkKKMDpis7VdKvdNn2XcbopzjGOa0VGNxOo9mfR9nqdrqMKy2zhgewNYfiy90WC1K6oisCOMgcVwHwy1KaPUvsryboyDgVq/FAECPoVOeD+FQqfLU0Bq6NTwxeeG/tuzTQplYcEgZrvVOcV4T4AIPiiPIA4yMV7qgwo+lZ14vm3GlYefvUtN706sWWHY1xkZ/4uX/27f/F12Z6VxkQ/4uUT6W//AMXQB2bcDj2o7U5l+Uc9cUBeOtADQKaSAw460/HFNX75Axk9D6UAecfEXxZPpj29hYs4umY8I2CenpWdp3gbVNXso7yfV5o5JPmxk/41m+MTH/wsy2edsKHxk9PvCvYrKWOWxgMb/KFGMUDsePWdt4j8L+IkgSSW5gkcA9cYBr0TxF4g/snw4bub5JnAAAOMHB/wremmgS4RZ2j3nO3d1rz74vgf2NbMxwpcdPoaAMnS9F8SeMLT7bPqDwK3QK5Hv2xT7rwb4j0WFr211KWXYOUZ2Oa7fwMFTwzafLkgYOD7Ctq7YfZpQdpAU0COJ8C+JZdXspob2bNyhI2556CvO9Y8S6ppni66ktrufZHKw8lpCRjPpW58O8N4pv8AhcfN/wCg1V0yyivviXcwTRBo2kbdv6n5qAPTvCuvDXtKjnwVk6MCe9cB4mv72P4jw2yXUyR+aBsEhC/eHbpSg3Xg/wAWbfni06Q7ju5wenb6Cs7W72C/+JNpNDIskbyKdw6dRQB0+oeC9dv7x54dWmRHAIUSMAP1rjXsdej8SDRf7Ul38DPmN3OK90gYi1iAA4FeUTDf8WoiowPMGc/71JgaeneCNetLyK4l1WVkU5KmRj/WqfxLvNRt9YsLW3vGi34XCMVyc47V6qsf7vgZfdwK8f8Aiw7/ANu2QjVftGcoPfIpsC1D4K8ST2yOdXuBvAON7H+tYtxqGu+DdbVLq6nuIs8hmP071JLrfjq309JBAVgUALjHT86g0Sxk8X6ok2p6mB8wDQnr6+lID1JvEcQ8NR6mxEZdMjPrXA6c3ivxmpmhvGt4R8oZGIz37fWt34h6fHpvghYIMiNCAMn2NaHw0i/4pFMAff6j8KYHNTeEvGOnKbmPV7iXZ/D5r81teB/Fdzqc09nqThbiPIAz14rvJQg3gEkY6V4x4dyfihcbBheePwoA0LnV9S/4WhDa/aZRb+cg8sSHaRu9OlesryiknmvHLxN/xfjByP8ASU7/AO3XsKJ8gwcY45oAlI44pCAACDmghlHTP400gAAigDyn4h3moP4mtbG0upLcSjGFcgdfanL4E8RuiMNXm+Zc/wCsb/Go/HJD+PdN45DDH516nED9kgyv8A5zQB5TBqeueFNYtrLULgvauwzI7E+3et34j6i6+GYrq1v2j3kbWjOM8HuDWf8AFYk29mrBcbh069RVLxYSnw6sFHcDH5GkBDpfg/XtV06K8j1u42t2LN/jV9fAfiTzkLa7cBc54Zv8awdLvPG66bGthCWgxwfl/wAavx3/AI+LoGt3C55OV/xoA9W0+B7a1jhlkEjouC2MZqPVpHj0ydojhxGxU++Kfp/2hrGFrribZ81V9aH/ABJ7k548pun0pgcL8M9UvL69vxd3ErlAcF3JA+YV0PirxiukA21nia7lLKAh6dh/OvKPD+p31nNd2thE7vOSm4duQf6VZNlqnh7xNbX2oYMckoZmfkAZH+NID0rwjpmpsv8AaGq3UwZySsZc4FY/xI1W90+8sUtp5YlZhny3K55HpXc6fdW97ZrJbyCRWXLY7V5v8Vz/AKdpqrwNw6/UUAWfHGq3ll4W02e3uJY5ZCu4o5BPDeldp4VuJJ/DtpJOxeRkBLMck1574/Up4S0s7SR8pByP7prvPB8ePDNozsNwXA/KmBvZ4rivHHi640iKK205la8chRHx3P8A+uu0yCvHevIfFX/JSrAbV4YHJPH8VAFhPDnjO/VbxtRljEwDlQ7DbntUN1ceKvBo8+4unuIGYZMjFsdu9etQgtCDjC7Rn8q5j4iID4RuwyAoCuD/AMCFAEt1rZv/AANPqFvMvm/ZiSVPIbb2ryXw/wCMtRt9aikurmeWLftKmQkV1XhvEfwyvioLfu24/wCAmuQ0i2hHhe7uymZll44J9KQHtuta2tj4fn1AKcLCZV/ImvEtK8VaveeIIt97cJG7k7PNOMfStPVvFV9deG9Ms8qfNxG4AycfKP61S1SyitfFmnRQpsyqk/8AfNDYz07x/fXVl4UNxbXBifaPmQ4P6Vw+haD4r17To7+HV7jYx7yt712PxHUL4NYKm4FBnmvPPDureLYNKjj0y0zbg8dPU+9F2B1K+B/Gm4GTWpBz/wA93rQ1Lwn4luILKKDVXV4wRIyyNk/WsL+3/iAxLNYnAPoP8a9R8PS3lxo9vLqCBLhhkj0o1DQ8X8RWnibw35Ec2rTsZW4Jlb6VtWfhHxbeWkN1Hq0wjkjDcyN6Va+Lgzc6SQvRh/M16FoPPh+x39RCvT6Ci4Hlnja41bSZdOs01CTznQKxDkZO41ah8F+LJoI5Rqk2HUP/AKxunWq3xad11mxMEeZAqlSfXcaqf8JJ40tbNX+z/uUQYbHYD60riHXGp+JfBmqJ9suXnhB5DOT1+teu6PqSavpMd4FK+YgbHuRmvFNLhuPGurQvqN6i4bDR4IPFe36dYR6daR2tscxxjnJ6ChXA5b4geJjoGlrFHuE0+FVgcEf5xXHeHPEWqaLrsEWsXUk8V0AUDSE4z9frUHjjUzqfi5LS5dPskTDLg9OP/r1D4tl0OFLC60i7M11DgMGBwOR7CqA9xhdZI0cDhgCKk/iFc/4Uv31Hw1aXLOsku0hwvGMEjvW0s8Uj7VlViOoB6UgOL+J2pX2n6EJLOR4n343RsVPQ+lZ95q+ox/DUXy3TC44+bcd3Ud6l+LZX/hH0UPyX9PY1lX7bPhMMgHgfzWlcDN0Gx8W+IrAXcWpzKvH/AC0atb/hFPGSuP8AiaTf9/GrlfDOteKLLTVTTLYSRNgjj/69dAnibxyXGbAfp/8AFUxnpmh213aaXDBeyNJMEUM7Ek5xz1rQfaqN8wHHGaztBuLy50eGS+TZOyqWHocc1oyDhsAH5T1pgeKXmp+IdQ8XXOnWN9IBvIADnjk1qt4b8dwp5x1GRtnO3e3NUNDLf8LRuQAoPm/+zGvaFOEQD7x65oEebeE/Gl9caydO1crG6YVenzE5FUPiVrepWWo21tZXckW5gcxuVyMe1ZXidQvxMt1Rdg80Yx/vUnxQdo9YsvLHzBF/9BFAzRtfDPjeWNJv7UbDDp5rVf03wz4xttRimutRlkhB5USsRWLa+LfGiRIi2TFccEJ/9etLSfEnjG41OCK5tSISTuJXHf61OoHqg+WMbnG7uBTuoqNcnkgbiOakAwKoQL0NcLc/8lIg/wCuZ/mK7oHrXDXAz8SIB/0yJ/lTA7QUZwcUuMZ9qNmcHcORSbAXHGc0LTSGBI7etC5PTketIB5PPXpVLUrCLUoDBLjHVSR0I5FXNjN8ykHNIilclh07etAzkzql/wCG5THcwzXER4XBPSkfxhLd5htbCVJj8vz9K61x5i5kjBHbOKaYEwCIk3DoRTAxbfw695pxGpy+a0jBwjc7Tz0z9ayzqWo+Gp3iuoZJ7b+A5JP612TkheeOMEjmo3jWVFLKH29N1Ajkjrt7rsYtbaJ7ZW6ueCAfet/StLi0yHyYwGkfl3x941fjWONyViT5vvYHf2pUCLu6g9VFAHAS6hcaF4uvp/sE0yyA4K59/wDGrw8cTd9FuC56dcfyrsWiUhTKoEhP1/lSbIyCSMAd9tAHKWmmX2uXK3OqIRa7gyQtkj15HT0qLRLB7TxtfS+SVhZAqkDH93/Cuz4Kj5jio9iqcr17mgDI1fRVvm+1W523aDhxwfzrFPifULBPstxp8szRnAdf/wBVdkpAcLuAUjOaUBCc7Qfw60AcxHa3viKQXF4JILXvGScH6itW50i1u9PW0mRfJiH7rC8j0xWmWweM7fSmAjduHf1HFAHHNf6voDNHJbSXcJ5QAknH5U6O/wBR8TBbeKGbT0B/eFiQSO/NdjhQNx5OeuKMgHdtB3cdKAM+2sI9H091t4/Mk6kqOWPqal066kvLbzZYjE24jaf51dztQnlQaRl2gbeeKAH/AMNMNJknAUFj7dqMMVyBz3FACgZpwFMBx3+nvTuQPm+U9h60AOYDFc74z48NXOOvyf8AoQrf3EjpWB41Ujw1cc9Sg/8AHhQBPpTH+yLLn/lhH/6CKKZpZxpNmP8Apgn/AKCKKAKGgD/iudY/z3rt+1cR4d/5HbWh7j+Zrt+1ACUhpaKEAwmkI5pxpv8AfqrhcyNX8Q2OiKrXjhQ2duSB06/zrgPHPjKy1HSBBZSg7jnhvY0nxcZg9oF77v6VwOk6ct+XVzzj1rop0uYhy5SDTIjPqUasMDNdt/Z8BIBkAwKo6bo62LMTya6HTLSK7k8uQ4FXWw8Kj1IpY+pR0gZx0+3/AOetRnToM8S1palZxWtx5cJyByadaW0BgaWYFx2QdRWX9nUmro6VmtbqUE0pW/5a5AofSVChml4PFajajJEgVYNqdsio/wC1ZXRh5W9ccgCs1l1Nj/tSqjNNjGRt83gUn2C3J/12K1Bb29xaNLsZH9DVext1ubgQzPgE4FV/Z9N6h/atUpNptses3H+feuR8SWn2W9JT5kr0TVdOhsSqxybh6Vzuq6YuoIAOK3oYWFOXMjGtj6lVcsif4d69ZaYZFuXCLjpnHcV6lY+IdN1OVo7ScM/ZQwNeD6hof2C0D7jk+hrovhm5/t+VSTjA/rSrU9XIlSukke0g5FID96n9vwprZVSOzc1y9TQ83+KQH2aAnoG5/Kuf+HVuLiS6g3/LICB+VbvxVOLe3CevP5VmfCxCb5jgd/5V1RdoGct7HIeI9Ol0fXZ4uREJGIYcc5qjcXFxqM0Ty73lA2oMk8V6t8RfC02oBbq1TLgEkD1rlvCfgzUpdTilnTYIzuOe/anGatcWq0N/S9CTTPAl1KY3D3EZ3nHT5T/jXB6CmNfjA6bq9p8WxiDwvOqnGIyP0rxnw9tGuxEcncacHzJsU1qjuviYP+JZbfQ/0rjfA7FfFFt/n0r0L4haVPe6DFOg4jUk4/CvIba5ewuxPGxEicGim7xsVPSx9B+JZ1g8PXRP9w18+NKJb3cv98/zrc1DxNqut24tpCWUdSoxWCqGKcBm5B6YopLcJy2R73ogLeFD/uH+VeF6im7VrlR/z3OfzNe66MG/4Q9irA/I2R+FeFXpJ1S8I+ULKcA/U1NDRsU+h7n4Lt44dDj8tVDHk8Vy3xVt43S2fIVhkkAdeldf4RC/2FBtGGK5Ncf8UcBIQzcnOP0qIt85coq1zmPh6P8AipEweMH+VdN8VD8kWPf+lcx8PCreIkB5PP8AKum+KIfMZfAHIx+VbNfvCehzXw+/5GaM/wCyf6V7unK/hXhHw9Qx+KUCkEMpz+le7IPu/SscR8Q0SHrSnpTQKdjArme5YrD5M1xMTf8AFyW/69//AIuu1blK4uHj4kMPW3/+LoA7Rj8g/CjJxSsNihfoaO1ACDJpBwSTT8jFJigDz34heDZdXMdzYJ/pHJyq8549K5uz8XeINAthp7aVNM8fG45/+Jr2NlzUZtoGOTEpPqRQF7HjenSeJ/FfiGK6kSe2hjcfKS2OT+Feh+JtB/tXw/8AZpl82SEA8jPY/wCNdCsEcf8Aq0C/QYp239aA3PGdM8R+IfCcCWlzpszjHAOR/SrEnj3X9VieytNIlWaTPPP/AMTXq8lokxzIin6imrYwRsGjjQH1AoA4nwF4Yl06znur2Bo7tyc5XB6Cuc0O0uf+FmXB8ttqynnB/vV7GOFxUC20SSGQIoY9wOaAMnxRoceu6PNbbV8zGQxXJBzXiOn6Hf6V4vtbeeGRgs64cg8ANX0SQOxqE20LOGMalvXFADoAfs6D/Zryp7eYfFiJx93zB/6FXrATFRizgafzSi+Z645oAsEfu+G2sD1ryX4kxSy+KdKkSLOJBlsf7Qr1d1Yfd6VHLZwzlWlRSR3IoArW1vHc6dBBNFuTyxnivGfEOi3PhPxWl5ZW8pty24hQQOte5janyp90VFNbQzj98isvuM0Acs32bxp4WKmJzJsBZOvOMVw+keItb8FobO50yUwdVzkcfl7V7HBbxQDEKBR7DFJNZ205/exqze4oA8sf4n314hittLcSScA5P/xNW/APh26XU7jVNVgaOd8lcg+nvXoQ020jOUhjB/3RVpFQDGBQB4Z4luJtK+Isl+kEknlyq3f1zXQJ8VrrbGP7KkIIPOff/dr0mXTbSWUu8CsxOSSKa2lafxm3Qeny0AZPhPxNJ4hgmaW0kj2+/wBfaujx8o+lR29tBAMQqEHsMVIRQB4/8SJJLTxXa3McLSmPB+XtzUy/E++SJYv7NkO1QOp/wr1KWygnbMsSufUioTpdn/z7J+QoA8o26z4z1e1mvbOSOyVh1BI9fSt74iacLbwtFBbIWRCOMdODXfxwqgwqqB7ClmhhmAEqhh6EZotcDyDSviFe6Tp8doumyOFHUZ/wrQX4p3TukZ05xuOOv/1q9GOm2R/5Yp/3yKVNJsBysKZ/3RRawD7Gc3VnFOUZC65w1V9ZUto90PWJv5VfWMIMAYFDRqylXGVPUUAeVfDO0C6nfNLCG2MSCR9K7bxV4ej8S6WYZBhipKMB7Vtw2tvCT5MYUn0GKk5TqOvFFrgeX/D2a60zV7rRZS7rFnBYn2P9aZ8Vo2e+00j+8P5ivTFsoI5TKiKJW74omtILpgbiNWK9MjNFrAeY+P7eR/CGlgI7FVUnH0NVdH+JTaZp0NsdOdgnHX/61ery2sE6BGjBQdARUH9j6b/FCn/fNAHG6N8R21rWEsjpzxKR1z9Paq3j/wAPXK39vqml28k864YqATjk/WvQINMs4H3xRIp9dtW3GRggEUAeV2/xRvLWEW95pkiyomxgSf8ACqGueJtV8YWjWVpYSi2DLvxk9wfSvVn0nT5nLyQqWP8As1PDY2tvxDGq/QUAcj/Yi6T8P57eIYeS3JK46Hb0/Wub+HdgbjQdStpoVcsSAGXPp0r1eSNZE8plBVqhhsILXIhULnrgUWA8O8N6FqDeNEjlsnFvBOMeYpK43e49q1fGFm0fj6zwMdOg/wBmvX0t4o23Ko3euKiksLaecXDRqXHcijluM5P4ixs/g5hhiQvb8K4bwt4+l0HR1tfsBkwcZP1PtXtU1vHcx4mjDL2BqsNFsNv/AB7R/wDfIo2A85/4W/Iyqo0h+Dz8/wD9jXpOhamNW0yC7MDQ+YMhWOf6U2PR7BDlbaP/AL5FXo4hEm2NQijsKBHmXxXikebSyo43D+ZrvdDX/iQ2I/6Yr/IVcltbe4IMyBiOmRmnhVjXC8AdAKLAeVfEy2dtf011+78oP5mvSILOG50WCCWFCphAI2jn5RU8lnbXDh5owzLwMjNWFGxNqjjGKLAeGeJNGuvCfipbyzhcQZBIUECvTLbxBaal4WmuhIYH8g7sNyTtNdFNaW9yP36K31Gaj/syzVPLSMBD2xQB4z4X8GjxRf3lzqJnjt9x8qTBO45A/wAa6XVPhRpkNhcPbvcLMiFl+Q/Mfzr0aK3gtoikSAD2FSld6c0AeVfDd54Df6beyywuAVQOSCORjisW4vdd8E+I3M8k09u7ZBZjjHTvmvZhZ28cnm+Wu89SBTbqxs70hZolfPqKAPF9f8S6j42lhsLexKxgjc457Y9K63xLosunfDp7TqyADp7iu4g0iztm3RQIp+lWJ7aK6jKSxbl96LAeKeE/HQ0HR1tJ7ESspAz37+1b/wDwte3LgDSj/n8K73/hHNIP/LoufpR/wjmkj/l0joAdomp/2tpsN2I/LR1VtvpkZxWlKvyEgE8Hp9Khht0gjWONQqKAAB6VNnIwVyKAPB31UaB4+ur54CVEhP5Ma6k/F2B/3aWDeb2+b/61d9LoOmXDu81qpLd8UyPw5pMbbktFyPagDzHw9pl94o8XnVL23eGOMho9wPPJPt7VH8UFMGsWcgXcAQv6f/Wr2KOGOIbYoQoHpVW70myvTmeEMfegDze0+KttBbRxvp8pbHr/APWrR034nW+oX0VqtlsZj1c89fpXWf8ACOaT/wA+SVJFoOmwuJIrZEYegoA0Rhhv3YJ7U/dxTASRhRgU7HFACocmuKn/AOSmWw/6ZN/7LXaLwrVxF0f+LmR/9c/8KAO4J4U+vFcXcavrU/iO40/T3gEcQH325zk/4V2Q/rXBLqtppfji9a4dU3YBOCe7UmBrOfF5RQjW2c9Qeam0nXpmvjp+prsn7EHrUr+MtGgj+e9X2bac/wAqyUL6/wCI7e9syRBbnJYjG7n/AOtQgL/ivW7zS1tobJIvNnbAJbB7+3tUJj8Vsi7nt8gZxnmqXj24+x3OlTLA8jLOOmOeGqwPGd2ybjpc/pnaP8aUhkwXxU4Xf5Owe/8A9aobnU9ck1xbC1+z7xDlsN3y3t7VasPFE93OIWsJ0B7kD/Gorf5PHNwADzCOvXq1NbAKV8VIAMxAk9jU2l67Ol41lqMZSXsxNdIFAcA+in9K5jxtEi6JLdR8Sq64I+opiOkRgQCDkevrTZJkiUu7BVA5JqhoEjy6DaO5yzQoT/3yKy/G+7+yIwrEbpFHH1oASXV9S1G6eHRVICHHnucgUjDxXbAzSzJJGnLKM10Gm26wWMKAAbkXJH0qywDAhhxQBm6VrKatbHbjzV+8o7Vn+Jdem0xbeC3hzLOcDH4/4VuRQwwszQhUPfiuKS9j1jxpPbXTxiG2XKnOOfl/xNAG94c1l9WhmWSLDxHGa3lAGRiuCsbmPS/GjWEDobeTkEHr1/wru2cqd+Mk8CgBWICknoBXK3utX9/fmz0gDERxI1dJdfLayMRyFI4rkPAfL6kT1+1Nz/wJqALK6nqujXSf2swe2lPD54HbFamra9b6XapJGvnNKuYUB+82OB+tZXxBP/FPD181P/QxWZrH/H34aB6Ej/2SgDUL+J5Yhdo4WJuTAc5FW7HxNHJYzPcoUnhBHlk8kit5B+7T6V5nettv9bA7SLj82oA6CG48R6nG1zav9ngJ+UHOWq7o+uyXE7WWoo0F0nRifvVs6aMWFtgceUK5i9P/ABX9txwYT/WgC5quvvNcnT9OTfcqRuZT049vqKge71rRQjahN5tuSNzEn5fSqNiraV4tvri6T9xPjY3pgL/gaveNNTtP+EdnP2hZWdONvagDpLS8S+t0uIPu45rH8ZHd4ZuD/tL/AOhCpvCUh/4RmwK/daLmovGoH/CM3IHTKf8AoYoANNP/ABKrP/rgn/oIoqTSx/xKbL/rgn/oIooAz/Dhz411r/eH8zXb9q4fw3/yOut/7w/ma7jtQAlFFFADTSdUJ/vdqU0zOOPSjqJnl/xYt5WS3nUEpHu3cfSuF8MzIt66k8len5V7T4s0Ztb0WWGMDzD0zXlV94I1LRLOTUGIUJxwf8+ld1KqooymmzZVlkDsrhhnAwetXBOuk2pupE3njamcZriPDF6W1CK2mkJVuea0td1B5rzykY+VDwRU4ipyq6OdKx0M0q30K3kHf7y5zt/Goba5eBnkjGH9+lZWhajsVrT/AJ6nIz2/zitGSJopGT3qqFSM46hKRsWeoJdZjuIQeMls1LLcWVrbGW2RWJ4xkcVz+p3a6bpu0f6+Xofaqfh+681ZLOdsuRkZrJ1IxnZDumtTUnvZZlIOEU+lOs2W3Bu5OUi+YE8biO3+fWoGhZ5/L/hFUNe1ACFbKHiNeWP1/wD1VtWqKEfdJUu5rzanHq6NcwoEK8eXu3e3WqpdFBLsABWDol9HaXuGJ2N1FP8AFt21tILeBsGTniihVUlqU43d0Q+KZT9lRY23KWHQ9ODWp8ME369OQeFHXHXg1n2XhLVdW0xb2Jt4ccKT6cf0r0PwF4YOk2rXNyoW5c9B9KdSrFpo1ppxO2U/LnFKBuJLHjFKBxihuIiR61wPc6DG1jw7a65EEuFyFOelYttZ6F4OZ5TOm7+7kLWz4k1pdF00zE4JXA+uK8WWLUfFurBWlYozY64reN2tdiXZdNT0iX4j6SW8osNmeu8GtrR/FGkas222ljQgc/MK4pfhU6wYaZdx6cnj9Kz4fh9rVjqqx29wFQcnB/8ArVTjC1kJSvoz1jULGLU7GSCTBiIPPXNc3ZeBNLsrlbhY8nPoK6DT42sdL2XUhZ0Xk/hVPTPE+nalcvaRMdykjpUQckmkN2Zqz2sE0RtpBuiZcYNcvcfDrSpZDL5KrvPQKDiug1PULfSbJrqcnYveq2ieI7DXWl+wyMzIM4IpRlJbA7PcqWXgrTLSB444VG4dSoqlJ8PdKaXe0I3ZyTtFbOreJ9M0ZiLp2D9sVy7fFCwW52Hd5Z74pqU+jJaV7nZQ6fHa2BtYR8pBHFcpd+BNFQvc3QAYtuZiAK6TS9bstWjD2bk/Wud8eeILS10uWyLMJ3zg/hTXMnoW0mjodHlsPIFvZTIyrwMMOKg13wxaa/GouDyh/u5zXlngTX7fT9Rd7y4cqqnivZrG9gv7WG5tyTHIoPNOopU3cncwNK8B6dpN4lzbjDL7AVb1/wAL2mvyp9pPTjOM1NqviXTdJB86Q7h2FY9n8RNGuZvLZmD5wOP/AK9S5VHLmuUrE2i+BLLRtTa7iPKrhflx6V1hOccYqG3uI7u3SeJsq3SpgKibk9ZDshBkClzmnYoI4qAEJ+WuNtsH4kTZ7W4P5lhXYn7tcdbD/i5Fx/17J/6E1JgdowwOTkg4o7Urjr/vGk7UAJtOetLj3paKAExSc06kxQFhDzTSKeRTTQA1ST1pdgHTinnAphagAC470EgrjFJmnUAM2j0oxin4pKAEPNAA645oo7UAJk560o755pB1p+KEA3aMccUoGBS0U7AIc9jimMM9+afSYwc0WAYCR1GaUDnNK7AjFC0mAEDPQ/nSADdyPzp5pANxxQAx3VMlvlQfxVHFd21zkQ3EcjDqqsCRT2iDI8cv3TXkGoXFx4e+I2Led4rKTGQxyMkD1oA9jkQqeQdv94VUuLy0tXCz3CIT03OBTmukayMvn/Js3Zx7V5Lp89x4m+IUqSyO1lD2Bx0wO340AepS6tYQvsluokYdQXAxUY1vSc4Oo22T0/eL/jXkXiWzlvfiCbDz3jSXgYb3Nb3/AAqhTGE/tOVW653mgD0KLVLGeQRRXUDyH+FZAamF7aC5Fv8AaI1l/ubhmuO8O+Av7F1IXa38k4APDHPY+1co9zN/wtN4zK/l7+mfcUXA9lclSoOCT6VBLe20EgjlmjRycBSwGakyqoG7AV4/48u5l8e6dFFcOsZkBKjvytIZ67PdQWwQyzxpv6ZYVJzkYcOrDIx3ryf4k3MsF1pMUMrruCk4P1r0C3vRp/hxbuQkiK3DZPrt/wDrUk3cDUmuIreESTSomTjJYDFRG+tCSRdw7R33jn9a8cguNY8c67cWtvctHbxnd6ent71c1H4e65YWkksGpO7p823d6fhVCuluevqRIgZXG09CO9QiWEy7Ukjdh1AYZH4VyfgLUNYn04pqEOUiBUMe/Nc74YubhviTfxPO5jydqE8fxVFw9D1bHOM1G9xEjbGmjWQ4wpYZOTinNkYPtXj3i69uY/iHbRpcOse1cqD/ALTU7iVz18TQFyn2iIyAkFQwJ4p4Bxz19K8d8KXl1P8AEO5iad2jBk+Un/aFexbWL5HRaaGPyVypOTSADaWZgB3JNDMSpJHI5/CvLPFfiLUtQ8Uro2jyFQyjf04p3A9Ja+skzm7hH/bQf41NbzQTr+5mR/YEV5cvwy1iQsz6o/mdSNx/wrNvDr3ga7gFxcF7N2wWzk/youxns20k7Wbnso7VFLd2kJKSXMSMOzSAVzeueKv7P8JNqNqN4eP5WI74/wDr15no+m6p4yunuZtSaLzMkKGx3x6UAe3x3VpI+yKeNn9FcGpirdCxrxO50rxJ4M1aK5SVriEsM857/SvX9Jv31DTbe5kQq7plgaBF8DA6UmOeeaeelJigBCfQYoyacBS4ouA3Io3fN04pcLSYG7igBWwRwMUA8YpSPlNNWhAKwBUDuO9IFGckU+kpgRkgtjB/OlLFRgE0gHzU7uaVwEXPf9aRs+g/KlNKBmgBueKDnBwcZp2KKAEDN8uecU4saSnEUARN16mlwPQ/nQ3BFPXBoAaGJ/hX8qa2QRjGPQCnlcUnWgBpOcYGKk7U3FO7UAIB8jH6Vw1yM/EyP/rln+VdyD8rD6Vws7Z+J6j/AKYn+lAHbqvIGetcPZ6fa3njrU1uraOUbFI3oD3b1ruM4I9qpJpkUN/LeqP3sgAJ/P8AxpAYuueDdKvtO/c2MSTR/MCqDn9Kk8J6gkti9g6pDLEcFcYNdIeGIPTHNZ50q0a/S72+Sw+/t/ioA57xhn+0dJLNJ5YlzwSAeCK6wSwqNiOoX61Q1fQLTW1iF0kgMTZVlYj19/eqA8HW2GIuLjaSR/rD/jQM3vPi6GcexBrmbYqnji486TGYeGY/71TjwfbjaBPcHac/6w/41PeeFNOvLpLkNcI23YSGPPX396ANZrq3DbftEeeOrAcVyniO6OuxPpGmr5kjEEyq2QuOen4etXj4Ps94K3NwO2WY1rado9ppu7yY/wB5/E+c0wOTttH8U2cEVul7tRAF/wBWeg/GtjVtJvtQ0JYpJFadGDZx1x+NdFwRwSaQbdwBLL7gUCMPRdciuo/sk4FtcRAKVkbGcfXFac97FDE8jzIUUfwkHNVNQ8P2Woz+bOhVx90oxXd+VUI/BmnJKHMlyX6+WZGx/OgBlxr6HSrm5ltpII2UpGzHG4kduPcVh6H4It7y3F5dPMJpWLlgcZGTj+ldleaPZXdklrJGUjQ5C5PX8/arcSeVEkcYwqLt/CgDz7V/BcOki11KCaYmFgZGPpmtyddS1q1t59JvPKjCjd8pbJHHqK6a4tlurWWCYAwyjBpun2Ftp1ultBkIOlAGJpWn6zCtwt9def5gOBtIxx9TWX4VzpOoX9rdjyi8zOGf5QfmJxz9a7Zl+fvVDUNGstSQGeLay9XVmBP60DOe8YSJqVrDp1syyTOyv8h3YAbPb6VB4is5rddGujGxSzw0uB0Hyk/yrotN8P2OmTmaFS0h+6WYn+daM0XmxnzFDbuCCO1AFBNYsP7LW9N1EIwOhcZ/KuKWwn1FdW1CJT9nlO5TjJONx/rXTnwlphkZyrvuOSu9gB+Ga2YLa3htzDAn7vaFA7e9AjO0bW7KfS4j5qoY12MrsARg1iwv/a3jBLu2UtFAu0t2PWti98M2FxIHIMK9fkJ61oWlhb2cSpCgRP73c0AYGqXtrJefZL+1aGJz8s5bIP4Y/r2rF1nQtJttOlhtZRPPOMRxhgTXcX+nwX8YW5jBAPHqKqWvhqwtLrzEVpGj5VmYnH60AJ4agls/D1pbyKVdE2lT2qHxmoXwxcYbcMpz/wADFb3AYgjBYcVz3jM/8UxcAdPk/wDQxQBY0sf8Smz/AOuCf+giijS/+QRZf9cE/wDQRRQBl+Gf+R117/fH8zXc9q4fwxz41172cfzNdvQAtFFFADTTJRuqTFRkUAIFA2k9qztaslvNLliKZJ56VpZ9abIxII7GqSCyPl+bMN03lNgg9K0vMLxoxbcSOav+NNJTTNfmVU2xkfLj6msewdCuHOK6KsVKJySRaikaN9y/eHIrs7CeO/05Lm4cKYR8+T1/ziuVtLCS6l+ThB1Y1c1O5SGGOzty21eJGX+L61zQko6IzS7lXU7w3dyzg5Tov0qpbTmCZJcfcYN+VIi5YrkEdVx6VZTT53jLiM49ahtc12Gh1Ul8p0n+0Iv9aBjFca7tM7SseXJY/jXQ6VZzJ+4nZTC47npUd74blhkZo5YjGTxkn/CnUk2rMrlOfwFOT0FUZ5XvL9BJ/eAX8609RgeziYs0bewJ/wAKi8N6Y2q67DArcBwxPpzXVQioxuxq6dj27wlavbeHLOKQYYKT+bE10GKr2kJgt4ouPkQLx9Ks9DmsZayujqilYAcU3OQ31pxINNJ/h9aT3KPPvirIV0qD5c/vF/lVL4T28cljczMnzhzx+ArovH2kSarpGIvvxMHx6gCuA8Ca/wD2FePbXJ2ozHP5f/Wroi/3ehDbudn4q8Z3WhX0dtFaF1cZOAfb/GucPxWniYl7PDA4wc/4V3s76FqYF5N5cijnLda8X8XNaTa5K9iu2EYABHU0U1fTqVdntVtqB1Twq96YwrSwE/mtebfD/wD5Gmb/AHm/nXd6Er/8IGhKjP2UnGe+yvPPBOoW9j4llkuW2qzMBj1zVQs00Tyts774kN/xSc3++P5iuY+Eh/0m8+n9RWx8RdWs30BrZJQ0rsDgduRWL8JiVuL4kdEz+oqVH3BS3Ol8ZaPpF86TXl0iMnVSR61ymo6T4Vl00pbXCfaNvBBFYesXVxrfio20kxVCcEZ9zXXN4D0+20pJpLsqWH3snirgklqJ7HIeCb6707xPFbCTcnOOfY13XxA0KG40htTk/wBYBn9K8/8AC0IXxlCivvwxG49xg16z43X/AIpGceqnGfoamT99Bd2PLvB3h6LX9SaKU/KFJFerXbJ4X8NIitxChVfrj/61effC+aO31Z2nlVBsOM133jO2N/4Zm8ohg2XBH0qqrvK0thpaHjgmk8Q6zILm5EURbqTW1qfhnTYLQzWuqRtLGucBh1/Ouf0fSv7Q1I27zLCQeuTXXT+AoraB5JNVXa/TDEn+Vae7bQnU0fhv4kmlnOlzvuK5wc16mzZArzrwf4JOmXyamlwkqEY+Un/D2r0UDIFclRp7GkX3DNGadikI4rIoD92uNtf+SlT/APXqn/oT12R+7XHWv/JSp/8Ar1T/ANCehgdo33T/ALxpoHGaGORj/aP86cBlaQCgDFIeKOlJ1oAOtFApSKAENJQxxQOaAG4zSbadmlzntQAzbS7M806igBoWmlakJx2pM80ANHFLnNDDNIOOKAA9KVaXGRSDimgFPWkpTzSYoAKTbnmnhQe9IRg4oAZtxRinUZ9qTAaKU0d6UDNAEbrmvPviloc99p8VzEnyQEMwA69f8a9FaoLy3ivLVoZ0Dq6nI9aAPGB4zvn8AyI6jJ/dqueegH9a6f4XaLd2GlTXUyYa5BYAj1NcHHoWpN4lFqbf/QBc/dycAZr3i1t0tbOOFBtVIxjFAHh/iyG7ufiN5OnTOlz2OCO5rdbw/wCPjtWO+kJxz8//ANes7xTbata+Om1GzgdivIJA9TVv/hNPF+crZcgeg/woA3/Dmk+MbPVln1S7ZrUA8F/Y+9cH4hjvJ/iDMtg5S5aQ/wA67jwv4i8R6hrUUF/bYtWUknjg4Pt7CsRtMuf+Fp/aTA3lGTO78RQBMumfEGIFRduVP+0R/WuQ1W31WHxZZpqsxM3mDALd8ivodnZS2OgweRXknjnTLq68dWE0MAePeGLenIpDIvieyi80hW+9tX+tdrqSlfh9JuyT9k4H/AK5T4k6Zd3eoaU9vAXCKu4nt1r0W0tkm0CC1uY8iSAJj/gOP60ktQPP/hG0Jt7pVYeYxbK9/vV6dlIg0j/KgHOa8bOl654N1q4vbSBWilbCopPH6e1F/wCMPEuoWf2VbRo2c7dwx3qhWT3PYbaW3mjLwSBkGeAfevJ/CxDfEq75wSW/ka67wFo+o6fp4n1C5d2kU5jYdOa5DxPoOq+HtfOs6ZudXOWwORz0H51NgR67g7QuHzXjXjP/AJKRa5O4YX+bVYf4h+JTHtGnuDtxnApvhfwzqviHWBrGqMy7F+UEcnGTz+dFinYreDT/AMXLvlUd5P8A0IV7SWbkYNeCGXU/DvjPUL6C0ZyZWAx6Fs1vf8LF14vj+zm5+lNEnrvzZKkYzk5rxnSio+Kz5yACc/8AfNemeF9VutW0RLi9i8mUsSAPSuM8X+GNTt/Ea6vo6Afu9z/y9KYHp+0rhFL7c7hXmnxiZRpFkp5cTjjv91qzl+IfiOPER08l0G0k45qtLZ+IPGmoW09zbIluj7ipY9gR6UAddpNjY6n8P7SDUpRFC8Kjc2BjgetcrP8AD+/06aG/8OXYlKv8rJg8c+hrvtX8NLfeGhpMEjQlIwMr7f8A6q8ys9Z8R+ErieyEMlxEpwpNAFr/AIS3xH4a1aNPEETSwswGTn6e9et6ZfR6lp8F5FxHKuQPSvGnh1vxzqsAuYPJhLDOe3OfSvY9K04aTp8FkrBvKUDNAF/NP3UmOKTB9aAFzmikFLQAu2joKXd7Uh55oATOTig8U3GDS7qEAdRRt70gbnpT85HSncBMUhp1IRSAYactJjJpwGKAFPSmjrSk5pAMUALRRS4oASmkGng4oyKAGmmmnc00igA7U3PFOpdoxQAwMfLYEcZrzjX7q5sfiJFLZWrTuYjlR36V6SuFVuMiuEuHb/hZ6gHCmLpj6UAWR4k17/oASf8Af3/61O/4SXX8f8gCT/v7/wDWrrAB6/pRkg4wPyoA5I+JvEDEY8Py/wDf3/61H/CSeIf+gBJ/39/+tXYKcDoPypcn0H5UAccPEniEHP8AYEv/AH9/+tSjxH4hY/8AIBlHv5n/ANauwyfQflR1GDigDk/+Eh8QY/5Akn/fX/1qZ/wkHiD/AKAkn/fz/wCtXWZ5xilwBxigZyJ1/wAQEf8AIDk/7+//AFqB4g8QD/mCSf8Af3/61deCAegoOD2FAHIHXfEXUaJJz/01/wDrU0eIfEuSF0Jz9Zf/AK1dkDx0FBI/uigDj/8AhIPFGMf2Af8Av7/9akbX/E//AEAT/wB/f/rV1/Gc7f1oZR6frQBxy694nJP/ABIiP+2mf6Up1zxOf+YGf++//rV1m0eh/M0oVR2P/fRoEcguu+Jf+gQP+/lP/t3xL/0B2P8Auy//AFq64Ow7L/3yKd5hPUD8BQBx51zxKOmjP+Mv/wBaj+2fFf8A0CI/+/orsA3sKX/gIoGcadY8XE5Gihh/sy0v9t+KAMNof5y//Wrsc4Hp9KjJGemfxoA486z4qP3NFj/7+ClXWPFoHzaLHn/roK7HcewA/ClEjdMA/hQI47+2fFf/AEBY/wDv4KQ6z4r/AOgLH/38FdpubGcD8qaXb0H5UAccuseK8ZOix4/66Cnf254mPA0SPd/10FdipJQZx+VJgA5AGfpQBx/9t+KR/wAwWP8A7+CsnxFq/iCbRZlutLWOPKAnr/EO9eitnHb8qwPGf/IrXI90Of8AgYoAtaVb7tHsmKgE28Z/8dFFGlM39j2P/XvH/wCgiigDJ8L/API568f9sfzNdtXFeGP+Ru1s/wC2P5mu1FAC0UUUAFMIp9JQgIyp4pGWpaYwzTuBxPxB8N/2pphljRjMgz8oyTXiEsUltI0cgZHQ4IYYNfUcib4gH59a838X/D/+0ZJLq0ADnJPXrW+HqK1pGUonEWGq+fbraQgJKePm4zV1dJtbQMb652s/8KEEfpmuRkhuNNuyk2VmU9fb/Oa3bG2uNTj/AHLMy+slRVotO6MXEtrqFna7o4bUHHRvWon1y8aMpGVVDwR7VMmhyNLse5j6dqdL4eWJVIuVPPSuZIhoyprm4uuXcjb0xVea6aODBlLdcAnmr17p0tnGZBICtc4/mXlyqIPmJwK6qVO+rHCL6gzvM/K5btXrfw08Pm2Q6hPCVc4wGGO1Zng34fvN/pV+AVAyAc16tbQwwIsaLtCDArSpNbI3UScYznp7UMM0xRz1zUg6Vz3NUM20behqTFJQMYyiTKkcMMH6V594m+HcV27z2JKyde1eiYxRtzTjUcXZCseGP8O9ekCAREEHgh15Hqea3tD+GGyVZdRBV884YEV6pswaMCreIaegrO5Si0+KCw+yxZEarsx7YxXl+t/D28/td59PU+UeR06969dwKXaDUQrSg9UDv0PHYvhtqN3bGa7lYzjtkV1PgXwxc6FJObrJVxj9RXc7cUYqnVurAovqeYeK/h7PcaidQ075WPYY9apReENfv1js7uVhbKRu/wA5r1oDPWlKAdKFVsrBynlWheAr3TPENvcMM2yE4PGehr0PWdLXV9Ia0c4Yj+laWKXbilKeqYcp4jceAtbtLzFpGWXH3+OOfrXqXh7S7iDQ4rTUCDmMBhn25rdwKTb3qp1Lh5HlHif4cSrcPeabksx6DFc7F4I8RXMmySN+epPTH517yVzSbMUvaaWHynOeENCl0LTBFI5ZmHzAkcc10o6U3HFKOKl9wsKOlB6Umfmp+eKkY0/drjrX/kpU/wD16r/6E9diPumuNsx/xcab/rh/8VQwOzPT/gR/nTwRjrUeBtFOwMUgFNIKXtRQAlONJRQA1u1KtKaSgAxSEYo3UZzQAUUUm2gANJTgMUUAIelN70+kIzQAvam4pdtG2mgFA4oxQOBS0AMJI6U4cjNLiigBCKTFKelAApMAxSHilpDQAnWkGR847dqWjbQBF5Ue8bYlBPJNOzyA3fjin4o2A0AMdQDlsMx74pFAX+FeeOlSYzTWSgBEAXKKQCO+Ka6ICGCjcO9PxQVFAEbYx97JbrQEj4LRgsOAfShl5oHUCgAdI2G2Qbs9DjpSjdk7CMoAOfSn7aTbQBEyq7EY3LjLZ/pQLeDoVUY6HFSlcDimhcnmgBGRW+82R7UpAYgDoPWlK4bAp23igCPyF6/JR8qrhRg55xT9oo2igCIwxFmJiTk9TR5EW8YiT8qlKZFIABQAYjXIVAAOwoC54L4Wlxml20AMMMGf9WmPXFCIEQptCr1G2n7aTmgAXgZAGe2aY0UZYl1Uk98U/GaXbQBHFFGh3KqjHpTxgsWC4J60bcUvSgAZsUKaTGacKAFPWkoPWn/w0AMpM80tJjJoAXGRSbaft4pNtADQOakxxTelKOtABikNOpp60AN70tLSGgAoo7UEZoAKUUgOKQyAUAOIpMGkLA4xT1amgEwKQgUGkFDAXApO1IaQcCkAdmrhZ1/4uah/6Yn+ld0rA4+v9K4mcj/hZMH/AFyb/wBloA7IDigU4DIpQuKAFFLSgYoJoATNBPFMJ5ozQAuKXFKuKDjNAxMUYpeKOKADNITRQMUAFBIpeKacUANNFFLmgQtIRmjijigAwKfkUzijigBTyaTb3paKAE/ClH0pyinEUAJ/CajNPzRxQAwE+hpwpc9qSgBSeK5/xkP+KZuf+Af+hiugbpWB4z/5Fmf/AIB/6GKALWlAf2PZf9e8f/oIopulf8giy/64R/8AoIooAy/CwDeLNbPfeP5mu1xXE+FM/wDCWa56bx/M121ABRRRQAUYoopAIeKaTTjTCKAA5BJ61DISqnHc9KlyfSmnG7kcUPR3JPJviV4ek+1Lf2sZI284+przq3v7q23KrsMfwtX0pc2sN3btFOqsDxyM15r4p+HTHfcWGNxyQijmu2FVSjZmc4nAw3e4ZB2k9aWW58tdxkbA561QubS5sZSk+UZeMHimRwT3sqxR5ZmOABz1qfYpu6M+UfcX882FJYoegHWur8C+GptQ1VLmWJ1iQqR0Ga2fCvw7kk8u4v8AAXqFZa9RtLC2sI/LghWPA7DGaqdSMVZFxT6kkcZSJVThUGMU8DcMEU4Z8vH50AVx81zVIcABxTiOKaAc0/tQUNwaUCjJ9KWqAQjIoxS0UIAxTStScUho8wuxmylAxTs0mDQ9QuIRRinYoosguNKg0m3HSnUopcqAj2nNOxT/AMKbTaTATaPejHFLijB9KLIQgUig8nml3H0o60WQ7jdooxS4oxQAmKUniikbpSADwvFcXZ5/4WNP/wBcP/iq7Q8rXH2YX/hYk5BH+p/+KoYHYY+QfhS9qD90ClwcUgFHSiiigBCaWkNLQAUYoooAbtoxilooASl3CkxRs96AAnNFGMUUAFKKTFLQAtIaWkJoAKKKKAFxSYNLSZ9qAEIPek6U7OaaaADNB6UCl4oAbS4p3FJkUAJiloooATFBGadg0AetADNn1pNtS8Uz8KAGlaZtGQak60lACHNKPu5pQBTwBigCIE7qUqDSkc5ooAbjFLk4xinDGKXigBnNFP4ppHNACGmNk0/60hxQAKOBTioApqketPJBHFADcUUUtADacFHelGKaT6UAFJtpaMGgAo5op3HtQBGSc9KeCcUuB6imnrQAuKBRRQA/PFJR2ooATFHApC3OKQcnrQA7cKSjbRjtQAUYoooASjJFPxxTWxigBp5pCoNLRQA0gcCnqKaacpA70AFFFBoAaaaTkUppMHHSgBqj+v8AKuJcBviNCxPPlN/Su6jAwc8Vwswx8RogOcRtn8xQB3KnApQA3NRrnFPU/LigB4A96Zzh9wxj7tQ3cssNtJJGpLqMgVmeHdXOp2jrO4FxG2HjJ+YfWgDYKdfXHFIFAC7iAT1ptzOltA8sjBFQdWOK5nT9cupdLv7x4yBGpMRfo3HagDqdpXdjn04pWwDnkg+grhdL1LxVq9sLiAxLESQM/X6VcQ+L1jJUx59T/wDqoGdeFyeMn26U8REk8dBx8wrhtW1vxBo2krLOsJneQIMnHBz7U6BvFzwpKixEOM/fPH6UAdjjjJyPWm5OeMY9a5SPUde0ybfqhjNrn5mB4UfXFbtzqtpBZC8DqYyMgZ4b6UAaPU4GT/tY4ppHJ4PFck194n1PM+nqltbdQkvBYe3FNTUvEelsj6iElgY4Z06D9KAOvABPGelLtBQMD9c1zE3iAv4js7aA7ophyQeK6VmVI2Dngck0AJPLFbQtLKxCIMsRVTTdSg1RXe3DbFOMkYrH1fUrnVmaw0xFZMYaTqKzbVdd0KJfNVPs6n5hGP58UCO3ADRnB+YetOWPLDccLjmqFvqUF9YvcW5DBVOdpzg4rk9C8aPPqVzbXwKoJjGrseCckYpAdyufwp7YHIyRSBSpHox4P4VzOna1cXPiu+0058qAHnt1OP5VWgHTA04ufaolO7kc0/I7mkArYAzSBk5zux2wKzNd1FtN0ua5jdBIq/JuPBOa5rTZ/Fl/ZQ3CzQBGPTPbj2oA7fkAtg4pWbCjAPPesjRk1YM/2+VXz0C9K1jvKEHGB2oAUHcOawfGR/4pq4H+5/6GK3V4FYPjH/kW7j6p/wChigC1pf8AyCLL/rgn/oIoo0tT/ZNlwf8AUJ/6CKKAMjwi2fFWvf8AXQfzau3zXC+Dzt8S66CCXM3UfVq7kHj7poAdmkJpe33TSHjqCPwoAMmikyPf8qMn+6aAFppNDE9wR+FNz7n8qAAmm1IwX3/Ko8Ke5/Kj1AaR3oYb9rAdOop2Oep/Kk5BJBHNHoDRg6v4T07Vg2+LaTySKr6R4O0rSSWjTzGPQntXTA45OPSkONu0BQParU57CsNVVVlTG0DpTsYJ5zzQRuxkjignntUNN7hZDuMUCkGPx+tKB9KGkthi5xRmmkHd1FKFx3FADs0ZpOaUAY6j86dwDNGaXAHv+NNHX7v60XAXNGaQ5/u/rQoJP3f1ouAuadmk2+360c/3f1ouAMaTNLjPbFG33ouAmaVTSf8AAf1pR/u/rRcBc03NO/D9abgUXAcp4pc1GWwcCnAg0XADSZxS496QqPWi4Buo3Um3nrSEe9FwFLUhPFHHejANFwEB+Q1x1h/yUKf/AK5f/FV2BX5Tg1yFiP8Aiv7g55EX/wAVSYHZk4B/Cl3cU1h8nB9KUDigB3aikzgdKMj0oACaM0hIpu6gB5NJmmg5pePSgBc0ZppNJnNAD91GaZz60vNADqKbnFG6gB26kzk03mlGaAJOopMUm40uTQAUUnJo5oAWgmmlqbuJNADs80tIBS0AJSZpD1oFAC5peKaaOKAHA0uaZ9KXmgB+aM5pmaUE0AOpDSZNJk0ALjim45pw6U0k5oAXpS7qbkmjFACk8UlGKMUALRRg4pM0ALS9qbzSZNACkZpMUAnNOzQA0LzTsYpuTmjcTQApopKWgAopKKAHU5ehpMUjNtoARutFLwaQ0AFFIM0o60ALRS4pD1oAM0ZpKMigB3HejjtTQM/SnEACgBM0H2pKUCgBR+tIaWmmgA3dqa54oxzSHNADlzRTQzCl5oAUjNJtpRml5oAM0hppJppc0AO70u7imjkUEcUAKDkH0rh5uPiUMf8APM/zFdun3GzXEyAf8LKH/XI/0oA7Rc4py9aF6UqjvQA8gEYIyCK4vTF/4R/xTNHcDIvD8vf1/wAa7FmKnOMj0rmvFlncRLHqtsPNuoDlVxnaPcUAN8Z3hGnpYxH95ctx+tSTWAsfBstqw+dIGLf98/8A1qxNOkufFOspJcDMNuAVKrj5sDP6k11fiDLaFfHdz5LDj6UAcT4V8SXFlpEUKabJKocjIHufetv/AIS2dv3f9kyrzjOP/r0/wLNAPDkILxeaGOdzD1NdC0tuUbdJDkH+8KBnHeOLvfodpcFfKPmrnd6YNa9t4v0VLeJGuyGCDPyNj+VZXxBMM+mWi5SSMzqpAOR0Na8PhjSJNPQGyh3FRzsGfzxQBn61rNlrthJp+mS+bJLwTg8HpV9/Dsz+G4bSRszRDcuCODn/AOvWLpVjB4a8TSoYFS0kOVZlHBz6/jXV6pqLWNolzGpnVj/CeAKAOfi17UdHjFvPpssxjXAkUjHH41qJ4p0e/jWOa4/fEf6socA/lWhbahaXsKy5iTcvzozD+VYmvWuiQafIYre1W66q0SLnOfagClfbB46sPJ2kFOg7Vr+M5XTwxPLC2yQY5rmbFZF8T6U8rfMY+cjrXYeItOfV9EltI22Fzzx9aAK/hW3RdEglxmWXkn8BW6wiZSsq7kPykVzXhnVYrS3j067xFNCMBm4HStW+1a1soGnE6S85CKQSTQI5rS18jxBqdrG2IFQnb6cGsTw/oMeswajEjETR3jOrf8Cat7Qra4luL7VpUKrOrAgj2/8Ar03wBgrqeCA4uG5x/tNQM0vDmvveXL6fcLteAlASOvy5/rWVooY+PdYXHVEyf++qu+JrKSyWPU9NUeejAMqL1BOCTj2NYvhG8N94x1WQv85VAy9wRuqdQO6sbFrMSDzN7SHPParKgLuJ54x+NMjZHGI2zg/NzzUxGW4IGOlUI4rxtZane/YRpwz+8+YHp0apYofFdlbr80JhjGdgxn+dbOsas2lNCPs25Xb55D0Xr7VbGp2kkBmEiBNh7j0oAp6Nr0Wps0Ui7LqMfvEA6VtFBwQeDXEeGIXXxRqd8qbrebGxuo4Cg/yNdqgOASfwoAcV4rnPGYA8Nz/VP/QxXSHpXN+NR/xTdx9U/wDQxQBd0s/8Siy/64J/6CKKTS8/2RZf9cE/9BFFAHFaZr6aB4i1gXUMhWSYlCqk5GT/AI1uf8LFsO0E/wD37Ndd9ktZHZmtYi5OdxUZoFhaZ/49of8AvgUAcmPiPp4HMM//AH7NL/wsjTf+eU3/AH7NdZ/Z9of+XaH/AL4FIdOsx/y7Q/8AfAoA5P8A4WTpv/PKb/v2aT/hZGk/88bj/v2a6z+z7M/8usP/AHwKX+zbM/8ALrD/AN8CgDkv+Fk6T2jnH1jaj/hZOlf3Zv8Av01dYdNswOLWH/vgU0adaZ/49YP++BQBzJ+JGkHtL/36amf8LF0k9pR/2zauo/siy/594v8AvgU1tIsO9rCf+ACgDmf+FiaP3Mn/AH7b/ClHxA0X/no3/ftv8K6I6Pp//PnD/wB8D/Cmf2Lpv/PnF/3yP8KVwMA+P9FJ/wBY3/ftv8KP+E/0PvK3/ftv8K3/AOw9NYf8eUP4oP8ACkOg6Zn/AI8oP++B/hRcDAPj/Qv+e7f9+3/wpR8QdCA/1rZ/65v/AIVvf2Fpn/PjB/3wP8KP7B0z/nxg/wC+B/hVXAwB8QtDz/rW/wC/bf4VIPiBon/PVv8Av23+FbZ0HS8f8eMH/fA/wpV0HS/+fKD/AL4H+FIDE/4T3RCc+cf+/bf4U4ePdD/57H/v23+FbDaFpYYj7BB/3wP8KT+wtLPH2CD/AL4H+FAGUPHWinpIf++G/wAKP+E50b/nqf8Avhv8K1xoWmD/AJcYP++B/hQdB0onJsYf++R/hQBjnx1oo/5bEf8AAG/wo/4TzRMf8fP/AJDb/Ctc6BpXaxh/75H+FJ/wj+l/8+MH/fA/woAyP+E+0LvdH/v2/wDhS/8ACf6COt3j/tm/+Fa39gaV/wA+EH/fA/woOgaT/wBA+3P1Qf4UAZX/AAn+gn/l7/8AIb/4U7/hPdCH/L1/5Db/AArVXQNJ/wCgbbf9+x/hQPDmkHrYQ/8AfA/woAyv+E90L/n4z/2zb/Cl/wCE70M/8tj/AN8N/hWk3h3SAf8Ajxh/75H+FKvh7Sf+fGH/AL5H+FAGV/wnGjf8/H/jjf4U5fG+jH/l5x/wBv8ACtH/AIR7Sv8Anyh/75H+FIfDmkN97T4G+qj/AAoAo/8ACa6N/wA/Q/75b/Cl/wCE10X/AJ+1/wC+G/wq5/wjWjf9A23/AO+B/hS/8Izo3/QOtv8Av2v+FAFL/hNdEzzdr/3w3+FOHjXQ8c3i/wDfDf4Vb/4RfRT1022/79r/AIUHwtogGf7Ntv8Av2v+FAFUeM9CP/L8n/fDf4Uv/CYaIel6mP8Adb/Cp/8AhFdDf/mHW4/7Zr/hSHwpoq8fYIP+/Y/woAh/4TDRP+f1P++W/wAKQ+L9E/5/U/75b/Cpv+EU0X/oH2//AH7H+FL/AMIrov8A0D7f/v2P8KAK/wDwmGjDpdof+At/hR/wl+jtwLtP++W/wqx/wi2ij/mH2/8A37X/AApP+EW0U/8AMPg/79r/AIUAQ/8ACWaOBzeJ/wB8t/hXMWOv6evja5uWnUQsmFbB5PNdbJ4T0Ukf6BB/37FM/wCES0QOWGnwZHfy1/woAcPFWkbT/piDGOx/wpf+Eq0jHF7H+R/wph8H6ITlrCBgecGMf4Un/CH6CP8AmGW//ftf8KAJP+Eo0jH/AB/R/kf8KP8AhKNIPS+j/I/4Uz/hDtBxn+zbf/v2v+FN/wCEP0Ff+YbB+CAf0oAkPibSf+f2P8j/AIUDxHpTdLyP9aj/AOER0L/oHRfkP8KaPBegg5+wR/kP8KALK+INM/5+4/1p3/CQaZ/z+R/rVV/BuhYGLBB+A/wpv/CG6H/z4p+Q/wAKALZ17Tf+fuOga5px/wCXuOqn/CFaF/z5L+Q/wpD4K0PHFmv5D/CgC5/bmn/8/cf504a1YH/l7i/OqH/CE6Hg/wChp+Q/wqNfA+gf8+EX/fA/woA0zrNh3u4vzpP7Z0//AJ+4vzqgPA+g/wDPjH+Cj/Cl/wCEH0LtZJ+Q/wAKAL/9taf/AM/cf505dZ0/H/H3H+dZ3/CDaJ/z6r+Q/wAKa3gXQyebUfp/hQBqf2zp/wDz9x/nSf23p/8Az9x/nWV/wguhjkWw/T/CnDwRov8Az6r+Q/woA0v7c07/AJ+46Ua5p2f+PuP86zv+EJ0Qf8ui/kP8KP8AhCNDbg2i/kP8KANI61p5/wCXqL86j/tiw3H/AEuL86oHwNoX/PoP0/wpv/CC6DnP2JCfUgf4UAao1exP/L3F+dL/AGvY/wDP1F+dZQ8EaCP+XJB9Mf4Ug8D6Fn/jzH6f4UAah1axHP2qP86aNZsCeLqP86zR4H0YHP2Zcdhx/hSt4J0VwALVRj6f4UAXzrWng/8AH3H+dH9tad/z9x/nVE+CdEQf8ein8v8ACl/4QrRP+fNfyH+FAF3+29PH/L3HR/bmn/8AP3HVL/hCdD/581/If4Uf8ITof/Pmv5D/AAoAu/23p/8Az9x0o13TR1vIh+NUf+EJ0P8A581/If4Uv/CEaEetjGfqoP8ASgC9/b2mf8/sX50g1rTz0u4vzqgfA+g/9A+H/vgf4U1fAugD/lyX9P8ACgDU/tiwA/4+ovzpn9sWGf8Aj7j/ADqgfA+hEcWgH5f4VGfA2h5/49R+n+FAGqNWsT0uo/zoOr2IOPtUX51l/wDCDaIP+XYfp/hQfAuiMc/Zh+n+FAGqNVsz0uY/zpf7UtP+fiP86yD4G0UcfZ8e4x/hR/wg2i/885PzoA1/7Vs8f8fMX/fVA1Kzz/x8xf8AfVYx8CaKTnySfrj/AApB4D0XP+o/l/hQBt/2lZ/8/MX/AH1R/aNp/wA/MX/fQrG/4QTRf+eH8v8ACk/4QPRv+eP8v8KANoajaf8APzF/30KX+0LX/n4i/wC+hWIPAejf88f5f4U1vAmjj/lj/L/CgDc/tC1/5+I/zo/tC1/5+I/zrC/4QHSjzulHsD0o/wCEA0r+/N+dAG5/aFr/AM/Ef50v9o2n/PxH+dYX/CAaV/fm/OpP+EC0nH3pfzoA2f7RtD0uI/zo/tC1/wCfiP8A76rDk8B6QuM+cf8AgWKZ/wAILo/92b/v5/8AWoA6L+0LX/n4i/76FI19bMR/pEf/AH0Kwh4A0THKzf8AfVMbwFo4PyiUf8CoA6EXtqP+XiP/AL6FBv7b/nvH/wB9Vzo8B6Tn/lr/AN9VJ/wgOl/89JvzoA3ft1t/z3j/AO+qPt9t/wA94/8AvqsL/hAdL/56TfnR/wAIDpf/AD0m/OgDf/tC1/5+I/8Avqmm/tif9fH/AN9Vhf8ACAaX/wA9Jvzpp+H2mFv9bP8A99YoA3xe2xOPPj/76FO+1W//AD3j/wC+hWAfh7pew/vZ/wDvum/8K80rH+tuP++6AOkF3bhf9fH/AN9Cmm7hP/LaP/voVzJ+H+mA/wDHzdj2ElJ/wgGmdrm7P1koA6f7VD/z2j/76FKLyDp50ef94Vy//CAad/z3uP8Avunf8K+s8ZW8nA9M/wD16AOnN1Dj/XR/99CmG6h/57R/99CuZHgG1LY+2z/5/GlPw/tP+f2f/P40AdL9ph/56p/30KUXMPeVPzrl/wDhAbX/AKCF3+DH/Gj/AIQG1P8AzELz8JCP60AdT9pg/wCeyfnSfaIv+eqfmK5j/hALX/oIX3/f40n/AAgFp/0EL7/v8aAOn+1QjrKn50v2mE/8tU/OuW/4QC0P/MQvv+/xp6/D+z/6CF9/3+NAHRm4i/56J+Ypv2iIn/Wp/wB9CuePgOz/AOf6+/7/ABpB4DtDnF7dH/fctQB0guYcf65P++hSfaoQOZo/++hXNnwFaf8AP5P/AJ/Gm/8ACBWR/wCXqb86AOmW6gKt++j/AO+hXFyXER+IwkEi7fKPOfpV0+AbMKQLqYZ96a/w907zUn86USbdpYHB/OgDqFvIMf65Pzpy3kH/AD2T/vquZXwHZH/l9vv+/wAaD8P9NY5a7vSf+upoA6gXUBYZnjx/vCmNNbvCVM0QZwQ5LDpXNj4e6Z/z9Xh9jJTv+FfaZ/z2uP8AvugDXsYrLT0MVu8aKSSTuHc5qeY2c8ElvLKjI6kH5hWEPAGmqOJp/wAWoPgLTsZE0350AQDwjpEKtsvmTJztWSg+GNNyQNRfaf8AppVhfAOnHrNN+dH/AAgWmjjzZfzoAB4f0o2qQNdb9jBwWf0rdW5tIxtE0eAMD5qwv+EC008ebN+DYpP+Ff6af+Ws/wD33QBsXqadfwLHLLHknO7d0p0T2UNn9kMsciZ67h0rG/4QDTP+es//AH3R/wAIBpZ6y3H/AH3QAl34a0e6nLi7aMH+7JT7HQNJspi/2nzQOgd803/hX+lf89bj/vumf8IDpv8Az1n/AO+6ANVrXTZdSivS8avFkKN1XvttqXBaWMD/AHhXOf8ACA6d/wA9p/8AvrNOT4f6aes0350AaGpWWl6iv7ySMSd3VsVQs9A0mzuRMbwOv9xnzTR4B07/AJ7TfnTv+EA0zvLMfxoA2RdWYjZFmiEZGNoaqmlw6bpZmMU0eZXLH5vc/wCNUf8AhANL/wCek350n/CAaX/z0m/OgDdN9ZMu0yx89ct2qhaWGjWWoz3dvJGks7fO27ryf8apf8IBpe3/AFk3/fWKb/wgOlkHLzkf79AG1ZC2tPMYXUbFz03irRvLZRjz4yT1+YVzY+H+jD/nv/38/wDrUv8AwgGkdjN+LZoA6GS8tZI2jllhZCPUZrnm8OaE139p+0MHznHm8flR/wAIBpI6NKD9aX/hAtL/AOek350AbcNzZW8axRTRBQOuRTxfW/U3EfHT5qwf+EB0v/npN+dA8BaYTjzJvzoA6Iahakf8fEf/AH1WD4xu7eTw9MizIzMVAAPX5hSDwBpf/PSb86UeAdIX73mPzn5jQBf0yaJdJswXGRAgP/fIorQi021ihSNU+VVCj6CigD//2Q=='
	  	doc.addImage(encabezado, 'JPEG', 250, 20, 300, 67)

		var res = doc.autoTableHtmlToJson(document.getElementById("tabla_reporte_kilometraje"));
	  	doc.autoTable(res.columns, res.data, {margin: {top: 140}, styles: { fontSize: 8, columnWidth: 'auto', halign: 'right' }});

	  	var fecha = new Date()
		var mes = fecha.getMonth() + 1
		doc.setFontSize(8)
		doc.text(650, 550, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())

		doc.save('Reporte de Kilometraje.pdf')


	}

	$scope.selecionarTipoReporte = function(tipo_reporte){

		$scope.tipo_reporte_vale = tipo_reporte

	}

	$scope.seleccionarValeAnulado = function(vale_anulado){

		$scope.vale_anulado = vale_anulado

	}

	$scope.generarReporteVales = function(){

		$scope.reporte_vales = {}
		$scope.reporte_vales.FECHA_INICIO = $('#reporte_vales_fecha_inicio').val()
		$scope.reporte_vales.FECHA_FIN = $('#reporte_vales_fecha_fin').val()
		$scope.reporte_vales.VEHICULOS = $('#reporte_vales_vehiculos').val()
		$scope.reporte_vales.TIPO_REPORTE = $scope.tipo_reporte_vale
		$scope.reporte_vales.ANULADOS = $scope.vale_anulado

		$scope.reporte_vales_generado = true
		$scope.reporte_generado = false
		$scope.reporte_rendimiento_generado = false
		$scope.reporte_kilometraje_generado = false

		$http({

			method: 'POST',
			url: 'routes/reportes/reporte_general_vales.php',
			data: $scope.reporte_vales

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.vales = response.data[0]

			$scope.fecha_inicio = response.data[1]
			$scope.fecha_fin = response.data[2]
			$scope.vehiculos_reporte = response.data[3]

			$scope.current_grid = 1
			$scope.data_limit = 10
			$scope.maxSize = 5
			$scope.filter_data = $scope.vales.length
			$scope.total_vales = $scope.vales.length

			$('#modalReporteVales').modal('hide')

			$('#modalReporteVales').on('hidden.bs.modal', function (e) {

				$('#reporte_vales_fecha_inicio').val('')
				$('#reporte_vales_fecha_fin').val('')
				$('#reporte_vales_vehiculos').val('')
				$("#reporte_vales_vehiculos").prop("disabled", true);
				$("#optionsRadios1").prop("checked", true);
				$("#anulado_si").prop("checked", true);

				$scope.tipo_reporte_vale = 1
				$scope.vale_anulado = 1

				window.scrollTo(0,document.body.scrollHeight);

			})

		})


	}

	$scope.imprimirReporteVales = function(){

		//alert('reporte 5')

		var doc = new jsPDF('l', 'pt');

		var encabezado = 'data:image/jpeg;base64,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'

		doc.addImage(encabezado, 'JPEG', 300, 20, 240, 54)

		doc.setFontSize(10)
		doc.text(325, 100, "Reporte de Vales - " + $scope.fecha_inicio + " a " + $scope.fecha_fin)
		doc.text(15, 115, "Vehículos: " + $scope.vehiculos_reporte)

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

				doc.text(350, 570, "Cantidad de registros: " + $scope.vales.length)

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

	/* PAGINACION */
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
