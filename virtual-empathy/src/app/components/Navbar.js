'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogOverlay } from '@/components/ui/dialog'; // Ensure these imports are correct

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [happinessScore, setHappinessScore] = useState(null);
  const [showLoginReminder, setShowLoginReminder] = useState(false);

  useEffect(() => {
    const userLogged = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Scroll effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const opacity = Math.max(1 - scrollPosition / 300, 0.6);
      setOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      userLogged();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out');
    }
  };

  // Fetch happiness score
  const fetchHappinessScore = async () => {
    if (user) {
      try {
        const response = await fetch('http://localhost:5001/happiness');
        const data = await response.json();
        setHappinessScore(data.happiness_score);
      } catch (error) {
        console.error("Error fetching happiness score:", error);
      }
    } else {
      setShowLoginReminder(true); // Show reminder modal if not logged in
    }
  };

  return (
    <nav className="bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 shadow-md sticky top-0 w-full z-50 transition-opacity duration-300" style={{ opacity: opacity }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-pink-600">
              VirtualMate
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-pink-500">Home</Link>
            <a href="#features" className="text-gray-700 hover:text-pink-500">Features</a>
            <a href="#about" className="text-gray-700 hover:text-pink-500">About Us</a>
            <a href="#contact" className="text-gray-700 hover:text-pink-500">Contact</a>

            <button onClick={fetchHappinessScore} className="p-3 bg-pink-600 rounded-full text-white shadow-md hover:bg-pink-500 transition" title="Check Happiness Score">
              😊
            </button>

            {happinessScore !== null && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-pink-600">Your Happiness Score</h2>
                  <p className="mt-4 text-lg">{happinessScore}% Positive</p>
                  <progress className="w-full mt-2" value={happinessScore} max="100"></progress>
                  <button onClick={() => setHappinessScore(null)} className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-500">
                    Close
                  </button>
                </div>
              </div>
            )}

            {user ? (
              <Button className="bg-pink-500 text-white px-4 py-2 rounded-lg" onClick={handleLogout}>Log Out</Button>
            ) : (
              <Link href="/SignUp">
                <Button className="bg-pink-500 text-white px-4 py-2 rounded-lg">Sign Up</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ShadCN Modal for login reminder */}
      <Dialog open={showLoginReminder} onOpenChange={setShowLoginReminder}>
        <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
        <DialogContent className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-8 rounded-lg shadow-lg">
          <DialogTitle className="text-2xl font-bold text-pink-600">Please Login</DialogTitle>
          <DialogDescription className="mt-2 text-lg">Hey there! You can login and converse to check your score 😇.</DialogDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowLoginReminder(false)} className="bg-pink-600 text-white px-4 py-2 rounded-lg">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
