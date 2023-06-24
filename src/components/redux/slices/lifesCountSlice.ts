import { createSlice } from '@reduxjs/toolkit'

const initialState: { count: number } = { count: 1 }

const slice = createSlice({
    initialState,
    name: 'countState',
    // reducer - функция, которая определяет, каким образом состояние будет обновлено
    reducers: {
        setCount: (state, data) => {
            state.count = data.payload as number;
        }
    }
})

export const countActions = slice.actions
export const countReducer = slice.reducer