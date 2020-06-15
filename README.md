# CMS Backend API

A simple CMS backend implemented on REST API.

### Getting Started
Clone repository https://github.com/Cefalo/cms-backend-api.git and run the following commands from the source root -
* npm install
* npx nodemon

Article RichText payload sample
```JavaScript
{
	"baseVersion": 1,
	"frags":[{
		"lineNumber": 1,
		"type": "add", //add/delete
		"name": "sd23f32", //random generated unique value
		"text": "this is main content of that para",
		"tag": "p", // div/p/figure/video/iframe
		"markups":[{
			"tag": "strong",
			"startAt": 0,
			"endAt": 5
		},{
			"tag": "a",
			"startAt": 32,
			"endAt": 42,
			"href": "http://www.google.com"
		}],
		"imageId": "imageId",
		"iframeId": "externalLinkId",
		"externalResourceId": "externalLinkId"
	}]

}
```
