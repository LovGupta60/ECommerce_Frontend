import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setFormData({ name: data.name, email: data.email });
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:8080/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // { name, email }
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setSuccessMsg("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render error page
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-100 text-red-600 p-6 rounded-xl shadow text-center">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render loading page
  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-600 animate-pulse text-lg">Loading profile...</div>
      </div>
    );
  }

  // Render profile page
  return (
  <div className="w-full max-w-lg mx-auto mt-6 sm:mt-10 p-4 sm:p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        My Profile
      </h1>

      {successMsg && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-center">
          {successMsg}
        </div>
      )}

      <div className="space-y-4">
        <p>
          <strong>ID:</strong> {profile.id}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            profile.name
          )}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {editing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            profile.email
          )}
        </p>

        <p>
          <strong>Role:</strong> {profile.role}
        </p>

        <div className="flex justify-end space-x-2 mt-4">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({ name: profile.name, email: profile.email });
                  setError(null);
                  setSuccessMsg("");
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
