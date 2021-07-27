export const reducer = (state, action) => {
    switch (action.type){
        case "Fetch_Start":
            return {...state, isFetchingData: true, purchases: [], error: ''}
        case "Fetch_Success":
            return {...state, isFetchingData: false, purchases: action.payload}
        case "Fetch_Error":
            return {...state, isFetchingData: false, error: action.payload}
        default: return state
    }
}