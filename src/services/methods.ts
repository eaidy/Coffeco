type Params = {
    key?: number;
    paramLabel?: string;
    authToken: string;
    method?: string;
    body?: Object;
}

const fetchData = async (Api: string, params: Params) => {

    let apiQuery = '',
        fetchUrl = 'https://api.coffeco.com.tr/ui/UIntegration/'

    if (params.key) {
        apiQuery = `${Api}?${params.paramLabel}=${params.key}`
        fetchUrl += apiQuery
        //console.log('Başarılı Query', fetchUrl)
    } else {
        fetchUrl += Api
        console.log(fetchUrl)
        //console.log('Başarılı Sabit Query', fetchUrl)
    }

    const fetchBuffer = await fetch(fetchUrl, {

        method: `${params.method}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${params.authToken}`
        },
        body: JSON.stringify(params.body)
    })
        .then((res) => {
            console.log(res)
            return res.json()
        })
        .then((body) => {
            console.log('fetchDatadan message --> ' + body.message)
            return body.data
        })
        .catch((err) => {
            console.log('fetchDatadan error --> ' + err)
        })

    return fetchBuffer
}


export { fetchData }