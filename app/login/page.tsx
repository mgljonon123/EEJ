"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Нэвтрэх
        </h1>
        <div className="space-y-4">
          <Link
            href="/login/doctor"
            className="block w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition text-center font-medium"
          >
            Эмчийн нэвтрэх
          </Link>
          <Link
            href="/login/superadmin"
            className="block w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition text-center font-medium"
          >
            Супер админы нэвтрэх
          </Link>
        </div>
      </div>
    </main>
  );
}
