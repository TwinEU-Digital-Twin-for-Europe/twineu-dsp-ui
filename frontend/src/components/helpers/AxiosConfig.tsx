import axios from 'axios';
import { setAuthentication } from '@app/store/reducers/auth';
import store from '@app/store/store';

const unsetGlobalHeader = () => {
  if (localStorage.getItem("token") == null) {
    axiosWithInterceptorInstance.defaults.headers.common["Authorization"] = null;
  }
}

const axiosWithInterceptorInstance = axios.create({
  baseURL: (window as any)["env"]["apiUrl"],
});

axiosWithInterceptorInstance.interceptors.response.use((response) => response, (error) => {
  console.log("Inside the interceptor", error)
  if (error.response.status === 401) {
    console.error('Unauthorized: You need to login!');
    store.dispatch(setAuthentication(undefined));
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('authentication');
    unsetGlobalHeader();
    window.location.href = 'login';
    
  }
  if (error.response.status === 500) {
    throw new Error("failed the axios request");
    
  }
  
});

export default axiosWithInterceptorInstance;