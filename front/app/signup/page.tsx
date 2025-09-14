"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    if (!res.ok) throw new Error("Signup failed")
    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!loginRes.ok) throw new Error("Auto login failed")
    const tokens = await loginRes.json()

    localStorage.setItem("access", tokens.access)
    localStorage.setItem("refresh", tokens.refresh)

    router.push("/products")
  } catch (err: any) {
    setError(err.message)
  }
}


  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Sign Up</h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-lg border p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>The password should be a minimum of 6 characters.</p>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary p-2 text-primary-foreground"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}
