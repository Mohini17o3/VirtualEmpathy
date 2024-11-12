import React from 'react';
import Navbar from './components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* Hero Section with Updated Colors */}
      <section className="h-screen bg-gradient-to-r from-pink-300 via-pink-400 via-pink-500 to-pink-600 flex items-center justify-center text-center text-white relative">
  <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('brain.webp')" }}></div>
  <div className="relative z-10 px-4 sm:px-6 lg:px-8">
    <h1 className="text-6xl text-white font-extrabold mb-4">Your Mental Health Companion</h1>
    <p className="text-3xl mb-8 text-pink-700 ">A safe space to talk, listen, and heal with AI-powered assistance.</p>
    <Link href="/SignUp">
    <Button className="bg-pink-700 text-white py-3 px-8 rounded-full text-lg">
      Get Started
    </Button>
    </Link>
  </div>
</section>


<section id="features" className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold text-pink-600 mb-12">Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="p-6 bg-pink-200 rounded-xl shadow-lg">
        <img
          src="image1.jpg"
          alt="24/7 Availability"
          className="w-full h-48 object-cover rounded-t-xl mb-4"
        />
        <h3 className="text-2xl font-semibold text-pink-600 mb-4">24/7 Availability</h3>
        <p className="text-gray-700">Our chatbot is available anytime you need a friendly ear or support.</p>
      </div>
      <div className="p-6 bg-pink-200 rounded-xl shadow-lg">
        <img
          src="image2.webp"
          alt="Emotion Detection"
          className="w-full h-48 object-cover rounded-t-xl mb-4"
        />
        <h3 className="text-2xl font-semibold text-pink-600 mb-4">Emotion Detection</h3>
        <p className="text-gray-700">Our AI listens actively and adapts to your emotional needs, offering personalized responses.</p>
      </div>
      <div className="p-6 bg-pink-200 rounded-xl shadow-lg">
        <img
          src="image3.jpg"
          alt="Confidential Conversations"
          className="w-full h-48 object-cover rounded-t-xl mb-4"
        />
        <h3 className="text-2xl font-semibold text-pink-600 mb-4">Confidential Conversations</h3>
        <p className="text-gray-700">Your privacy is a top priority. Feel comfortable knowing your data is secure.</p>
      </div>
    </div>
  </div>
</section>



      {/* About Us Section with Light Pink Background */}
      <section id="about" className="py-16  bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 ">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-pink-600 mb-12">About Us</h2>
          <p className="text-lg text-white mb-8">
            VirtualMate was created with the goal of providing accessible mental health support to everyone. Whether you're feeling anxious, stressed, or just need someone to talk to, our AI-driven chatbot is here for you. No judgments, no stigma, just a place to heal.
          </p>
        </div>
      </section>

      {/* Contact Section with Visual Enhancement */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-pink-600 mb-12">Get in Touch</h2>
          <p className="text-lg text-gray-700 mb-8">
            Have any questions? We’re here to help! Reach out to us for any inquiries or feedback.
          </p>
          <form className="max-w-4xl mx-auto space-y-6">
            {/* ShadCN Input Components */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md"
            ></textarea>
            <Button className="w-full bg-pink-400 text-white py-3 rounded-md">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Footer with Branding and Branding Color */}
      <footer className="bg-pink-400 text-white text-center py-6">
        <p>&copy; 2024 VirtualMate. All rights reserved.</p>
      </footer>
    </div>
  );
}
