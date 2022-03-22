export const initialState = {
    currDomain: {},
    currCategory: {},
    allCategory: {},
    prevDomains: []
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'updateCurrDomain':
            return { ...state, currDomain: action.payload }
        case 'updateCurrCategory':
            return { ...state, currCategory: action.payload }
        case 'updateAllCategory':
            return { ...state, allCategory: action.payload }
        case 'updateDomainHistory': {
            let newList = state.prevDomains.length < 5 ? state.prevDomains : state.prevDomains.slice(1)
            const idx = newList.indexOf(action.payload)
            if (idx > -1) newList.splice(idx, 1)
            newList.push(action.payload)
            localStorage.setItem("prevDomains", JSON.stringify(newList))
            return { ...state, prevDomains: newList }
        }
        case 'loadPrevDomains':
            return { ...state, prevDomains: action.payload }
        default:
            return state
    }
}