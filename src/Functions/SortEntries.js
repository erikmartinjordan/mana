/**
 * 
 * @param {array} entries Replies to sort in a [key, value] format
 * @param {string} value Parameter to sort the array from oldest to newest
 * @returns sorted array
 */
const sortByValue = (entries, value) => {

    return [...entries].sort((a, b) => {

        let first  = a[1][value] || 0
        let second = b[1][value] || 0

        return second > first ? 1 : second > first ? -1 : 0

    })

}

/**
 * 
 * @param {array} entries Replies to sort in a [key, value] format
 * @param {object} object Parameter to sort the array from highest to lowest (is an object to a single value) 
 * @returns sorted array in descending order
 */
const sortByObject = (entries, object) => {
    
    return [...entries].sort((a, b) => {

        let first  = Object.values(a[1][object] || {}).length
        let second = Object.values(b[1][object] || {}).length

        return second > first ? 1 : second < first ? -1 : 0
    
    })

}

export { sortByObject, sortByValue }