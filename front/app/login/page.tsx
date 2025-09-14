"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error("Invalid credentials")
    const data = await res.json()

    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)

    window.dispatchEvent(new Event("storage"))

      router.push("/products")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Sign In</h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-lg border p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary p-2 text-primary-foreground"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}
