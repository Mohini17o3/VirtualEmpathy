'use client';
import React from 'react';
import Navbar from './components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen bg-gradient-to-r from-pink-200 via-pink-300 via-pink-400 to-pink-500 flex items-center justify-center text-center text-white relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('brain.webp')" }}
        ></div>
        <motion.div
          className="relative z-10 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl text-white font-extrabold mb-4"
            variants={fadeInUp}
            transition={{ duration: 1.2 }}
          >
            Your Mental Health Companion
          </motion.h1>
          <motion.p
            className="text-3xl mb-8 text-pink-700"
            variants={fadeInUp}
            transition={{ duration: 1.4 }}
          >
            A safe space to talk, listen, and heal with AI-powered assistance.
          </motion.p>
          <Link href="/SignUp">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-pink-700 text-white py-3 px-8 rounded-full text-lg">
                Get Started
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white h-screen">
        <motion.div
          className="max-w-7xl mx-auto px-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2
            className="text-6xl font-bold text-pink-600 mb-12"
            variants={fadeInUp}
          >
            Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: '24/7 Availability',
                description:
                  'Our chatbot is available anytime you need a friendly ear or support.',
                image: 'image1.jpg',
              },
              {
                title: 'Emotion Detection',
                description:
                  'Our AI listens actively and adapts to your emotional needs.',
                image: 'image2.webp',
              },
              {
                title: 'Confidential Conversations',
                description:
                  'Your privacy is a top priority. Feel comfortable knowing your data is secure.',
                image: 'image3.jpg',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-pink-200 rounded-xl shadow-lg"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 object-cover rounded-t-xl mb-4"
                />
                <h3 className="text-2xl font-semibold text-pink-600 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="py-16 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 "
      >
        <motion.div
          className="max-w-7xl mx-auto px-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-6xl font-bold text-pink-600 mb-12">About Us</h2>
          <p className="text-2xl text-white mb-8">
            VirtualMate was created with the goal of providing accessible mental
            health support to everyone. Whether you're feeling anxious, stressed,
            or just need someone to talk to, our AI-driven chatbot is here for
            you. No judgments, no stigma, just a place to heal.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400">
        <motion.div
          className="max-w-7xl mx-auto px-6 text-center "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-6xl font-bold text-pink-600 mb-12">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Have any questions? We’re here to help! Reach out to us for any
            inquiries or feedback.
          </p>
          <motion.form
            className="max-w-4xl mx-auto space-y-6"
            variants={stagger}
          >
            <motion.input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-md"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-md"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md"
              whileFocus={{ scale: 1.02 }}
            ></motion.textarea>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button className="w-full bg-pink-400 text-white py-3 rounded-md">
                Send Message
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-pink-400 text-white text-center py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p>&copy; 2024 VirtualMate. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}
