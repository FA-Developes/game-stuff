import {buildForm,XHR,apiXHR} from "../Utils";

let login = buildForm(`<table>
  <tr><th>Email:</th><td><input type="email" name="email" required></td></tr>
  <tr><th>Password</th><td><input type="password" name="password" required></td></tr>
  <tr><th></th><td><button type="submit">Login</button></td></tr>
</table>`,(data) => {apiXHR.post("auth/login", data).then(r => console.log(r))});

document.getElementById("auth").appendChild(login);

