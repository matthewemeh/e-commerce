import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cart, ResultInfo } from '../interfaces';

// create the createApi
export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: builder => ({
    signup: builder.mutation({
      query: (user: { name: string; email: string; password: string }) => ({
        url: '/users/signup',
        method: 'POST',
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (user: { email: string; password: string }) => ({
        url: '/users/login',
        method: 'POST',
        body: user,
      }),
    }),
    createProduct: builder.mutation({
      query: (product: {
        name: string;
        price: string;
        category: string;
        description: string;
        images: ResultInfo[];
      }) => ({ url: '/products', method: 'POST', body: product }),
    }),
    deleteProduct: builder.mutation({
      query: (body: { productID: string; userID: string }) => ({
        url: `/products/${body.productID}`,
        body: { userID: body.userID },
        method: 'DELETE',
      }),
    }),
    updateProduct: builder.mutation({
      query: (product: {
        id: string;
        name: string;
        price: string;
        category: string;
        description: string;
        images: ResultInfo[];
      }) => ({
        url: `/products/${product.id}`,
        body: product,
        method: 'PATCH',
      }),
    }),
    addToCart: builder.mutation({
      query: (cartInfo: { userID: string; productID: string; price: string }) => ({
        url: '/products/add-to-cart',
        body: cartInfo,
        method: 'POST',
      }),
    }),
    removeFromCart: builder.mutation({
      query: (body: { userID: string; productID: string; price: string }) => ({
        url: '/products/remove-from-cart',
        method: 'POST',
        body,
      }),
    }),
    increaseCartProduct: builder.mutation({
      query: (body: { userID: string; productID: string; price: string }) => ({
        url: '/products/increase-cart',
        method: 'POST',
        body,
      }),
    }),
    decreaseCartProduct: builder.mutation({
      query: (body: { userID: string; productID: string; price: string }) => ({
        url: '/products/decrease-cart',
        method: 'POST',
        body,
      }),
    }),
    createOrder: builder.mutation({
      query: (body: { userID: string; cart: Cart; address: string; country: string }) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useAddToCartMutation,
  useCreateOrderMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useRemoveFromCartMutation,
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
} = appApi;

export default appApi;
