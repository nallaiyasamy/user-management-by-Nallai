import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUsers, setLoading, setError, deleteUser } from "../redux/userSlice";
import UserModal from "../components/UserModal";
import UserCard from "../components/UserCard";
import "../styles/userList.css";

const UserListPage = () => {
 const dispatch = useDispatch();
 const { users, loading, error } = useSelector((state) => state.user);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingUser, setEditingUser] = useState(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const [viewMode, setViewMode] = useState("table");
 const usersPerPage = 5;

 useEffect(() => {
  const fetchUsers = async () => {
   dispatch(setLoading(true));
   try {
    const response = await axios.get("https://reqres.in/api/users?page=1");
    dispatch(setUsers(response.data.data));
   } catch (err) {
    dispatch(setError("Failed to fetch users."));
   }
   dispatch(setLoading(false));
  };

  fetchUsers();
 }, [dispatch]);

 const filteredUsers = users.filter(
  (user) =>
   user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.email.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const indexOfLastUser = currentPage * usersPerPage;
 const indexOfFirstUser = indexOfLastUser - usersPerPage;
 const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
 const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

 const handleEdit = (user) => {
  setEditingUser(user);
  setIsModalOpen(true);
 };

 const handleDelete = (userId) => {
  dispatch(deleteUser(userId));
 };

 return (
  <div className="user-list-container">
   <div className="user-list-header">
    <h2>Users</h2>

  

    <input
     type="text"
     placeholder="Input Search Text..."
     className="search-box"
     value={searchTerm}
     onChange={(e) => setSearchTerm(e.target.value)}
    />

    <button className="create-user-btn" onClick={() => { setIsModalOpen(true); setEditingUser(null); }}>
     Create User
    </button>
   </div>
   <div className="view-toggle">
     <button
      className={viewMode === "table" ? "active" : ""}
      onClick={() => setViewMode("table")}
     >
      Table
     </button>
     <button
      className={viewMode === "card" ? "active" : ""}
      onClick={() => setViewMode("card")}
     >
      Card
     </button>
    </div>
    <br></br>

   {loading && <p>Loading users...</p>}
   {error && <p className="error">{error}</p>}

   {viewMode === "table" && (
    <table className="user-table">
     <thead>
      <tr>
       <th>Profile</th>
       <th>Email</th>
       <th>First Name</th>
       <th>Last Name</th>
       <th>Action</th>
      </tr>
     </thead>
     <tbody>
      {currentUsers.map((user) => (
       <tr key={user.id}>
        <td>
         <img src={user.avatar} alt={user.first_name} className="user-avatar" />

        </td>
        <td>
         <a href={`mailto:${user.email}`} className="user-email">{user.email}</a>
        </td>
        <td>{user.first_name}</td>
        <td>{user.last_name}</td>
        <td>
         <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
         <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
        </td>
       </tr>
      ))}
     </tbody>
    </table>
   )}

   {viewMode === "card" && (
    <div className="user-card-container">
     {currentUsers.map((user) => (
      <UserCard key={user.id} user={user} onEdit={handleEdit} onDelete={handleDelete} />
     ))}
    </div>
   )}

   <div className="pagination">
    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>◀</button>
    {[...Array(totalPages)].map((_, index) => (
     <button key={index} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
      {index + 1}
     </button>
    ))}
    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>▶</button>
   </div>

   <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editingUser={editingUser} />
  </div>
 );
};

export default UserListPage;
