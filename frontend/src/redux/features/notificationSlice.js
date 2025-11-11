import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
  notifications: [],
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setMarkasRead: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
      state.notificationCount = state.notificationCount - 1;
    },
  },
});

export const { setNotificationCount, setNotifications, setMarkasRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
