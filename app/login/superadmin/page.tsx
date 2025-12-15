"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  // Prefill super admin credentials for quick login
  const [email, setEmail] = useState("b.tuguldur2015@gmail.com");
  const [password, setPassword] = useState("dragoonX12");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "SUPERADMIN" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Нэвтрэхэд алдаа гарлаа");
        return;
      }

      // Verify the user is actually a superadmin
      if (data.user && data.user.role !== "SUPERADMIN") {
        setError("Энэ эрх нь зөвхөн супер админд зориулсан");
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-800 text-sm mb-4 inline-block"
          >
            ← Буцах
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Супер админы нэвтрэх
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имэйл
            </label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Имэйл хаяг"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Нууц үг
            </label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Нууц үг"
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </button>
        </form>
      </div>
    </main>
  );
}
