// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 py-6">
          <div className='flex item-center gap-5'>
            <img src="/logoschool.jpeg" alt="Student Assure Logo" className="h-8 sm:h-16" />
            <div>
            <h1 className="sm:text-lg text-xs font-bold text-gray-800">Savitribai Phule Shikshan Prasarak Mandal&#39;s<br/>SKN Sinhgad College of Engineering, Pandharpur</h1>
           <p className='hidden sm:block '> At Post : Korti, Tal : Pandharpur, Dist : Solapur, Maharashtra 413304</p>
           </div>
          </div>
          <nav className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-500 sm:text-lg text-sm" >Login</Link>
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
