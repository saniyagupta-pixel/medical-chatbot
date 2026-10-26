import { redirect } from "react-router-dom";
import api from "../api";

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!data.email || !data.password) {
    return { error: "Enter your email and password." };
  }

  try {
    const { data: response } = await api.post("/api/auth/login", data);
    localStorage.setItem("user", JSON.stringify(response.user));
    return redirect("/App/dashboard");
  } catch (error) {
    if (error.response?.status === 401) {
      return { error: "Email or password is incorrect." };
    }
    return {
      error:
        error.response?.data?.message ||
        "Unable to sign in right now. Please try again.",
    };
  }
};

export const signupAction = async ({ request }) => {
  const formData = await request.formData();
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!data.name || !data.email || !data.password) {
    return { error: "Enter your name, email, and password." };
  }
  if (data.password.length < 8) {
    return { error: "Your password must be at least 8 characters long." };
  }

  try {
    const { data: response } = await api.post("/api/auth/signup", data);
    localStorage.setItem("user", JSON.stringify(response.user));
    return redirect("/App/dashboard");
  } catch (error) {
    if (error.response?.status === 409) {
      return {
        error: "An account with this email already exists. Sign in instead.",
      };
    }
    return {
      error:
        error.response?.data?.message ||
        "Unable to create your account right now. Please try again.",
    };
  }
};
