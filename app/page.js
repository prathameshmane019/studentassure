import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Savitribai Phule Shikshan Prasarak Mandal &#39; s SKN Sinhgad College of Engineering, Pandharpur - Student Assure</title>
        <meta name="description" content="Student Assure - Feedback for College Students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="bg-white min-h-screen">
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center px-4 py-6">
            <div className="flex items-center gap-5">
              <Image src="/logoschool.jpeg" height={100} width={100} alt="Student Assure Logo" className="h-12" />
              <div>
                <h1 className="sm:text-lg text-xs font-bold text-gray-800">
                  Savitribai Phule Shikshan Prasarak Mandal &#39;s<br />
                  SKN Sinhgad College of Engineering, Pandharpur
                </h1>
                <p className="hidden sm:block text-sm text-gray-600">At Post : Korti, Tal : Pandharpur, Dist : Solapur, Maharashtra 413304</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/login" legacyBehavior>
                <a>
                  <button>
                    Login
                  </button>
                </a>
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <h2 className="text-4xl font-bold text-blue-500 mb-12 text-center">Welcome to Student Assure</h2>
          
          <section className="flex flex-col md:flex-row justify-between items-center my-12 gap-8">
            <div className="w-full md:w-1/2">
              <Image src="/home.jpg" width={600} height={600} alt="Student Assure Logo" className="rounded-lg shadow-md" />
            </div>
            <div className="w-full md:w-1/2 text-left">
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-xl">
                At Student Assure, we believe in the power of student feedback to drive improvement in education. Our platform connects college students with educators, fostering a collaborative environment that enhances the learning experience for everyone involved.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-xl">
                By providing a space for open communication and constructive feedback, we aim to create a more responsive and effective educational system that truly meets the needs of students and faculty alike.
              </p>
              <Link href="/givefeedback" legacyBehavior>
                <a className="inline-block">
                  <button className="custom-button">
                    <span>Provide Feedback</span>
                    <div className="star-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" style={{position: 'absolute', top: '20%', left: '20%', width: '25px'}}><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></svg>
                    </div>
                    <div className="star-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" style={{position: 'absolute', top: '45%', left: '45%', width: '15px'}}><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></svg>
                    </div>
                    <div className="star-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" style={{position: 'absolute', top: '40%', left: '40%', width: '5px'}}><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></svg>
                    </div>
                    <div className="star-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" style={{position: 'absolute', top: '20%', left: '40%', width: '8px'}}><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></svg>
                    </div>
                    <div className="star-5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" style={{position: 'absolute', top: '25%', left: '45%', width: '15px'}}><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></svg>
                    </div>
                    <div className="star-6">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" style={{position: 'absolute', top: '5%', left: '50%', width: '5px'}}><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></svg>
                    </div>
                  </button>
                </a>
              </Link>
            </div>
          </section>
        </main>

        <footer className="bg-white shadow-md py-6">
          <div className="container mx-auto text-center">
            <p className="text-gray-600 mb-4">&copy; {new Date().getFullYear()} UnityTech Solutions. All rights reserved.</p>
           
          </div>
        </footer>
      </div>
    </>
  );
}
