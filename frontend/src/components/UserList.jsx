import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";

function UserList() {
  const { userId, type } = useParams(); // type: followers or following
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/getUserList/${userId}/${type}`, {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [userId, type]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <div className="w-full max-w-md flex flex-col gap-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 bg-gray-900 p-3 rounded cursor-pointer"
            onClick={() => navigate(`/profile/${user.userName}`)}
          >
            <img
              src={user.profileImage || dp}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-gray-400">@{user.userName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
