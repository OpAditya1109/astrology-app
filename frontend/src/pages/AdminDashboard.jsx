import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [showAllAdminTx, setShowAllAdminTx] = useState(false); // toggle for see more

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios
      .get("https://bhavanaastro.onrender.com/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setStats({
          ...res.data,
          latestUsers: res.data.latestUsers || [],
          latestAstrologers: res.data.latestAstrologers || [],
          latestOrders: res.data.latestOrders || [],
          latestEnquiries: res.data.latestEnquiries || [],
          latestWalletTx: res.data.latestWalletTx || [],
          adminTransactions: res.data.adminTransactions || [],
        })
      )
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <p className="text-center mt-10">Loading...</p>;

  const adminTxToShow = showAllAdminTx
    ? stats.adminTransactions
    : stats.adminTransactions.slice(0, 5);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-2xl">{stats.usersCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Astrologers</h2>
          <p className="text-2xl">{stats.astrologersCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-2xl">{stats.ordersCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Enquiries</h2>
          <p className="text-2xl">{stats.enquiriesCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Wallet Tx</h2>
          <p className="text-2xl">{stats.walletTxCount}</p>
        </div>
      </div>

      {/* Admin Wallet Balance */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Admin Wallet Balance</h2>
        <p className="text-2xl">₹{stats.adminBalance}</p>
      </div>

      {/* Admin Wallet Transactions */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Admin Wallet Transactions</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Reference ID</th>
            </tr>
          </thead>
          <tbody>
            {adminTxToShow.map((t, index) => (
              <tr key={index}>
                <td className="p-2 border">{t.type}</td>
                <td className="p-2 border">₹{t.amount}</td>
                <td className="p-2 border">{new Date(t.date).toLocaleString()}</td>
                <td className="p-2 border">{t.description || "-"}</td>
                <td className="p-2 border">{t.referenceId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {stats.adminTransactions.length > 5 && (
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowAllAdminTx(!showAllAdminTx)}
          >
            {showAllAdminTx ? "Show Less" : "See More"}
          </button>
        )}
      </div>

      {/* Latest Users */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Users</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {(stats.latestUsers || []).map((u) => (
              <tr key={u._id}>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Latest Astrologers */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Astrologers</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Speciality</th>
            </tr>
          </thead>
          <tbody>
            {(stats.latestAstrologers || []).map((a) => (
              <tr key={a._id}>
                <td className="p-2 border">{a.name}</td>
                <td className="p-2 border">{a.email}</td>
                <td className="p-2 border">{a.speciality || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Latest Orders */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Orders</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {(stats.latestOrders || []).map((o) => (
              <tr key={o._id}>
                <td className="p-2 border">{o.orderId}</td>
                <td className="p-2 border">{o.name}</td>
                <td className="p-2 border">₹{o.amount}</td>
                <td className="p-2 border">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Latest Enquiries */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Enquiries</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Course</th>
            </tr>
          </thead>
          <tbody>
            {(stats.latestEnquiries || []).map((e) => (
              <tr key={e._id}>
                <td className="p-2 border">{e.firstName} {e.lastName}</td>
                <td className="p-2 border">{e.email}</td>
                <td className="p-2 border">{e.phone}</td>
                <td className="p-2 border">{e.courseId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Latest Wallet Transactions */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Wallet Transactions</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {(stats.latestWalletTx || []).map((w) => (
              <tr key={w._id}>
                <td className="p-2 border">{w.orderId}</td>
                <td className="p-2 border">{w.userId}</td>
                <td className="p-2 border">₹{w.amount}</td>
                <td className="p-2 border">{w.status}</td>
                <td className="p-2 border">{w.paymentMethod || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
