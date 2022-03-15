export const unmarshall = (output) => {
    return output.map((item => {
        let newObj = {}

        for (var key in item) {
            newObj[key] = Object.values(item[key])[0]
        }

        return newObj

    }))
}