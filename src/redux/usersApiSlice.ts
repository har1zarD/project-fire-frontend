import { apiSlice } from 'src/redux/apiSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const USERS_URL = `${BASE_URL}/api/users`;

export const usersApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		register: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/register`,
				method: 'POST',
				body: data,
				credentials: 'include',
			}),
		}),
		login: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/login`,
				method: 'POST',
				body: data,
				credentials: 'include',
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: 'POST',
				credentials: 'include',
			}),
		}),
	}),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = usersApi;
