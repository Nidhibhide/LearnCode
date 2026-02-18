import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
  unreadNotifications: [],
  readNotifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    setReadNotifications: (state, action) => {
      state.readNotifications = action.payload;
    },

    setMarkAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.unreadNotifications.find(
        (n) => n._id === notificationId
      );
      if (notification) {
        // Add to read notifications
        state.readNotifications = [notification, ...state.readNotifications];
        // Remove from unread
        state.unreadNotifications = state.unreadNotifications.filter(
          (n) => n._id !== notificationId
        );
        // Decrease count
        state.notificationCount = Math.max(0, state.notificationCount - 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notificationCount = 0;
      state.unreadNotifications = [];
      state.readNotifications = [];
    },
  },
});

export const {
  setUnreadNotifications,
  setReadNotifications,
  setMarkAsRead,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
