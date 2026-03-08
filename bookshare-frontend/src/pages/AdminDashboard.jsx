import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Y = "#FEFF86";
const LB = "#B0DAFF";
const SB = "#B9E9FC";
const MB = "#DAF5FF";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #FAFEFF; }
.admin-container { min-height: 100vh; display: flex; }
.sidebar { width: 260px; background: #1A1A1A; color: #fff; padding: 24px 0; flex-shrink: 0; }
.sidebar-logo { padding: 0 24px 24px; border-bottom: 1px solid #333; margin-bottom: 24px; }
.sidebar-logo h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; }
.sidebar-logo span { color: ${Y}; }
.sidebar-nav { list-style: none; }
.sidebar-nav li { margin-bottom: 4px; }
.sidebar-nav a { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #aaa; text-decoration: none; font-weight: 500; transition: all 0.2s; }
.sidebar-nav a:hover, .sidebar-nav a.active { background: #333; color: #fff; }
.sidebar-nav a.active { border-left: 3px solid ${Y}; }
.main-content { flex: 1; padding: 32px; overflow-y: auto; }
.page-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #1A1A1A; margin-bottom: 8px; }
.page-subtitle { color: #666; margin-bottom: 32px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px; }
.stat-card { background: #fff; border-radius: 16px; padding: 24px; border: 2px solid #eee; }
.stat-card:hover { border-color: #1A1A1A; transform: translateY(-2px); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px; }
.stat-label { font-size: 0.85rem; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.stat-value { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #1A1A1A; margin-top: 8px; }
.section { background: #fff; border-radius: 16px; padding: 24px; border: 2px solid #eee; margin-bottom: 24px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #eee; }
.table td { padding: 16px; border-bottom: 1px solid #eee; }
.table tr:hover { background: #fafafa; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 700; }
.badge-active { background: #d4edda; color: #155724; }
.badge-inactive { background: #f8d7da; color: #721c24; }
.badge-admin { background: ${Y}; color: #1A1A1A; }
.badge-user { background: #e3f2fd; color: #0d47a1; }
.btn { padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; border: none; transition: all 0.2s; }
.btn-primary { background: ${Y}; color: #1A1A1A; }
.btn-primary:hover { background: #f5f500; }
.btn-danger { background: #fee2e2; color: #dc2626; }
.btn-danger:hover { background: #fecaca; }
.btn-sm { padding: 6px 12px; font-size: 0.75rem; }
.loading { text-align: center; padding: 60px; color: #888; }
.error { background: #fee2e2; color: #dc2626; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [statsData, usersData, booksData] = await Promise.all([
        api.getAdminStats(),
        api.getAllUsers(0, 10),
        api.getAllBooksAdmin(0, 10)
      ]);
      setStats(statsData);
      setUsers(usersData.content || []);
      setBooks(booksData.content || []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function promoteToAdmin(userId) {
    if (!confirm("Are you sure you want to make this user an admin?")) return;
    try {
      setActionLoading(userId);
      await api.updateUserRole(userId, "ADMIN");
      await fetchData();
      alert("User promoted to admin successfully!");
    } catch (err) {
      alert(err.message || "Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  }

  async function deactivateUser(userId) {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      setActionLoading(userId);
      await api.deactivateUser(userId);
      await fetchData();
      alert("User deactivated successfully!");
    } catch (err) {
      alert(err.message || "Failed to deactivate user");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteBook(bookId) {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      setActionLoading(bookId);
      await api.deleteBookAdmin(bookId);
      await fetchData();
      alert("Book deleted successfully!");
    } catch (err) {
      alert(err.message || "Failed to delete book");
    } finally {
      setActionLoading(null);
    }
  }

  const StatCard = ({ icon, label, value, bg }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value || 0}</div>
    </div>
  );

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <>
      <style>{STYLE}</style>
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h2>Book<span>Cycle</span></h2>
            <p style={{ fontSize: "0.75rem", color: "#888", marginTop: 4 }}>Admin Panel</p>
          </div>
          <ul className="sidebar-nav">
            <li>
              <a href="#" className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
                📊 Dashboard
              </a>
            </li>
            <li>
              <a href="#" className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
                👥 Users
              </a>
            </li>
            <li>
              <a href="#" className={activeTab === "books" ? "active" : ""} onClick={() => setActiveTab("books")}>
                📚 Books
              </a>
            </li>
            <li>
              <Link to="/" style={{ color: "#aaa", padding: "12px 24px", display: "block", textDecoration: "none" }}>
                ← Back to Site
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {error && <div className="error">{error}</div>}

          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage your BookCycle platform</p>

          {/* Stats Grid */}
          <div className="stats-grid">
            <StatCard icon="👥" label="Total Users" value={stats?.totalUsers} bg={LB} />
            <StatCard icon="📚" label="Total Books" value={stats?.totalBooks} bg={Y} />
            <StatCard icon="📥" label="Borrow" value={stats?.borrowBooks} bg={SB} />
            <StatCard icon="💰" label="For Sale" value={stats?.sellBooks} bg={MB} />
            <StatCard icon="🔄" label="Exchanges" value={stats?.exchangeBooks} bg={LB} />
            <StatCard icon="✅" label="Completed" value={stats?.completedRequests} bg={Y} />
            <StatCard icon="📍" label="Cities" value={stats?.cities?.length || 0} bg={SB} />
          </div>

          {/* Recent Users */}
          <div className="section">
            <div className="section-header">
              <h3 className="section-title">Recent Users</h3>
              <button className="btn btn-primary btn-sm">View All</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.city || "—"}</td>
                    <td>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.active ? 'badge-active' : 'badge-inactive'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'ADMIN' && (
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => promoteToAdmin(user.id)}
                          disabled={actionLoading === user.id}
                          style={{ marginRight: 8 }}
                        >
                          {actionLoading === user.id ? '...' : 'Make Admin'}
                        </button>
                      )}
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => deactivateUser(user.id)}
                        disabled={actionLoading === user.id || !user.active}
                      >
                        {actionLoading === user.id ? '...' : 'Deactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: "center", color: "#888" }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Books */}
          <div className="section">
            <div className="section-header">
              <h3 className="section-title">Recent Books</h3>
              <button className="btn btn-primary btn-sm">View All</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.listingType}</td>
                    <td>{book.city || "—"}</td>
                    <td>
                      <span className={`badge ${book.status === 'AVAILABLE' ? 'badge-active' : 'badge-inactive'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => deleteBook(book.id)}
                        disabled={actionLoading === book.id}
                      >
                        {actionLoading === book.id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: "center", color: "#888" }}>No books found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}

