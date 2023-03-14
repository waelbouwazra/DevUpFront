import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    GOOGLE_LOGIN_SUCCESS,
    GOOGLE_LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,UPDATE_USER_SUCCESS,UPDATE_USER_FAIL
  } from "./types";
  
import axios from "axios";





  const loginFunction= (username, password) => {
    return axios.post(`/api/auth/signin`, {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
  
        return response.data;
      });
  };
  
  const logoutFunction = () => {
    localStorage.removeItem("user");
  };
  const updateFunction =(user)=>{

   return axios.put(`/modifyProfile/${user.id}`,user, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then((response) => {
      console.log("response de modif "+response)
      if (response.data.accessToken) {
        console.log(response.data.accessToken)
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
  }
const googleLoginFunction= (accessToken) => {
  return axios.post(`/api/auth/googleSignin`, {
      accessToken
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      console.log("google login data returned in loginfunction  : ",response.data)

    return response.data;
  });
};

const googleSignupFunction= (accessToken) => {
  return axios.post(`/api/auth/googleSignup`, {
    accessToken
  })
  .then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    console.log("google Signup data returned in Signupfunction  : ",response.data)

    return response.data;
  });
};

  export const login = (username, password) => (dispatch) => {
    return loginFunction(username, password).then(
      (data) => {

        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
  
        return Promise.resolve(data);
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch({
          type: LOGIN_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject(message);
      }
    );
  };
  
  export const logout = () => (dispatch) => {

    logoutFunction();
    dispatch({
      type: LOGOUT,
    });


  };
  export const modifyUser = (user)=> (dispatch,getState) =>{
    const currentUser = getState().auth.user;

    return updateFunction(user).then(
      (data) => {

        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: { user: data },
        });

        return Promise.resolve(data);
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch({
          type: UPDATE_USER_FAIL,
          payload: { user: currentUser },

        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject(message);
      }
    );
  }


export const loginGoogle = (accessToken) => (dispatch) => {
  return googleLoginFunction(accessToken).then(
      (data) => {
        console.log('Google Login success ! : ', data);

        dispatch({
          type: GOOGLE_LOGIN_SUCCESS,
          payload: { user: data },
        });
        return Promise.resolve(data);

      },
      (error) => {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();

        dispatch({
          type: GOOGLE_LOGIN_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        console.log(error)

        return Promise.reject(message);
      }
  );
};


export const signupGoogle = (accessToken) => (dispatch) => {
  return googleSignupFunction(accessToken)
  .then(
      (data) => {
        console.log('Google Signup success !', data);

        dispatch({
          type: GOOGLE_LOGIN_SUCCESS,
          payload: { user: data },
        });
        return Promise.resolve(data);

      },
      (error) => {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();

        dispatch({
          type: GOOGLE_LOGIN_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        console.log(error)

        return Promise.reject(message);
      }
  );
};
export default {
    login,
    logout,
    loginGoogle,
    signupGoogle,
    modifyUser
  };