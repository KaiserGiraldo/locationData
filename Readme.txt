To automatically download the latest data and recompile the binary data, run updateData, they update it more or less on the first week of every month.
Make sure to run it from inside this directory.

This repository contains the necessary data for lynxchan to apply location flags on posts.
The 3 main files are data.json, compiledIps and compiledLocations.
You can use the scripts provided to compile binaries from the CSVs over http://dev.maxmind.com/geoip/geoip2/geolite2/.
The ones used are the GeoLite2 City.

To install this data on your engine, clone this repository to src/be/locationData.

data.json is used to read the main URL for flags and which flag and name to use for each location.

Example:

{
	"flagsUrl": "http://static.some.chan/flags/",
	"unknownFlag": "unknown.jpg",
	"unknownFlagName": "Unknown",
	"relation": {
		"BR": {
			"flag": "hue.png",
			"name": "Brazil"
		},
		"USA": {
			"flag": "burgers.jpg",
			"relation": {
				"California": {
					"flag": "terminator.jpg"
				},
				"Texas": {
					"flag": "alamo.jpg",
					"relation": {
						"Dallas": { 
							"flag": "slut.gif"
						}
					}
				}
			}
		}
	}
}

Notice how you can either set a country to the whole flag, specify regions or cities within a region. When the most specific possible flag is found, the value is prepended to the flags url. 
So if a brazilian posts with the above example, the flag URL would be "http://static.some.chan/flags/hue.png".
And someone from dallas would be "http://static.some.chan/flags/slut.gif"
You can also add an optional field "name" on nodes that will be used on the tooltip of the flag, as you can see on BR.

To know how to entry the name of regions and cities, consult http://dev.maxmind.com/geoip/geoip2/geoip2-csv-databases/.
The countries use the field "country_iso_code", regions the field "subdivision_1_iso_code" and cities "city_name".
You can compile your own version of the binaries from the csvs. Place the csv on this directory and run either the compile ips.

This data.json provided uses the /.static/flags/ path to look for flags, but if you change flagsUrl on data.json you can make it use other location, even on a separate server.

This product includes GeoLite2 data created by MaxMind, available from
<a href="http://www.maxmind.com">http://www.maxmind.com</a>. 

PS: dicks
