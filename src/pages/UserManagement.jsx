import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { usersAPI } from "../services/api";

export default function UserManagement() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [user, navigate, authLoading]);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers(token);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      addToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const response = await usersAPI.deleteUser(userId, token);
      if (response.success) {
        addToast("User deleted successfully!", "success");
        fetchUsers();
        setShowDetailsModal(false);
      }
    } catch (error) {
      addToast(error.message || "Failed to delete user", "error");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">User Management</h2>
            <div className="text-center py-8">
              <div className="text-xl">Loading users...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
            <div className="text-lg font-semibold text-gray-600">
              Total Users: {users.length}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">All Users</h3>
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none bg-transparent text-sm w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{u.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(u)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition text-xs"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && users.length > 0 && (
                <p className="text-center text-gray-500 py-8">No users found matching "{searchQuery}"</p>
              )}
              {users.length === 0 && (
                <p className="text-center text-gray-500 py-8">No users registered yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">User Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-semibold">{selectedUser.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{selectedUser.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-lg">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    selectedUser.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedUser.role}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-lg">{formatDate(selectedUser.createdAt)}</p>
              </div>

              {selectedUser.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <div className="bg-gray-50 p-3 rounded-lg mt-1">
                    <p>{selectedUser.address.addressLine}</p>
                    <p>{selectedUser.address.district}, {selectedUser.address.state}</p>
                    <p>Pincode: {selectedUser.address.pincode}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
