import { Form } from "react-router-dom";
const SignUp = () => {
  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary min-vh-100">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: "400px" }}>
        <Form method="POST">

          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating mb-2">
            <input
              type="text"
              name="name"
              className="form-control"
              id="floatingInput"
              placeholder="name"
            />
            <label htmlFor="floatingInput">Enter Name</label>
          </div>

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
            Sign Up
          </button>

          <p className="mt-5 mb-3 text-body-secondary text-center">
            © 2026
          </p>
        </Form>
      </main>
    </div>
  );
};

export default SignUp;

import axios from "axios"
import {redirect} from 'react-router-dom'

export const signupAction=async ({request})=>{
  const formData=await request.formData();

  const data={
    name:formData.get('name'),
    email:formData.get('email'),
    password:formData.get('password')
  }

  
  const res=await axios.post(
    "http://localhost:3002/api/auth/signup",
    data,
    {
      withCredentials:true
    }
  )
  localStorage.setItem(
    "user",
    JSON.stringify(res.data.user)
  )
  return redirect("/App/dashboard")
  
} 