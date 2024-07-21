import axios from "axios";
import API_URL from "./Unify_API/API_URL";

axios.defaults.withCredentials = true;

class AuthService {
  async login(user) {
    return axios
      .post(API_URL + "/signin", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  async oauth2() {
    return axios
      .get(API_URL + "/oauth2/redirect", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  async logout() {
    try {
      const response = await axios.post(API_URL + "/signout");
      if (response.data.message) {
        console.log(response.data.message);
      }
      localStorage.removeItem("user");
      location.reload(true);
    } catch (error) {
      console.error("Logout failed：", error);
    }
  }

  register(formData) {
    return axios.post(API_URL + "/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  checkAuth() {
    return axios.get(API_URL + "/checkAuth");
  }
}

export default new AuthService();
