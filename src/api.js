const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPosts() {
  const res = await fetch(`${API_URL}/post/all`);
  return res.json();
}

export async function createPost({ title, content, image }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) formData.append("image", image);

  const res = await fetch(`${API_URL}/post/`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}
