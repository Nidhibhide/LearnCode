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
      state.notificationCount = action.payload.length;
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
    // Filter out "Complete Your Profile" notification from both unread and read arrays
    filterProfileNotification: (state) => {
      state.unreadNotifications = state.unreadNotifications.filter(
        (n) => n.title !== "Complete Your Profile"
      );
      state.readNotifications = state.readNotifications.filter(
        (n) => n.title !== "Complete Your Profile"
      );
      // Recalculate count
      state.notificationCount = state.unreadNotifications.length;
    },
  },
});

export const {
  setUnreadNotifications,
  setReadNotifications,
  setMarkAsRead,
  clearAllNotifications,
  filterProfileNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
