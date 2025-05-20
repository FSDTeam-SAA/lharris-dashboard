"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    // Store the access token in a cookie (not refresh token)
    const cookieStore = cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    // Optional: Store minimal user info in a cookie (non-httpOnly so accessible in client)
    const { _id, fullname, email, role } = data.data.user;
    cookieStore.set("user", JSON.stringify({ _id, fullname, email, role }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
    });

    return {
      success: true,
      data: data.data,
      token: data.token,
    };
  } catch (error) {
    // console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
      error,
    };
  }
}

export async function verifyCode(code: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/verify-registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Verification failed",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    // console.error("Verification error:", error);
    return {
      success: false,
      message: "An error occurred during verification",
      error,
    };
  }
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete("token");
  cookieStore.delete("user");
  cookieStore.delete("refreshToken"); // if you're using it
}
