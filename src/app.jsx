import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // posts per page
  const [totalPosts, setTotalPosts] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (currentPage = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/posts/all`);
      setTotalPosts(res.data.length);

      // Frontend pagination: slice posts for current page
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      setPosts(res.data.slice(start, end));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await axios.post(`${BASE_URL}/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
      fetchPosts(page); // Refresh posts
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const totalPages = Math.ceil(totalPosts / pageSize);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>📝 Nivi and Joy's Blog</h1>

      {/* Create Post Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "30px",
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />
        <input type="file" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
          />
        )}
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Create Post
        </button>
      </form>

      {/* Posts List */}
      <h2 style={{ marginBottom: "15px", color: "#444" }}>📌 All Posts</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{post.title}</h3>
            <p>{post.content}</p>
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post"
                style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{ padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}
        >
          Previous
        </button>
        <span style={{ padding: "8px 12px" }}>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={{ padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}
        >
          Next
        </button>
      </div>

      {/* Favorite Song Section */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h2>🎶 My Favorite Song</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/PChRVIbU1-Q?autoplay=0&rel=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "0", borderRadius: "10px", marginTop: "15px" }}
        ></iframe>
      </div>
    </div>
  );
}

export default App;
