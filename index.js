'use strict'

const express = require('express')
const app = express()

const port = 3000

const twitter = require('./twitter-client')

/*
 * GET /
 * Serve front page
 */
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

/*
 * GET /tweets
 * REST endpoint to get tweets
 * @param {String} q paris
 * @param {String} latlon 48.8669576,2.3116284,5km
 */
app.get('/tweets', (req, res) => {
	if (req.query.q !== null && req.query.latlon !== null && req.query.q !== '' && req.query.latlon !== '') {
		twitter.get('search/tweets', {
				q: req.query.q,
				geocode: req.query.latlon,
				count: 100
			})
			.then(function (tweets) {
				// Filter Twitter API results with only tweets with geo field
				let filteredTweets = tweets.statuses.filter(o => o.geo !== null)

				res.send(filteredTweets)
			})
			.catch(function (error) {
				res.status(500).send(error)
			})
	} else {
		res.sendStatus(400)
	}
})

app.listen(port, (err) => {
	if (err) {
		return console.log('Error', err)
	}
})
