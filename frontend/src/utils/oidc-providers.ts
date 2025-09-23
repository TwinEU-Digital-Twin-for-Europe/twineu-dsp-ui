import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { sleep } from './helpers';
import axios from 'axios';

declare const FB: any;



export const authLogin = async (email: string, password: string) => {

  try {
    delete axios.defaults.headers.common["Authorization"];
    const response = await axios.post('/user/auth', {
      username: email,
      password: password
    });
    localStorage.setItem(
      'authentication',
      JSON.stringify({ profile: { email: email } })
    );

    return response.data; 
  } catch (error : any) {
    console.error('Login failed:', error);
    throw new Error(error.response.data.message || 'Unknown error occurred');
  }
};

export const getAuthStatus = () => {
  return new Promise(async (res, rej) => {
    await sleep(500);
    try {
      let authentication = localStorage.getItem('authentication');
      if (authentication) {
        authentication = JSON.parse(authentication);
        return res(authentication);
      }
      return res(undefined);
    } catch (error) {
      return res(undefined);
    }
  });
};
