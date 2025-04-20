'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id: ''
  })
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const existingUsers: User[] = JSON.parse(
        localStorage.getItem('users') || 
        await fetch('/users.json').then(res => res.text())
      )

      if (existingUsers.some(user => user.email === formData.email)) {
        throw new Error('Email sudah terdaftar')
      }
      
      if (existingUsers.some(user => user.id === formData.id)) {
        throw new Error('ID sudah digunakan')
      }

      const newUser: User = {
        ...formData,
        role: 'MEMBER'
      }

      const updatedUsers = [...existingUsers, newUser]
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      router.push('/auth/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal melakukan registrasi')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-teal-600">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-3xl">
        {/* Header dengan Logo */}
        <div className="mb-8 flex flex-col items-center space-y-2">
          <MapPin className="w-12 h-12 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Daftar UMKM GIS
            <span className="block text-center text-lg font-medium text-teal-600 mt-1">
              Bergabung dengan Jaringan Kami
            </span>
          </h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama UMKM
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Nama usaha Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="contoh@umkm.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID UMKM
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Masukkan ID unik Anda"
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
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link 
              href="/auth/login" 
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Masuk disini
            </Link>
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