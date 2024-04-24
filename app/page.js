// pages/index.js
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Savitribai Phule Shikshan Prasarak Mandal's SKN Sinhgad College of Engineering, Pandharpur - Student Assure</title>
        <meta name="description" content="Student Assure - Feedback for College Students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 py-6">
          <div className='flex item-center gap-5'>
            <img src="/logoschool.jpeg" alt="Student Assure Logo" className="h-12" />
            <div>
            <h1 className="text-lg font-bold text-gray-800">Savitribai Phule Shikshan Prasarak Mandal's<br/>SKN Sinhgad College of Engineering, Pandharpur</h1>
           <p> At Post : Korti, Tal : Pandharpur, Dist : Solapur, Maharashtra 413304</p>
           </div>
          </div>
          <nav className="space-x-4">
            <Link href="#" className="text-gray-600 hover:text-blue-500">Home</Link>
            <Link href="/givefeedback/" className="text-gray-600 hover:text-blue-500">Feedback</Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section className="text-center my-12">
          <h1 className="text-5xl font-bold text-blue-500 mb-4">Empowering Students Through Feedback</h1>
          <p className="text-gray-600 text-lg mb-8">Share your experiences with theory and practical teaching.</p>
          <Link href="/givefeedback" ><button  className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 shadow-lg">Provide Feedback</button></Link>
        </section>

        <section className="text-center my-12">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">Welcome to Student Assure</h2>
          <p className="text-gray-600 text-lg mx-auto max-w-xl">
            We believe in the power of student feedback to drive improvement in education. Our platform connects college students with educators to create a better learning environment for everyone.
          </p>
        </section>
      </main>

      <footer className="bg-white py-6 mt-12">
        <div className="container mx-auto flex justify-between items-center px-4">
          <p className="text-gray-600">&copy; 2024 Student Assure</p>
        </div>
      </footer>
    </div>
  );
}
