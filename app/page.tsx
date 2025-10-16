import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        Hodges & Fooshee Realty
      </h1>
      <p className="text-xl mb-8 text-center">
        Premier MLS Search Platform
      </p>
      <div className="flex gap-4">
        <Link
          href="/search"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search Properties
        </Link>
        <Link
          href="/api/member"
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Find Agents
        </Link>
      </div>
    </main>
  )
}
