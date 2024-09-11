import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface userState {
  value: object
}

const initialState: userState = {
  value: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    newUser: (state, action: PayloadAction<string>) => {
      state.value= action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { newUser } = userSlice.actions

export default userSlice.reducer