import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setFollowing, toggleFollow } from '../redux/userSlice'
import { FaUserCheck, FaUserPlus, FaSpinner } from 'react-icons/fa'

function FollowButton({ targetUserId, tailwind, onFollowChange }) {
    const { following } = useSelector(state => state.user)
    const [isLoading, setIsLoading] = useState(false)
    const isFollowing = following.includes(targetUserId)
    const dispatch = useDispatch()

    const handleFollow = async () => {
        if (isLoading) return
        
        setIsLoading(true)
        try {
            const result = await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`, { withCredentials: true })
            if (onFollowChange) {
                onFollowChange()
            }
            dispatch(toggleFollow(targetUserId))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Base styles that match your design system
    const baseStyles = `
        px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-300 
        flex items-center justify-center gap-2 relative overflow-hidden
        ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
    `

    const followStyles = `
        bg-gradient-to-r from-blue-500 to-purple-600 text-white 
        hover:from-blue-600 hover:to-purple-700 
        hover:shadow-lg hover:shadow-blue-500/25
        border border-transparent
    `

    const followingStyles = `
        bg-transparent text-purple-500 border border-purple-500 
        hover:bg-purple-500 hover:text-white hover:border-purple-600
        hover:shadow-lg hover:shadow-purple-500/25
    `

    const loadingStyles = `
        bg-gray-400 text-transparent border-gray-400
    `

    const finalStyles = `${baseStyles} ${
        isLoading ? loadingStyles : isFollowing ? followingStyles : followStyles
    } ${tailwind || ''}`

    return (
        <button 
            className={finalStyles}
            onClick={handleFollow}
            disabled={isLoading}
        >
            {/* Loading Spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaSpinner className="w-4 h-4 text-white animate-spin" />
                </div>
            )}

            {/* Button Content */}
            <div className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {isFollowing ? (
                    <>
                        <FaUserCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>Following</span>
                    </>
                ) : (
                    <>
                        <FaUserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>Follow</span>
                    </>
                )}
            </div>

            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
        </button>
    )
}

export default FollowButton