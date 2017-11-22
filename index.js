const {getWatsonData, findRelevance, getStringOfKeywords} = require('./utils')
const stringSimilarity = require('string-similarity');


const cvObj = require('./dataSet/cv-output/Agarwal_test.json')

//Use this to get set of common keywords between 2 datasets (2cvs or 1 cv and 1 spec)

const getCommonKeywords = getWatsonData('./dataSet/cv-input/1.json')
.then(result=> {
return (findRelevance(result,cvObj))
})
.then(result=> console.log(result))
.catch(console.error);

//Use this to get overall similarity between 2 datasets (2cvs 1 cv and 1 spec)
//Result is expressed in a fraction between 0 and 1, which indicates the degree of similarity between the two strings

const getSimilarityPercentage = getWatsonData('./dataSet/cv-input/1.json')
.then(result => {
    return stringSimilarity.compareTwoStrings(getStringOfKeywords(result), getStringOfKeywords(cvObj));
})
.then(result=> console.log(result))
.catch(console.error);

//Use this to get top n(example 3) matches between a target dataset(1cv or 1 jobspec) and an array or datasets (multiple cvs)

const getTopMatches = getWatsonData('./dataSet/cv-input/1.json')
    .then(result => {
        let targetArr = [cvObj]

        let data = stringSimilarity.findBestMatch(getStringOfKeywords(result), [getStringOfKeywords(cvObj)]).ratings
        data = data.sort((match1, match2) => match2.rating - match1.rating)

        return data.map(match => {
            let objData = {}
            targetArr.forEach(target => {
                if (getStringOfKeywords(target) === match.target) {
                    objData.id = `${target.person}_test`
                    objData.rating = match.rating
                }
            })
            return objData
        })
    })
.then(result => console.log(result.slice(0,3)))
.catch(console.error);