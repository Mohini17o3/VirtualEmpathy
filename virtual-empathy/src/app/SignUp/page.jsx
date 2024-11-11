'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');


  const router =  useRouter() ;


  const handleSignUp = async(e) => {
   e.preventDefault() ;
    try { 
      const userCredential = await createUserWithEmailAndPassword(auth , email , password);
      const user = userCredential.user ;
      console.log('user created : ' , user);

      router.push('/Login');
    }catch(error){
      console.error('Oops , error signing up' ,  error.message)
    }
   

    console.log('Signing up with', name, age, email, username, password);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">

      <div className="w-full lg:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: 'url(brain.webp)' }}>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400">
        <div className="bg-white p-8 rounded-xl shadow-lg w-11/12 sm:w-96 relative z-10">
          <h2 className="text-center text-3xl text-pink-600 font-bold mb-6">Sign Up</h2>
          <form>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
              required
            />
            <Button className="w-full bg-pink-600 text-white py-2 rounded-md" onClick={handleSignUp}>
              Sign Up
            </Button>
          </form>

         
          <p>
  Already a user?{' '}
  <Link href='/Login' className="text-pink-600 hover:underline">
    Login here
  </Link>
</p>
        
        
          
      </div>
      </div>
    </div>
  );
};

export default SignUp;
