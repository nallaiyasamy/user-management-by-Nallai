import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser, updateUser } from "../redux/userSlice"; 
import "../styles/modal.css";

const UserModal = ({ isOpen, onClose, editingUser }) => {
  const dispatch = useDispatch();

 
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (editingUser) {
      setUserData(editingUser);
    } else {
      setUserData({
        first_name: "",
        last_name: "",
        email: "",
        avatar: "https://i.pravatar.cc/150?u=random", 
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!userData.avatar) {
      userData.avatar = "https://i.pravatar.cc/150?u=random";
    }

    if (editingUser) {
      dispatch(updateUser(userData)); 
    } else {
      dispatch(addUser({ ...userData, id: Date.now() })); 
    }

    onClose();
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{editingUser ? "Edit User" : "Create User"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={userData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={userData.last_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="avatar"
              placeholder="Avatar URL (optional)"
              value={userData.avatar}
              onChange={handleChange}
            />
            <button type="submit">{editingUser ? "Update" : "Create"}</button>
          </form>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default UserModal;
