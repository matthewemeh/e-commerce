import { createSlice } from '@reduxjs/toolkit';

// app api
import appApi from '../services/appApi';
import { GlobalState, Notification } from '../interfaces';

const initialState = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => initialState,
    addNotification: (state: GlobalState | null, action) => {
      if (state) {
        const newNotification = action.payload as Notification;
        state.notifications?.unshift(newNotification);
      }
    },
    resetNotifications: (state: GlobalState | null) => {
      if (state) {
        state.notifications?.forEach((notification: Notification) => {
          notification.status = 'read';
        });
      }
    },
  },
  extraReducers: builder => {
    /* 
        these are backend routes(endpoints) which when fufilled,
        return payloads that update User object globally 
    */
    builder.addMatcher(appApi.endpoints.signup.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.login.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.addToCart.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.removeFromCart.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.createOrder.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(
      appApi.endpoints.increaseCartProduct.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.decreaseCartProduct.matchFulfilled,
      (_, { payload }) => payload
    );
  },
});

export const { logout, addNotification, resetNotifications } = userSlice.actions;
export default userSlice.reducer;
