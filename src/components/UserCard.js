import React from "react";
import "../styles/userCard.css";

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.first_name} className="card-avatar" />
      <div className="user-info">
        <h3>{user.first_name} {user.last_name}</h3>
        <a href={`mailto:${user.email}`} className="user-email">{user.email}</a>
        <div className="user-actions">
          <button className="edit-btn" onClick={() => onEdit(user)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(user.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
