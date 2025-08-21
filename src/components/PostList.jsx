export default function PostList({ posts }) {
    return (
      <div>
        <h2>All Posts</h2>
        {posts.map((post) => (
          <div key={post.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "15px" }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.image_url && (
              <img src={post.image_url} alt="Post" style={{ maxWidth: "100%" }} />
            )}
          </div>
        ))}
      </div>
    );
  }
  