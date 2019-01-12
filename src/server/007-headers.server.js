export const init = (app) => {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "https://meva.thekingdave.com")
        res.header("Access-Control-Allow-Origin", "http://localhost:3000")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next()
    })
}