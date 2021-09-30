import { onValue, push }  from '../Functions/Firebase'
jest.mock('../Functions/Firebase')

/**
 * Mocks up onValue function with data passed as parameter
 * @param json read value from firebase
 * @returns null
 */
const firebaseMockUp = (json) => {

    const data = json
    
    const snapshot = { val: () => data }

    onValue.mockImplementation((ref, callback) => {

        callback(snapshot)
    
        return jest.fn()
    
    })

    push.mockImplementation(() => {
        
        return { key: 'dummy' }
    
    })

}

export { firebaseMockUp }