import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('https://blog-application-shxy.onrender.com/post')
      .then(response => response.json())
      .then(posts => {
        setPosts(posts);
      });
  }, []);


  return (
    <>
      {posts.map(post => (
        <Post key={post.id} {...post} />
      ))}
    </>
  );
}
