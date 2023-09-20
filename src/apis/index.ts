import axios from 'axios';
import { Configuration, AuthorApi, CategoryApi, PublisherApi, BookApi, OrderApi } from './client-axios';

const config = new Configuration({
  basePath: process.env.REACT_APP_API_URL,
  accessToken: localStorage.getItem('token') || undefined,
});
export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const path = window.location.pathname.split('/');
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      if (path[1] == 'admin') window.location.href = '/admin/signin';
      else window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

const authorApi = new AuthorApi(config, undefined, axiosInstance);
const categoryApi = new CategoryApi(config, undefined, axiosInstance);
const publisherApi = new PublisherApi(config, undefined, axiosInstance);
const bookApi = new BookApi(config, undefined, axiosInstance);
const orderApi = new OrderApi(config, undefined, axiosInstance);

export { authorApi, categoryApi, publisherApi, bookApi, orderApi };
