const path = require('path')
//Inizializzazione di Express
const express = require('express')
//Engine View per utilizzo di partial per l'html, le pagine hbs sono file html ma con estenzione hbs
const hbs = require('hbs') 
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
// process.env = per accedere alle variabili d'ambiente (PORT = porta d'ascolto)
// l'istruzione dice che se non la trova (poichè è settata solo da Heroku), allora usa la 3000 (vuol
// dire che siamo in locale)
const port = process.env.PORT || 3005 

//Definizione paths per configurazione Express
const publicDirectoryPath = path.join(__dirname, '../public')
//Express con hbs cerca per la cartella 'views', però posso customizzarla
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials');

//Settings Express
//settaggio utilizzo di hbs come view engine
app.set('view engine', 'hbs')
//settaggio percorso cartella hbs
app.set('views', viewsPath)
//cartella di hbs dove sono contenute le partial
hbs.registerPartials(partialsPath)

//Settaggio per utilizzare altri file presenti nella cartella del progetto
app.use(express.static(publicDirectoryPath))

//req e res sono due argomenti fissi per la nostra callback e rappresentano http request e response
// da notare che ogni chiamata prevede una sola request e una sola response (es. res.send può essere
// chiamato una sola volta)
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Andrew Mead'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) =>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

//l'asterisco indica la route per ogni percorso non definito sopra (per questo si mette alla fine)
//lo stiamo utilizzando per servire una pagina di errore 404 in caso di url errati
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Help',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found'
    })
})
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// chiamata alla route principale e alle altre ruote, sostituite da app.use e opportuni file html
// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>')
// })
// app.get('/help', (req, res) => {
//     res.send([{
//         name: 'Andrew',
//         age: 27
//     },
//     {
//         name: 'Sara'
//     }])
// })
// app.get('/about', (req, res) => {
//     res.send('<h1>About</h1>')
// })