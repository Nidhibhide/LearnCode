import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "./features/notificationSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationSlice,
    user: userReducer,
  },
});
