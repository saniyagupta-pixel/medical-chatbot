import { Form } from "react-router-dom";

const Login = () => {
  
  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary min-vh-100">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: "400px" }}>
        <Form method="POST">

          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating mb-2">
            <input
              type="email"
              name="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating mb-2">
            <input
              type="password"
              name="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign in
          </button>

          <p className="mt-5 mb-3 text-body-secondary text-center">
            © 2026
          </p>
        </Form>
      </main>
    </div>
  );
};

export default Login;

import axios from "axios";
import {redirect} from 'react-router-dom'

export const loginAction=async({request})=>{
  const formData=await request.formData();

  const data={
    email:formData.get('email'),
    password:formData.get('password')
  }

  try{
    const res=await axios.post(
      "https://medical-chatbot-1-4l2b.onrender.com/api/auth/login",
      data,
      {
        withCredentials:true //without this browser won’t save/send that cookie.
      }
    )
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    )
    return redirect("/App/dashboard")
  }
  catch(error){
  const status = error?.response?.status;

  if (status === 404) {
    return redirect("/signup");
  }

  if (status === 400) {
    return { error: "Incorrect credentials" };
  }

  return { error: "Server error" };
}
}