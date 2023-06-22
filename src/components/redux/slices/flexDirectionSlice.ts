import { createSlice } from '@reduxjs/toolkit'

function getDirection(): 'column' | 'row' {
    return window.innerHeight > window.innerWidth ? 'column' : 'row';
}

const initialState: { direction: 'column' | 'row' } = {direction: getDirection()}

const slice = createSlice({
    initialState,
    name: 'directionState',
    reducers: {
        setDirection: (state) => {
            state.direction = getDirection();
        }
    }
})

export const directionActions = slice.actions
export const directionReducer = slice.reducer