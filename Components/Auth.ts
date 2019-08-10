import {buildForm,XHR,apiXHR} from "../Utils";

let login = buildForm(`<table>
  <tr><th>Email:</th><td><input type="email" name="email" required></td></tr>
  <tr><th>Password</th><td><input type="password" name="password" required></td></tr>
  <tr><th></th><td><button type="submit">Login</button></td></tr>
</table>`,(data) => {apiXHR.post("auth/login", data).then(r => console.log(r))});

function tryAuth() {
  let jwt = localStorage.getItem("jwt");

  if(jwt) {
    let parsed = JSON.parse(jwt);
    let expires = new Date(parsed.expires);
    if(expires > new Date()) {
      setTimeout(() => logout(), expires.getTime() - Date.now())
      
    } else {
      logout()
    }
  } else {
    logout()
  }
}

export function logout() {
  document.getElementById("auth").appendChild(login);
  localStorage.removeItem("jwt");
}


