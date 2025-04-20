'use client'
import Link from "next/link";
import { MapPin, Layers, Search, BarChart, Users, Package } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-teal-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Wujudkan UMKM Tangguh Bersama
            <span className="block mt-2 text-teal-300">Sistem Geografis Kami</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Temukan, Pantau, dan Kembangkan UMKM dengan Dukungan Data Spasial Akurat
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-teal-400 hover:bg-teal-500 text-blue-900 font-bold px-8 py-3 rounded-lg transition">
              Daftar Sekarang
            </Link>
            <Link href="/login" className="border-2 border-teal-400 hover:bg-teal-400/20 text-white font-bold px-8 py-3 rounded-lg transition">
              Masuk Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Mengapa Memilih Sistem Kami?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MapPin className="w-8 h-8" />}
              title="Pemetaan UMKM Real-Time"
              description="Visualisasi sebaran UMKM terkini dengan integrasi data geospasial"
            />
            <FeatureCard
              icon={<Search className="w-8 h-8" />}
              title="Pencarian Cerdas"
              description="Temukan UMKM berdasarkan lokasi, kategori, atau produk"
            />
            <FeatureCard
              icon={<BarChart className="w-8 h-8" />}
              title="Analisis Data"
              description="Analisis perkembangan UMKM dengan dashboard interaktif"
            />
          </div>
        </div>
      </section>

      {/* Demo Peta */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Jelajahi UMKM di Wilayah Anda
          </h2>
          <div className="relative h-96 bg-gray-200 rounded-xl shadow-lg overflow-hidden">
            {/* Tempat untuk integrasi komponen peta */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">Peta Interaktif akan Ditampilkan di Sini</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <StatItem value="500+" label="UMKM Terdaftar" />
            <StatItem value="95%" label="Wilayah Tercover" />
            <StatItem value="24/7" label="Update Data Real-Time" />
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Kata Mereka yang Sudah Bergabung
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              name="Budi Santoso"
              role="Pemilik UMKM Kuliner"
              text="Sistem ini membantu saya menemukan lokasi strategis untuk cabang baru"
            />
            <TestimonialCard
              name="Admin Kecamatan"
              role="Admin Wilayah"
              text="Memudahkan pemantauan perkembangan UMKM di wilayah kami"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-teal-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Bergabunglah Sekarang dan Mulai Eksplorasi!
          </h2>
          <p className="mb-8 text-lg">
            Dapatkan akses penuh ke seluruh fitur dan manfaat sistem kami
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-white hover:bg-gray-100 text-teal-800 font-bold px-8 py-3 rounded-lg transition">
              Daftar Gratis
            </Link>
            <Link href="/login" className="border-2 border-white hover:bg-white/20 font-bold px-8 py-3 rounded-lg transition">
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Komponen Pendukung
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-teal-100 dark:bg-teal-800 rounded-lg">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="p-6">
    <div className="text-4xl font-bold mb-2">{value}</div>
    <div className="text-lg">{label}</div>
  </div>
);

const TestimonialCard = ({ name, role, text }: { 
  name: string;
  role: string;
  text: string;
}) => (
  <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg">
    <p className="text-gray-600 dark:text-gray-300 mb-4">"{text}"</p>
    <div className="font-bold dark:text-white">{name}</div>
    <div className="text-sm text-teal-600 dark:text-teal-400">{role}</div>
  </div>
);