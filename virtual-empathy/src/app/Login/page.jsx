'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../firebase/firebaseConfig';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in', user);
      router.push('/Dashboard');
    } catch (error) {
      console.error('Error logging in', error.message);  
    }
  };

  return (
    <>
    <Navbar />
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(brain.webp)' }}>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400">
        <div className="bg-white p-8 rounded-xl shadow-lg w-11/12 sm:w-96">
          <h2 className="text-center text-3xl text-pink-600 font-bold mb-6">Login</h2>
          <form>

            <Input
              type="email"  
              placeholder="Email"
              value={email}  
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <Button className="w-full bg-pink-600 text-white py-2 rounded-md" onClick={handleLogin}>
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
