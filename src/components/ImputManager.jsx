import { useState, useEffect } from "react";
import { FaRegCopy, FaTrashAlt, FaEdit, FaPlus, FaSave } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const InputManager = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const passwords = localStorage.getItem("passwords");
    if (passwords) setPasswordArray(JSON.parse(passwords));
  }, []);

  const persist = (data) => {
    setPasswordArray(data);
    localStorage.setItem("passwords", JSON.stringify(data));
  };

  const savePassword = () => {
    if (!form.site || !form.username || !form.password) {
      toast.warn("Please fill all fields", { theme: "dark" });
      return;
    }

    if (editId) {
      const updated = passwordArray.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      );
      persist(updated);
      setEditId(null);
      toast.success("Entry updated successfully!", { transition: Bounce, theme: "dark" });
    } else {
      const newItem = { ...form, id: uuidv4() };
      persist([...passwordArray, newItem]);
      toast.success("Password secured!", { transition: Bounce, theme: "dark" });
    }
    setForm({ site: "", username: "", password: "" });
  };

  const deletePassword = (id) => {
    if (confirm("Are you sure you want to delete this?")) {
      persist(passwordArray.filter((item) => item.id !== id));
      toast.error("Entry deleted", { theme: "dark" });
    }
  };

 const editPassword = (id) => {
    const item = passwordArray.find((i) => i.id === id);
    if (!item) return;

    // 1. Fill the form with existing data
    setForm({
      site: item.site,
      username: item.username,
      password: item.password,
    });

    // 2. Set the ID so savePassword() knows to "Update" instead of "Create"
    setEditId(id);

    // 3. Smooth scroll to form for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    toast.info("Editing entry...", { autoClose: 1500, theme: "dark" });
  };

  // Add a helper to cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setForm({ site: "", username: "", password: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!", { autoClose: 2000, theme: "dark" });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ToastContainer position="top-right" />
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            PassVault
          </h1>
          <p className="text-slate-400 font-medium">Securely manage your credentials locally.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Card */}
          <div className="lg:col-span-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editId ? <FaEdit className="text-indigo-400" /> : <FaPlus className="text-indigo-400" />}
              {editId ? "Edit Credentials" : "Add New Entry"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Website URL</label>
                <input
                  name="site"
                  value={form.site}
                  onChange={handleChange}
                  placeholder="example.com"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Username / Email</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe@mail.com"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <button
                onClick={savePassword}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {editId ? <FaSave /> : <FaPlus />}
                {editId ? "Update Entry" : "Save Password"}
              </button>
            </div>
          </div>

          {/* Table / List Section */}
          <div className="lg:col-span-8">
            <div className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                {passwordArray.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="text-5xl mb-4">🔐</div>
                    <p className="text-slate-500 text-lg">No passwords saved yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 border-b border-slate-700">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Site</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Identity</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {passwordArray.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-slate-200 truncate max-w-37.5">{item.site}</span>
                              <button onClick={() => copyToClipboard(item.site)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-600 rounded-md transition-all text-indigo-400">
                                <FaRegCopy size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-300">{item.username}</span>
                              <button onClick={() => copyToClipboard(item.username)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-600 rounded-md transition-all text-indigo-400">
                                <FaRegCopy size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              
                              <span className="text-xs text-slate-500">••••••••</span>
                              <button onClick={() => copyToClipboard(item.password)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-600 rounded-md transition-all text-indigo-400">
                                <FaRegCopy size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editPassword(item.id)}
                                className="p-2.5 bg-slate-700 hover:bg-amber-500/20 hover:text-amber-500 rounded-lg transition-all"
                                title="Edit"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => deletePassword(item.id)}
                                className="p-2.5 bg-slate-700 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all"
                                title="Delete"
                              >
                                <FaTrashAlt size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InputManager;