import ClientPage from './components/ClientPage';

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Nieuws</h1>
        <ClientPage />
      </main>
    </div>
  );
}
