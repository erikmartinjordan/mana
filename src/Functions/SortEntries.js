const sortByValue = (entries, value) => {

    return [...entries].sort((a, b) => {

        let first  = a[1][value] || 0
        let second = b[1][value] || 0

        return second > first ? 1 : second > first ? -1 : 0

    })

}

const sortByObject = (entries, object) => {
    
    return [...entries].sort((a, b) => {

        let first  = Object.values(a[1][object] || {}).length
        let second = Object.values(b[1][object] || {}).length

        return second > first ? 1 : second < first ? -1 : 0
    
    })

}

export { sortByObject, sortByValue }