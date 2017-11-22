const fs = require('fs');
let _ = require('underscore')

//setup Watson NLU
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var nlu = new NaturalLanguageUnderstandingV1({
    username: '9dcbde29-933b-4955-aa18-025681cee1da',
    password: '1ns5rCS5KK1x',
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
})

const getWatsonData = (path) => {
    return new Promise ((resolve, reject) => {

        fs.readFile(path, (err, data) => {
            if (err) reject(err)
        
            data = JSON.parse(data)
        
            let result = '';
            let id = data.familyname
        //Extract personal statement 
            result += data.bio_data.summary.points[0];
        
        //Extract collective job descriptions as one string
            let exp = data.bio_data.experience.items.map(item => {
                return item.details[0]
            }).join(' ')
        
        //Extract collective skills as one string
            let skills = data.bio_data.skills.details.map(skill => {
                return skill.items
            })
            skills = _.flatten(skills).join(' ')
        
            result += skills
            result += exp
        
        //Pass data string to Watson and create new JSON with analysed profile
         nlu.analyze({
                'html': result,
                'features': {
                    'concepts': {},
                    'keywords': {}
                }
            },  (err, response) => {
                if (err) console.error;
                response.person = id
                fs.writeFile(`./dataSet/cv-output/${id}_test.json`,JSON.stringify(response, null, 2), 'utf8', (err) => {
                    if (err) throw err
                })
                resolve(response);
    
            })
        })
    })
    .then(result => result)
    .catch(console.error)
}

const findRelevance = (obj1, obj2) => {
    return new Promise ((resolve, reject) => {
        if(!obj1 || !obj2 ) reject()

        let keywords1 = obj1.keywords.filter(keyword => keyword.relevance > 0.70);
        let concepts1 = obj1.concepts.filter(concepts => concepts.relevance > 0.50);
        
        keywords1 = _.pluck(keywords1, 'text')
        concepts1 = _.pluck(concepts1, 'text')
        
        let finalData1 = concepts1.concat(keywords1)

        let keywords2 = obj2.keywords.filter(keyword => keyword.relevance > 0.70);
        let concepts2 = obj2.concepts.filter(concepts => concepts.relevance > 0.50);
        
        keywords2 = _.pluck(keywords2, 'text')
        concepts2 = _.pluck(concepts2, 'text')

        let finalData2 = concepts2.concat(keywords2)

        resolve(_.intersection(finalData1, finalData2))

    })
    .then(result=> result)
    .catch(console.error)
}

const getStringOfKeywords = (obj) => {
    let keywords = obj.keywords.filter(keyword => keyword.relevance > 0.70);
    let concepts = obj.concepts.filter(concepts => concepts.relevance > 0.50);
    
    keywords = _.pluck(keywords, 'text')
    concepts = _.pluck(concepts, 'text')
    
    let finalData = concepts.concat(keywords)
    return finalData.join('')
}

module.exports = {getWatsonData, findRelevance, getStringOfKeywords};