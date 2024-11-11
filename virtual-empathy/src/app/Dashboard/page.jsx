'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup } from '@/components/ui/sidebar';
import Link from 'next/link';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';





const Dashboard = () => {
  // State to handle whether the sidebar is open or collapsed
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user , setUser] = useState(null) ;
  const router = useRouter();


  useEffect ( () => { 

    const isUser = onAuthStateChanged(auth , (user)=> {
      if(user){
        setUser(user);
      }else {
        router.push('/Login');
      }
    } );

    return () => isUser();
  }  , [router]);


   // Toggle the sidebar visibility
   const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  if(!user) {
    return <div className='flex items-center justify-center text-3xl'> Loading ... Please wait </div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">

        <div className={`relative ${isSidebarOpen ? 'w-1/4' : 'w-16'} bg-pink-100 p-6 space-y-6 transition-all duration-300`}>

          <Sidebar className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
            <SidebarContent className="overflow-auto space-y-6">
              <SidebarHeader className="text-2xl font-bold mt-6 text-pink-600 mb-6">Dashboard</SidebarHeader>
              <SidebarGroup className="space-y-4">
                <Link href="/profile" className="block text-pink-600 hover:text-pink-800">Profile</Link>
                <Link href="/settings" className="block text-pink-600 hover:text-pink-800">Settings</Link>
                <Link href="/chatbot" className="block text-pink-600 hover:text-pink-800">Chatbot</Link>
              </SidebarGroup>
            </SidebarContent>

          </Sidebar>
        </div>


        <SidebarTrigger
          onClick={toggleSidebar}
          className="fixed top-1 left-4 p-4 bg-pink-600 text-white rounded-md z-10"
        >
          {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
        </SidebarTrigger>

        <div className="flex-1 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 p-8">
          <h1 className="text-4xl font-extrabold text-pink-600">Welcome to Your Dashboard</h1>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <Card className="w-full p-4 shadow-lg bg-white rounded-xl">
              <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage  src="avatar.png" alt="User" ></AvatarImage>
              <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-pink-600 text-center">Jane Doe</h3>
              <p className="text-center text-gray-700">Member since 2024</p>
            </Card>


            <Card className="w-full p-4 shadow-lg bg-white rounded-xl">
              <h3 className="text-xl font-semibold text-pink-600">Chatbot</h3>
              <p className="text-gray-700">Start chatting with your virtual assistant.</p>
              <Link href="/chatBot">
              <Button className="w-full bg-pink-600 text-white py-2 mt-4">Start Chat</Button>
              </Link>
            </Card>

            <Card className="w-full p-4 shadow-lg bg-white rounded-xl">
              <h3 className="text-xl font-semibold text-pink-600">Settings</h3>
              <p className="text-gray-700">Manage your account settings here.</p>
              <Link href="/settings">
                <Button className="w-full bg-pink-600 text-white py-2 mt-4">Go to Settings</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
