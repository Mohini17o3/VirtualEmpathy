'use client' ;
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAuth , signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useState  } from 'react';



const Navbar = () => {

  const [user , setUser] = useState(null) ; 
  const [opacity, setOpacity] = useState(1);

  useEffect(() => { 
    const userLogged = auth.onAuthStateChanged((user)=>{
      setUser(user);
    })

    // scroll 

const handleScroll  = () =>{
  const scrollPosition =  window.scrollY ;
  const opacity =  Math.max(1-scrollPosition /300 , 0.6) ;
  setOpacity(opacity) ;
}

window.addEventListener('scroll' , handleScroll) ;


    return () =>{ 
      window.removeEventListener('scroll'  , handleScroll);
      userLogged();}
  }  , []);


  const handleLogout = async () => {
    try  {
      await signOut(auth) ;

    } catch(error) {
      console.error('error logging out') ;
    }
  };

  


  return (
    <nav className="bg-transparent shadow-md sticky top-0 w-full z-50 transition-opacity duration-300 " style={{ opacity: opacity }} >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-pink-600">
              VirtualMate
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-gray-700 hover:text-pink-500">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-pink-500">
              About Us
            </a>
            <a href="#contact" className="text-gray-700 hover:text-pink-500">
              Contact
            </a>


            {user ?  (
              <Button className="bg-pink-500 text-white px-4 py-2 rounded-lg" onClick={handleLogout}>
               Log Out
            </Button>
            ) 
            
             : 

           (          
            <Link href="/SignUp">
            <Button className="bg-pink-500 text-white px-4 py-2 rounded-lg">
              Sign Up
            </Button>
            </Link>)
            
              }

     
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
