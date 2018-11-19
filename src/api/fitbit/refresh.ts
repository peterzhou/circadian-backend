import * as querystring from 'querystring';
import axios from 'axios';
import { base64Hash } from '../../utils';

export const refreshToken = async (
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiration: string;
}> => {
  return new Promise<{
    accessToken: string;
    refreshToken: string;
    expiration: string;
  }>((resolve, reject) => {
    axios({
      method: "post",
      url:
        "https://api.fitbit.com/oauth2/token?" +
        querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          redirect_uri: "http://localhost:3000/auth/fitbit"
        }),
      data: {},
      headers: {
        Authorization: `Basic ${base64Hash(
          `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
        )}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(response => {
        let expirationDate = new Date();
        expirationDate.setSeconds(
          expirationDate.getSeconds() + response.data.expires_in
        );
        resolve({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          expiration: expirationDate.toISOString()
        });
      })
      .catch(error => {
        console.log(error.response.data.errors);
        reject("Error fetching refresh token");
      });
  });
};
