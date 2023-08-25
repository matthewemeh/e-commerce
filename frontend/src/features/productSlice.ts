import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../interfaces';

// app api
import appApi from '../services/appApi';

const initialState: Product[] = [];

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateProducts: (_, action) => action.payload,
  },
  extraReducers: builder => {
    builder.addMatcher(appApi.endpoints.createProduct.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.updateProduct.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.deleteProduct.matchFulfilled, (_, { payload }) => payload);
  },
});

export const { updateProducts } = productSlice.actions;
export default productSlice.reducer;
