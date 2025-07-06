"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineSend } from "react-icons/ai";

const LandingForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    useEffect(() => {
        if (!router) {
            console.error("Router is not mounted.");
        }
    }, [router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push("/auth/home");
    };

    return (
        <>
            <div className='w-full relative h-[100vh] bg-white flex flex-col justify-center'>
                <h1 className='text-center text-8xl font-semibold absolute top-[7%] left-[50%] -translate-x-[50%]'>Kuchh Banaoge Kya? </h1>
                <div className='w-full h-[23.34%] flex items-start justify-end px-30 pt-5'>
                    <img src="food1.png" className='h-[300px] -rotate-10' alt="Food 1" />
                </div>
                <div className='w-full h-1/3 flex flex-col items-center justify-center'>
                    <div>
                        <p className='text-xl text-slate-500'>search your recipe here:</p>
                        <form className='flex items-center mt-1 relative' onSubmit={handleSubmit}>
                            <input
                            disabled={true}
                                title='disbled'
                                type="text"
                                id="txtSearch"
                                placeholder="Jaisa Mood, Vaisa Food..."
                                className='w-[400px] h-[50px] border rounded px-4 py-2'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type='submit'
                                className='w-[40px] h-[40px] absolute pl-1 bg-slate-100 rounded-full flex items-center justify-center right-1 hover:scale-[1.08] cursor-pointer'
                            >
                                <AiOutlineSend size={28} />
                            </button>
                        </form>
                    </div>
                </div>
                <div className='w-full h-1/3 flex px-50 pb-15 items-end justify-start'>
                    <img src="food2.png" className='h-[250px]' alt="Food 2" />
                </div>
            </div>
        </>
    );
};

export default LandingForm;