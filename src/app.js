const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

// define paths for Express config
const publicDirPath = path.join(__dirname, '../public') //express needs absolute path and not relative
const viewsDirectoryPath = path.join(__dirname, '../templates/views') //this line could be avoided if we rename 'templates' directory as 'views'
const partialsDirPath = path.join(__dirname, '../templates/partials') //for partials handlebars

const app = express()  //express is a function and its returned value is stored in app

// setup handlebars engine and views location
app.set('view engine','hbs')  //for dynamic pages (hbs = handlebars)
app.set('views', viewsDirectoryPath) //this line could be avoided if we rename 'templates' directory as 'views'
hbs.registerPartials(partialsDirPath)

// setup static directory to serve
app.use(express.static(publicDirPath))  //for static pages

// app.get('/about', (req, res)=>{
//     res.send("About page")
// })

// app.get('/help', (req,res)=>{
//     res.send("<h1>Help</h1>")
// })

app.get('', (req,res)=>{
    res.render('index', {
        title: 'Weather',
        name: 'Adit Kalyani'
    })  //for dynamic pages
})

app.get('/about', (req,res)=>{
    res.render('about',{
        title: 'About Me',
        name: 'Adit Kalyani'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        title: 'Help',
        message: 'What help do you need?',
        name: 'Adit Kalyani'
    })
})

app.get('/weather', (req,res)=>{  // .weather?address=Mumbai so query.address=Mumbai
    const address = req.query.address
    if(!address){
        return res.send({
            error: 'Address must be provided'
        })
    }

    geocode(address, (error, {latitude, longitude, location}={})=>{
        if(error){
            return res.send({
                error: error
            })
        }
        
        forecast(longitude, latitude, (error, forecastData)=>{
            if(error){
                return res.send({
                    error: error
                })
            }
            console.log(location)
            console.log(forecastData)

            res.send({
                location,
                forecastData,
                address
            })
        })
    })

    // res.send({
    //     location: 'Mumbai',
    //     forecast: 'Sunny',
    //     address: address
    // })
})

app.get('/help/*',(req,res)=>{
    res.render('error404',{
        title: '404 Error',
        name: 'Adit Kalyani',
        message: 'Help article not found'
    })
})

app.get('*',(req,res)=>{
    res.render('error404',{
        title: '404 Error',
        name: 'Adit Kalyani',
        message: 'Page not found'
    })
})

app.listen(3000, ()=>{
    console.log("Server is started")
})