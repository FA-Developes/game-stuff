import { buildForm, XHR, apiXHR } from "../Utils";
import {BehaviorSubject} from "rxjs";

export class User {
  name: string;
  email: string;
  isAdmin: boolean;
}

export const User$ = new BehaviorSubject<User>(null);
let login = buildForm(`<table>
  <tr><th>Email:</th><td><input type="email" name="email" required></td></tr>
  <tr><th>Password</th><td><input type="password" name="password" required></td></tr>
  <tr><th></th><td><button type="submit">Login</but--ton></td></tr>
</table>`,
  (data) => {
    apiXHR.post("auth/login", data)
      .then(r => {
        localStorage.setItem("jwt", JSON.stringify(r));
        tryAuth()
      })
  });
tryAuth();
function tryAuth() {
  let jwt = localStorage.getItem("jwt");

  if (jwt) {
    let parsed = JSON.parse(jwt);
    let expires = new Date(parsed.expires);
    if (expires > new Date()) {
      setTimeout(() => logout(), expires.getTime() - Date.now())
      apiXHR.headers["Authorization"] = "Bearer " + parsed.token;
      apiXHR.get("auth/user").then((e: User) => User$.next(e)).catch(e => console.error(e));
    } else {
      logout()
    }
  } else {
    logout()
  }
}

export function logout() {
  console.log("Logged out!")
  document.getElementById("auth").appendChild(login);
  localStorage.removeItem("jwt");
}


