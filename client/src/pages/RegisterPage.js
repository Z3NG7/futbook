// src/pages/RegisterPage.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.js";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { toast } from "sonner";

export function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({ fullName, username, email, password });
      // Optional: auto-login
      await login(email, password);
      toast.success("Account created!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/95 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create FutBook Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Sign up"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
