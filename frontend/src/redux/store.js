import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "./features/notificationSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationSlice,
  },
});
