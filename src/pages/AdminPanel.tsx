import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email?: string;
  rating: number;
  discordRoles: string[];
  isAdmin: boolean;
  createdAt: string;
  lastLogin?: string;
}

const AdminPanel: React.FC = () => {
  const { user, isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [discordRoles, setDiscordRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newRole, setNewRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    fetchData();
  }, [isLoggedIn, user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/admin/discord-roles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      const usersData = await usersResponse.json();
      const rolesData = await rolesResponse.json();

      if (usersData.success) {
        setUsers(usersData.users);
      }

      if (rolesData.success) {
        setDiscordRoles(rolesData.roles);
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) {
      setError('Please enter a role name');
      return;
    }

    try {
      const response = await fetch('/api/admin/discord-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setDiscordRoles(data.roles);
        setNewRole('');
        setSuccess('Role added successfully!');
      } else {
        setError(data.error || 'Failed to add role');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleRemoveRole = async (role: string) => {
    try {
      const response = await fetch(`/api/admin/discord-roles/${encodeURIComponent(role)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setDiscordRoles(data.roles);
        setSuccess('Role removed successfully!');
      } else {
        setError(data.error || 'Failed to remove role');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleAddRoleToUser = async () => {
    if (!selectedUser || !selectedRole) {
      setError('Please select a user and role');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/discord-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: selectedRole })
      });

      const data = await response.json();

      if (data.success) {
        // Update users list
        setUsers(users.map(u => 
          u.id === selectedUser.id 
            ? { ...u, discordRoles: data.user.discordRoles }
            : u
        ));
        setSelectedUser(null);
        setSelectedRole('');
        setSuccess('Role added to user successfully!');
      } else {
        setError(data.error || 'Failed to add role to user');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleRemoveRoleFromUser = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/discord-roles/${encodeURIComponent(role)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update users list
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, discordRoles: data.user.discordRoles }
            : u
        ));
        setSuccess('Role removed from user successfully!');
      } else {
        setError(data.error || 'Failed to remove role from user');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  if (!isLoggedIn || !user?.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <h2>⏳ Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.adminBox}>
        <div style={styles.header}>
          <h2 style={styles.title}>⚙️ Admin Panel</h2>
          <p style={styles.subtitle}>จัดการผู้ใช้และ Discord Roles</p>
        </div>

        <div style={styles.content}>
          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={styles.successMessage}>
              ✅ {success}
            </div>
          )}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🎭 Discord Roles Management</h3>
            
            <div style={styles.roleInput}>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter new role name"
                style={styles.input}
              />
              <button onClick={handleAddRole} style={styles.addButton}>
                ➕ Add Role
              </button>
            </div>

            <div style={styles.rolesList}>
              {discordRoles.map((role, index) => (
                <div key={index} style={styles.roleItem}>
                  <span style={styles.roleName}>{role}</span>
                  <button
                    onClick={() => handleRemoveRole(role)}
                    style={styles.removeButton}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👥 User Management</h3>
            
            <div style={styles.userSelection}>
              <select
                value={selectedUser?.id || ''}
                onChange={(e) => {
                  const user = users.find(u => u.id === e.target.value);
                  setSelectedUser(user || null);
                }}
                style={styles.select}
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} {user.isAdmin ? '(Admin)' : ''}
                  </option>
                ))}
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={styles.select}
              >
                <option value="">Select a role</option>
                {discordRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddRoleToUser}
                disabled={!selectedUser || !selectedRole}
                style={styles.addButton}
              >
                ➕ Add Role to User
              </button>
            </div>

            <div style={styles.usersList}>
              {users.map(user => (
                <div key={user.id} style={styles.userItem}>
                  <div style={styles.userInfo}>
                    <h4 style={styles.userName}>
                      {user.username}
                      {user.isAdmin && <span style={styles.adminBadge}> (Admin)</span>}
                    </h4>
                    <p style={styles.userDetails}>
                      Rating: {user.rating} | Email: {user.email || 'N/A'}
                    </p>
                  </div>
                  
                  <div style={styles.userRoles}>
                    <h5>Roles:</h5>
                    {user.discordRoles.length > 0 ? (
                      <div style={styles.rolesTags}>
                        {user.discordRoles.map((role, index) => (
                          <span key={index} style={styles.roleTag}>
                            {role}
                            <button
                              onClick={() => handleRemoveRoleFromUser(user.id, role)}
                              style={styles.removeRoleButton}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={styles.noRoles}>No roles assigned</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
    padding: '20px',
  },
  loadingBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center' as const,
  },
  adminBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '800px',
    overflow: 'hidden',
  },
  header: {
    padding: '40px 30px 20px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
    color: 'white',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9,
  },
  content: {
    padding: '30px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    color: '#333',
  },
  roleInput: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
  },
  select: {
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    minWidth: '200px',
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  userSelection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  rolesList: {
    display: 'grid',
    gap: '10px',
  },
  roleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  roleName: {
    fontWeight: '500',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  usersList: {
    display: 'grid',
    gap: '20px',
  },
  userItem: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e1e5e9',
  },
  userInfo: {
    marginBottom: '15px',
  },
  userName: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  userDetails: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  adminBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    marginLeft: '8px',
  },
  userRoles: {
    marginTop: '15px',
  },
  rolesTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '8px',
  },
  roleTag: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  removeRoleButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '0',
    marginLeft: '5px',
  },
  noRoles: {
    color: '#666',
    fontStyle: 'italic',
    margin: '8px 0 0 0',
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #fcc',
  },
  successMessage: {
    backgroundColor: '#efe',
    color: '#3c3',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #cfc',
  },
};

export default AdminPanel; 