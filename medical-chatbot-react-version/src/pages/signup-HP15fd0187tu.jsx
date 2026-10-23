import { Form, Link, useActionData } from "react-router-dom";
const SignUp = () => {
  const actionData = useActionData();

  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary min-vh-100">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: "400px" }}>
        <Form method="POST">

          <h1 className="h3 mb-3 fw-normal">Create your account</h1>

          {actionData?.error && (
            <div className="alert alert-danger" role="alert">
              {actionData.error}
            </div>
          )}

          <div className="form-floating mb-2">
            <input
              type="text"
              name="name"
              className="form-control"
              id="floatingInput"
              placeholder="name"
              autoComplete="name"
              required
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
              autoComplete="email"
              required
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
              autoComplete="new-password"
              minLength={8}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign Up
          </button>

          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="mt-5 mb-3 text-body-secondary text-center">
            © 2026
          </p>
        </Form>
      </main>
    </div>
  );
};

export default SignUp;