class Devices {

    constructor() {
        this.page = 0
        this.countPerPage = 5
        this.mapping = ["name", "room", "status", "tags"]
        this.model = new falcor.Model({source: new falcor.HttpDataSource('/model.json')});

        document.getElementById("next").addEventListener("click", this.next.bind(this))
        document.getElementById("back").addEventListener("click", this.back.bind(this))

        this.update()
    }

    async update() {
        const lenght = (await this.model.get("devices.length")).json.devices.length
        const get = await this.model.get(`devices[${this.page * this.countPerPage}..${(this.page+1) * this.countPerPage-1}]${JSON.stringify(this.mapping)}`)

        document.getElementById("back").disabled = this.page === 0
        document.getElementById("next").disabled = (this.page+1) * this.countPerPage >= lenght
        document.getElementById("page").innerText = (this.page + 1) + ""
        document.getElementById("pageCount").innerText = Math.ceil(lenght / this.countPerPage) + ""

        let body = document.getElementById("body")
        body.innerHTML = ""

        for(let i = this.page * this.countPerPage; i < (this.page+1) * this.countPerPage && i < lenght; i++) {
            let device = get.json.devices[i]
            device.tags = falcorToArray(device.tags).join(", ")
            let tr = document.createElement("tr")

            for(let m of this.mapping) {
                let td = document.createElement("td")
                td.appendChild(document.createTextNode(device[m]))
                tr.appendChild(td)
            }

            body.appendChild(tr)
        }
    }

    next() {
        this.page += 1
        this.update()
    }

    back() {
        this.page -= 1
        this.update()
    }

}

function falcorToArray(falcor) {
    let ret = []

    let i = 0
    while(i in falcor) {
        ret.push(falcor[i])
        i++
    }

    return ret
}

device = new Devices()