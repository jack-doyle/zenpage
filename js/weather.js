(function() {

    // Elements
    var weather = document.querySelector('.weather');
    var temperature = document.querySelector('.weather__temperature');
    var unit = document.querySelector('.weather__unit');
    var condition = document.querySelector('.weather__condition');
    var conditionText = document.querySelector('.weather__condition-text');
    var location = document.querySelector('.weather__location');

	chrome.storage.sync.get({
		weather: {}
	}, function(options) {
		if (options.weather.show) {
			// Weather API
		    var PATH_WEATHER_BASE = 'https://query.yahooapis.com/v1/public/yql';
		    var PATH_USER_LOCATION = options.weather.location;
		    var PATH_USER_UNIT = options.weather.units;
		    var PATH_SQL_QUERY = 'q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + PATH_USER_LOCATION + '") and u="' + PATH_USER_UNIT + '"';
		    var PATH_ARRAY_FORMAT = 'format=json&diagnostics=false&env=store://datatables.org/alltableswithkeys&callback=';

		    var url = encodeURI(PATH_WEATHER_BASE + '?' + PATH_SQL_QUERY + '&' + PATH_ARRAY_FORMAT);

		    // Query the API
		    var request = new XMLHttpRequest();
		    request.onreadystatechange = function() {
		        if (request.readyState === XMLHttpRequest.DONE) {
		            if (request.status === 200) {
		            	weather.classList.add('active');
		                updateWeather(JSON.parse(request.responseText));
		            } else {
		                alert('Error getting weather information.');
		            }
		        }
		    }

		    request.open('GET', url);
		    request.send();
		}
	});

    function updateWeather(data) {
        data = data.query.results.channel;

        temperature.innerHTML = data.item.condition.temp + '&deg;';
        unit.innerHTML = data.units.temperature;
        condition.classList.add('icon-' + data.item.condition.code);
        conditionText.innerHTML = data.item.condition.text;
        location.innerHTML = data.location.city + ', ' + data.location.country;
    }
})();