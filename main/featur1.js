import axios from 'axios'

const moment = require('moment')
const convertDate = (date) => {
    return moment(date, ['MM-DD-YYYY', 'YYYY-MM-DD'])
}

const getHttpRequest = async (url, args = {}) => await axios.get(url, args)
    .then((response) => {
        return response.data
    })
    .catch((error) => {
        console.log(error)
    })

class MovieFeatures {
    static yearsAndPopluritySearch (data, rating, fromDate, toDate) {
        if (convertDate(toDate) < convertDate(fromDate)) {
            throw new Error()
        }
        return data.results.map(item => {
            return {
                title: item.title,
                vote_average: item.vote_average,
                release_date: convertDate(item.release_date)
            }
        }).filter(item => item.vote_average >= rating)
            .filter(item => {
                return moment(item.release_date).isBetween(
                    convertDate(fromDate), convertDate(toDate))
            })
    }

    static yearsAndRatingSearch (data, pop, fromDate, toDate) {
        if (convertDate(toDate) < convertDate(fromDate)) {
            throw new Error()
        }
        return data.results.map(item => {
            return {
                title: item.title,
                popularity: item.popularity,
                release_date: item.release_date
            }
        }).filter(item => item.popularity >= pop)
            .filter(item => {
                return moment(convertDate(item.release_date)).isBetween(
                    convertDate(fromDate), convertDate(toDate))
            })
    }
}

module.exports = { MovieFeature: MovieFeatures, convertDate, getHttpRequest }

'https://randomuser.me/api/?format=json&results=10&inc=gender,name,location,phone,dob'