type Params = {
    key?: number;
    paramLabel?: string;
    authToken: string;
    method?: string;
}

const fetchData = async (Api: string, params: Params) => {

    let apiQuery = '',
        fetchUrl = 'https://api.entegre.pro/ui/UIntegration/'

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
            "Authentiaction": `Bearer ${params.authToken}`
        }
    })
        .then((res) => {
            //console.log(res)
            return res.json()
        })
        .then((body) => {
            console.log(body.message)
            return body.data
        })
        .catch((err) => {
            console.log(err)
        })

    return fetchBuffer
}


export { fetchData }