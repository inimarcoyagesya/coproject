'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from "lucide-react"; // Import icon


interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const users: User[] = JSON.parse(
        localStorage.getItem('users') || 
        await fetch('/users.json').then(res => res.text())
      )
      const user = users.find(u => 
        u.email === email && u.id === password
      )
  
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
        router.push('/dashboard')
      } else {
        throw new Error('Kombinasi email dan ID salah')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-teal-600">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-3xl">
        {/* Header dengan Logo */}
        <div className="mb-8 flex flex-col items-center space-y-2">
          <MapPin className="w-12 h-12 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            UMKM GIS
            <span className="block text-center text-lg font-medium text-teal-600 mt-1">
              Sistem Informasi Geografis UMKM
            </span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="contoh@umkm.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Pengguna
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Masukkan ID Anda"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Masuk ke Sistem
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Lupa ID?{' '}
            <button className="text-teal-600 hover:text-teal-800 font-medium">
              Hubungi Admin
            </button>
          </p>
          <Link 
    href="/" 
    className="inline-block mt-4 text-sm text-gray-600 hover:text-teal-700 font-medium underline transition-all"
  >
    ← Kembali ke Halaman Utama
  </Link>
        </div>
      </div>
    </div>
  )
}