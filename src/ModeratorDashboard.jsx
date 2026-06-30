import { useEffect, useState } from "react";

function ModeratorDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch all users from backend when the component mounts
    useEffect(() => {
        fetch('http://localhost:8080/api/admin/users', {
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        })
        .then(data => {
            setUsers(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error loading users:", err);
            setLoading(false);
        });
    }, []);

    //handle dropdown switch changes to update user roles
    const handleRoleChange = (userId, newRole) => {
        fetch(`http://localhost:8080/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({role: newRole})
        })
        .then(res => {
            if (res.ok) {
                alert("User role updated successfully!");
                //dynamically update local state list so the screen reflects the change instantly
                setUsers(users.map(user => user.id === userId ? { ...user, role: newRole} : user));
            } else {
                alert("Failed to update role. Check permissions.");
            }
        })
        .catch(err => console.error("Error updating role:", err));
    };

    if (loading) return <div className="container my-5"><h3>Loading Control Panel...</h3></div>;

    return (
        <div className="card p-4 mt-4 shadow-sm border-primary">
            <h3 className="mb-4 text-primary">Moderator Control Panel</h3>
            <p className="text-muted">As a Moderator, you can view all registered users and elevate or revoke their system operational roles.</p>

            <div className="table-responsive">
                <table className="table table-hover align-middle mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Current Access Rank</th>
                            <th>Assign Action Privilege</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key = {user.id}>
                                <td>{user.id}</td>
                                <td><strong>{user.username || 'Google User'}</strong></td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${
                                        user.role === 'ROLE_MODERATOR' ? 'bg-primary':
                                        user.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className="form-select form-select-sm w-auto"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="ROLE_USER">Standard User</option>
                                        <option value="ROLE_ADMIN">Admin Access</option>
                                        <option value="ROLE_MODERATOR">Moderator</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ModeratorDashboard;