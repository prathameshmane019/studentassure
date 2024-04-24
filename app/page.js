// pages/index.js

import Head from 'next/head';

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Student Assure</title>
        <meta name="description" content="Student Assure - Feedback for College Students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 py-6">
          <img src="/logo.png" alt="Student Assure Logo" className="h-12" />
          <nav className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-500">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-500">Feedback</a>
            <a href="#" className="text-gray-600 hover:text-blue-500">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-500">Contact</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section className="text-center my-12">
          <h1 className="text-5xl font-bold text-blue-500 mb-4">Empowering Students Through Feedback</h1>
          <p className="text-gray-600 text-lg mb-8">Share your experiences with theory and practical teaching.</p>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 shadow-lg">Provide Feedback</button>
        </section>

        <section className="text-center my-12">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">Welcome to  Student Assure</h2>
          <p className="text-gray-600 text-lg mx-auto max-w-xl">
            We believe in the power of student feedback to drive improvement in education. Our platform connects college students with educators to create a better learning environment for everyone.
          </p>
        </section>
      </main>

      <footer className="bg-white py-6 mt-12">
        <div className="container mx-auto flex justify-between items-center px-4">
          <p className="text-gray-600">&copy; 2024 Student Assure</p>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-500 hover:text-blue-600">Facebook</a>
            <a href="#" className="text-blue-500 hover:text-blue-600">Twitter</a>
            <a href="#" className="text-blue-500 hover:text-blue-600">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

