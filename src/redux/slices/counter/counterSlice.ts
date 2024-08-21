import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    initialState: 0,
    name: 'counter',
    reducers: {
        increment: (state) => {
           return state += 1
        },
        decrement: (state) => {
            if(state <= 0) return 0
           return state -= 1
        },
    },
})

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer