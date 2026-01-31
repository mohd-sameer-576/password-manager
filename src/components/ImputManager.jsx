import { useState, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const ImputManager = () => {
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
    if (!form.site || !form.username || !form.password) return;

    if (editId) {
      const updated = passwordArray.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      );
      persist(updated);
      setEditId(null);
      toast("Password updated", { transition: Bounce, theme: "dark" });
    } else {
      const newItem = { ...form, id: uuidv4() };
      persist([...passwordArray, newItem]);
      toast("Your password is saved", { transition: Bounce, theme: "dark" });
    }

    setForm({ site: "", username: "", password: "" });
  };

  const deletePassword = (id) => {
    if (confirm("Do you want to delete this password?")) {
      persist(passwordArray.filter((item) => item.id !== id));
    }
  };

  const editPassword = (id) => {
    const item = passwordArray.find((i) => i.id === id);
    if (!item) return;
    setForm({
      site: item.site,
      username: item.username,
      password: item.password,
    });
    setEditId(id);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text) => {
    toast("Copied to Clipboard", { transition: Bounce, theme: "dark" });
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row md:justify-around items-start gap-6 p-4">
      <ToastContainer />

      {/* form */}
      <div className="flex flex-col gap-3 py-6 px-6 rounded-2xl border items-stretch w-full md:w-1/3">
        <h1 className="font-bold text-2xl md:text-3xl mb-4">
          {editId ? "Edit Password" : "Save Your Password"}
        </h1>

        <input
          name="site"
          value={form.site}
          onChange={handleChange}
          placeholder="Enter the site URL"
          className="input input-bordered w-full"
        />
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter the username"
          className="input input-bordered w-full"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="input input-bordered w-full"
        />

        <button
          onClick={savePassword}
          className="btn bg-amber-50 text-black p-2 mt-3 rounded-2xl font-semibold flex items-center gap-2 justify-center w-full md:w-auto"
        >
          <lord-icon
            src="https://cdn.lordicon.com/yrtftktn.json"
            trigger="hover"
            colors="primary:#ffc738,secondary:#000000"
          ></lord-icon>
          {editId ? "Update Password" : "Save Password"}
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto mt-5 border rounded-2xl mb-5 bg-gray-900 w-full md:w-2/3">
        {passwordArray.length === 0 ? (
          <div className="w-full h-40 flex font-bold text-xl md:text-2xl items-center justify-center px-4">
            No Password Available
          </div>
        ) : (
          <table className="table w-full bg-gray-800">
            <thead className="bg-black text-sm md:text-base">
              <tr>
                <th>S.NO</th>
                <th>Website Url</th>
                <th>UserName</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwordArray.map((items, index) => (
                <tr key={items.id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex justify-between gap-4 items-center">
                      <span className="truncate">{items.site}</span>
                      <FaRegCopy
                        onClick={() => copyToClipboard(items.site)}
                        className="cursor-pointer"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-between gap-4 items-center">
                      <span className="truncate">{items.username}</span>
                      <FaRegCopy
                        onClick={() => copyToClipboard(items.username)}
                        className="cursor-pointer"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-between gap-4 items-center">
                      <span className="truncate">{items.password}</span>
                      <FaRegCopy
                        onClick={() => copyToClipboard(items.password)}
                        className="cursor-pointer"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-4 items-center">
                      <span
                        onClick={() => editPassword(items.id)}
                        className="cursor-pointer"
                      >
                        ✏️
                      </span>
                      <span
                        onClick={() => deletePassword(items.id)}
                        className="cursor-pointer"
                      >
                        🗑️
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ImputManager;
