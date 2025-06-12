//Mensjajes de solicitudes http
export interface AuthResponse {
  body: {
    user: {
      username: string;
      name: string;
      id: string;
    },
    accessToken: string;
    refreshToken: string;
  }
}



export interface AuthResponseError {
    body: {
        error: string;
    }

}

export interface User {
    _id: string;
    name: string;
    username: string;
}