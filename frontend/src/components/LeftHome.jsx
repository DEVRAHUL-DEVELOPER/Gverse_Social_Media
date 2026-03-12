import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { FaRegHeart, FaSignOutAlt, FaUserPlus, FaBell } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import Notifications from '../pages/Notifications';

function LeftHome() {
    const { userData, suggestedUsers } = useSelector(state => state.user)
    const [showNotification, setShowNotification] = useState(false)
    const dispatch = useDispatch()
    const { notificationData } = useSelector(state => state.user)

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={`w-[25%] hidden lg:block h-[100vh] bg-gradient-to-b from-gray-900 to-black border-r-2 border-gray-800 ${showNotification ? "overflow-hidden" : "overflow-auto"}`}>
            {/* Header */}
            <div className='w-full h-[100px] flex items-center justify-between p-6 bg-gray-900 bg-opacity-50 backdrop-blur-sm'>
                <div className='flex items-center gap-3'>
                    <img src={logo} alt="Logo" className='w-12 h-12 rounded-xl'/>
                    <span className='text-white text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent'>
                        SocialApp
                    </span>
                </div>
                
                <div className='relative group'>
                    <button 
                        onClick={() => setShowNotification(prev => !prev)}
                        className={`p-3 rounded-2xl transition-all duration-300 ${
                            showNotification 
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25' 
                                : 'bg-gray-800 hover:bg-gray-700 hover:scale-110'
                        }`}
                    >
                        {showNotification ? (
                            <FaBell className='text-white w-5 h-5' />
                        ) : (
                            <FaRegHeart className='text-white w-5 h-5' />
                        )}
                        {notificationData?.length > 0 && notificationData.some((noti) => !noti.isRead) && (
                            <div className='absolute -top-1 -right-1'>
                                <span className='flex h-3 w-3'>
                                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
                                    <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500'></span>
                                </span>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {!showNotification ? (
                <>
                    {/* User Profile Card */}
                    <div className='mx-4 mt-6 p-6 bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-750'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='relative'>
                                    <div className='w-16 h-16 border-2 border-purple-500 rounded-full p-0.5'>
                                        <img 
                                            src={userData.profileImage || dp} 
                                            alt="Profile" 
                                            className='w-full h-full rounded-full object-cover'
                                        />
                                    </div>
                                    <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-800 rounded-full'></div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-lg text-white font-bold'>{userData.userName}</div>
                                    <div className='text-sm text-gray-300'>{userData.name}</div>
                                    <div className='flex items-center gap-1 mt-1'>
                                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                        <span className='text-xs text-gray-400'>Online</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogOut}
                                className='p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25'
                            >
                                <FaSignOutAlt className='text-white w-4 h-4' />
                            </button>
                        </div>
                    </div>

                    {/* Suggested Users Section */}
                    <div className='mx-4 mt-8'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-white text-lg font-bold flex items-center gap-2'>
                                <FaUserPlus className='text-purple-400' />
                                Suggested Users
                            </h2>
                            <IoIosArrowForward className='text-gray-400 w-4 h-4' />
                        </div>
                        
                        <div className='space-y-4'>
                            {suggestedUsers && suggestedUsers.slice(0, 3).map((user, index) => (
                                <div 
                                    key={index}
                                    className='transform hover:scale-[1.02] transition-transform duration-200'
                                >
                                    <OtherUser user={user} />
                                </div>
                            ))}
                        </div>
                        
                        {suggestedUsers?.length > 3 && (
                            <button className='w-full mt-6 py-3 bg-gray-800 text-gray-300 rounded-2xl hover:bg-gray-700 hover:text-white transition-all duration-300 font-medium'>
                                View All Suggestions
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <Notifications />
            )}
        </div>
    )
}

export default LeftHome