import { feature1, convertDate, getHttpRequest } from '../../main/feautr1'

const moment = require('moment')
const expect = require('chai').expect
const chai = require('chai')
chai.use(require('chai-sorted'))

const mock = () => {
    const loadJsonFile = require('load-json-file')
    loadJsonFile('test/unit/stubs/mock.json').then(json => {
        //console.log(json)
    })
}
mock()
describe('MovieFeature [unit]', () => {
    const { pop, rating, fromDate, toDate } = {
        pop: 50,
        rating: 5,
        fromDate: '2015-1-1',
        toDate: '2020-12-31'
    }
    let movieRatingDateData
    let moviePopDateData
    beforeEach(async () => {
        movieRatingDateData = await getHttpRequest('https://api.themoviedb.org/3/discover/movie?api_key=eaa197b250138af7cf36467821b800d1',
            {
                language: 'en-US',
                sort_by: 'vote_average.asc',
                include_adult: false,
                include_video: false,
                page: 1,
                with_original_language: 'en'
            })
        moviePopDateData = await getHttpRequest('https://api.themoviedb.org/3/discover/movie?api_key=eaa197b250138af7cf36467821b800d1',
            {
                language: 'en-US',
                sort_by: 'popularity.desc',
                include_adult: false,
                include_video: false,
                page: 1,
                with_original_language: 'en'
            })
    })

    describe('#yearsAndPopluritySearch', () => {
        it('retrieve movie with rating above and not bellow the requested', () => {
            const result = MovieFeature.yearsAndPopluritySearch(movieRatingDateData, rating, fromDate, toDate)
            expect(result).to.be.an('array').with.length.greaterThan(0)
            expect(result.every((item) => item.vote_average >= rating)).to.be.eql(true)
        })

        it('retrieve movie only between specific years', () => {
            const result = MovieFeature.yearsAndPopluritySearch(movieRatingDateData, rating, fromDate, toDate)
            expect(result).to.be.an('array').with.length.greaterThan(0)
            expect(result.every(item => moment(item.release_date).isBetween(
                convertDate(fromDate), convertDate(toDate)))).to.be.eql(true)
        })

        it('contain movie that projected in specifics year', () => {
            const { rating, fromDate, toDate } = { rating: 5, fromDate: '2015-1-1', toDate: '2020-12-31' }
            const result = MovieFeature.yearsAndPopluritySearch(movieRatingDateData, rating, fromDate, toDate)
            expect(result).to.be.an('array').with.length.greaterThan(0)
            expect(result).to.deep.include({
                title: 'The Hard Way',
                vote_average: 5.6,
                release_date: convertDate('2019-03-20')
            })
        })

        it('retrieve an empty list for false search result', () => {
            const { rating, fromDate, toDate } = { rating: 5, fromDate: '2099-1-1', toDate: '2999-12-31' }
            const result = MovieFeature.yearsAndPopluritySearch(movieRatingDateData, rating, fromDate, toDate)
            expect(result).to.be.an('array').and.to.have.lengthOf(0)
        })

        it('raise exception when years range is invalid', () => {
            const { rating, fromDate, toDate } = { rating: 5, fromDate: '2016-1-1', toDate: '2015-12-31' }
            expect(() => MovieFeature.yearsAndPopluritySearch(movieRatingDateData, rating, fromDate, toDate)).to.throw(Error)
        })
    })

    describe('#yearsAndRatingSearch', () => {
        it('retrieve movie with popularity above and not below the requested', () => {
            const result = MovieFeature.yearsAndRatingSearch(moviePopDateData, pop, fromDate, toDate)
            expect(result).to.be.an('array').with.length.greaterThan(0)
            expect(result.every((item) => item.popularity >= pop)).to.be.eql(true)
        })

        it('retrieve movie only between specific years', () => {
            const result = MovieFeature.yearsAndRatingSearch(moviePopDateData, pop, fromDate, toDate)
            expect(result).to.be.an('array').with.length.greaterThan(0)
            expect(result.every(item => moment(item.release_date).isBetween(
                convertDate(fromDate), convertDate(toDate)))).to.be.eql(true)
        })

        it('contain movie that projected in specifics year', () => {
            const { pop, fromDate, toDate } = { pop: 60, fromDate: '2016-1-1', toDate: '2018-12-31' }
            const result = MovieFeature.yearsAndRatingSearch(moviePopDateData, pop, fromDate, toDate)
            expect(result).to.be.an('array').with.length.greaterThan(0)
            expect(result).to.deep.include({
                title: 'Spider-Man: Into the Spider-Verse',
                popularity: 177.654,
                release_date: '2018-12-07'
            })
        })

        it('retrieve an empty list for false search result', () => {
            const { pop, fromDate, toDate } = { fromDate: '2085-1-1', toDate: '2990-12-31' }
            const result = MovieFeature.yearsAndRatingSearch(moviePopDateData, pop, fromDate, toDate)
            expect(result).to.be.an('array').and.to.have.lengthOf(0)
        })

        it('raise exception when years range is invalid', () => {
            const { pop, fromDate, toDate } = { fromDate: '2012-1-1', toDate: '2010-12-31' }
            expect(() => MovieFeature.yearsAndRatingSearch(moviePopDateData, pop, fromDate, toDate)).to.throw(Error)
        })
    })

})