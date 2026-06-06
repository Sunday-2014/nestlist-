import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-green-800">Nest.list</h1>
      <p className="text-gray-500 mt-2">Rental property listings</p>
      <div className="mt-6 flex gap-4">
        <Link href="/browse" className="bg-green-800 text-white px-4 py-2 rounded">Browse listings</Link>
        <Link href="/register" className="border border-green-800 text-green-800 px-4 py-2 rounded">Register</Link>
        <Link href="/login" className="border border-green-800 text-green-800 px-4 py-2 rounded">Sign in</Link>
      </div>
    </main>
  )
}
