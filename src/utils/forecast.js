const request = require('request')

//Con proprietà destructuring objects
const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/55ed8ccfecb9624b279309ecef941f16/' + latitude + ',' + longitude

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        }
        else if (body.error) {
            callback('Unable to find location', undefined)
        }
        else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out.')
        }
    })
}

module.exports = forecast