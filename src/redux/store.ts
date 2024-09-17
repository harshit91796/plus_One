import { configureStore } from '@reduxjs/toolkit'
<<<<<<< HEAD
import counterReducer from './counter/counterSlice'
import userReducer from './userSlice'
import loadingReducer from './loadingSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user:userReducer,
    loading:loadingReducer
=======
import userReducer from './user/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
>>>>>>> 4e5d155a2a3e1ba88bf7f5708577d76321dda0f9
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch