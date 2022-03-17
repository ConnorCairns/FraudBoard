export const initialState = {
    currDomain: {},
    currCategory: {},
    prevDomains: []
}

export const reducer = (state, action) => {
    switch(action.type){
        case 'updateCurrDomain':
            return {...state, currDomain: action.payload}
        case 'updateCurrCategory':
            return {...state, currCategory: action.payload}
        default:
            return state
    }
}