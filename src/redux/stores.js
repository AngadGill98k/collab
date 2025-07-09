import { configureStore } from '@reduxjs/toolkit'
import { dostnameReducer } from './dostname/dostname'
export const store = configureStore({
  reducer: {
    dostname:dostnameReducer
  },
})