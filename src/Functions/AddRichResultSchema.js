import moment from 'moment'

const addRichResultSchema = (post, url) => {

    let schema = {
        "@context": "http://schema.org",
        "@type": "QAPage",
        "mainEntity": {
            "@type": "Question",
            "name": post.title,
            "text": post.message,
            "answerCount": Object.keys(post.replies   || {}).length,
            "upvoteCount": Object.keys(post.voteUsers || {}).length,
            "dateCreated": moment(post.timeStamp).format(),
            "author": {
                "@type": "Person",
                "name": post.userName
            },
            "suggestedAnswer": Object.keys(post.replies || {}).map(key => (
                {
                    "@type": "Answer",
                    "text": post.replies[key].message,
                    "dateCreated": moment(post.replies[key].timeStamp).format(),
                    "upvoteCount": Object.keys(post.replies[key].voteUsers || {}).length,
                    "url": `https://nomoresheet.es/${url}/#${key}`,
                    "author": {
                        "@type": "Person",
                        "name": post.replies[key].userName
                    }
                }
            ))
        }
    }

    let script = document.getElementById('schema') || document.createElement('script')

    script.id   = 'schema'
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)

    if(!document.getElementById('schema'))
        document.body.append(script)


}

export default addRichResultSchema