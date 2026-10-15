import { Form, Link, useActionData } from "react-router-dom";

const Login = () => {
  const actionData = useActionData();

  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary min-vh-100">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: "400px" }}>
        <Form method="POST">

          <h1 className="h3 mb-3 fw-normal">Sign in</h1>

          {actionData?.error && (
            <div className="alert alert-danger" role="alert">
              {actionData.error}
            </div>
          )}

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
              autoComplete="current-password"
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign in
          </button>

          <p className="mt-3 text-center">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>

          <p className="mt-5 mb-3 text-body-secondary text-center">
            © 2026
          </p>
        </Form>
      </main>
    </div>
  );
};

export default Login;