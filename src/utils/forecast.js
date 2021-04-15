const request = require("request")

const forecast = (long, lat, callback)=>{
    const url = 'http://api.weatherstack.com/current?access_key=e53eaefdc6204273521ff03c770f07c8&query='+lat+','+long

    request({url:url, json:true}, (error, response, body)=>{
        if(error){
            callback('Cannot connect to the weather sevices', undefined)
        }else if(response.body.error){
            callback('Unable to find the location', undefined)
        }else{
            callback(undefined, body.current.weather_descriptions + ". The temperature is "+ body.current.temperature+". It feels like "+ body.current.feelslike)
        }
    })
}

module.exports = forecast

