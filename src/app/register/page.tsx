'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Loader2 } from 'lucide-react'

interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    setError('') // Reset error
    
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setError('Semua field wajib diisi')
      return false
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Format email tidak valid')
      return false
    }
    
    if (formData.password.length < 8) {
      setError('Password harus minimal 8 karakter')
      return false
    }
    
    if (formData.password !== formData.password_confirmation) {
      setError('Password dan konfirmasi password tidak cocok')
      return false
    }
    
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('https://simaru.amisbudi.cloud/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Penting untuk cookie management
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Handle error dari backend
        let errorMessage = data.message || 'Registrasi gagal'
        
        // Jika ada error validasi dari Laravel
        if (data.errors) {
          errorMessage = Object.values(data.errors)
            .flat()
            .join(', ')
        }
        
        throw new Error(errorMessage)
      }

      // Jika registrasi berhasil
      setSuccess('Registrasi berhasil! Anda akan dialihkan ke halaman login...')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: unknown) {
      let errorMessage = 'Terjadi kesalahan saat registrasi'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-teal-600">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-3xl">
        {/* Header dengan Logo */}
        <div className="mb-8 flex flex-col items-center space-y-2">
          <MapPin className="w-12 h-12 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Daftar Pengguna
            <span className="block text-center text-lg font-medium text-teal-600 mt-1">
              Buat akun untuk mengakses layanan
            </span>
          </h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Nama lengkap Anda"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="contoh@domain.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Masukkan password (min. 8 karakter)"
            />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Ulangi password Anda"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Masuk di sini
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