import { createContext, useContext, useReducer } from "react";

const ReducerContext = createContext()

export const useReducerContext = () => useContext(ReducerContext)

export const ReducerProvider = ({ children, initialState, reducer }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <ReducerContext.Provider value={[state, dispatch]}>
            { children }
        </ReducerContext.Provider>
    )
}