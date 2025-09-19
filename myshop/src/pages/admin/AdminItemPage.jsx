const handleUploadImage = async (id, file) => {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`https://demo-deployment-ervl.onrender.com/admin/items/${id}/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Image upload failed");
    fetchItems();
  } catch (err) {
    alert(err.message);
  }
};
