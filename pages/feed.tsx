import { GetServerSideProps } from "next";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";

export default function Feed(props) {
  const { user } = useContext(AuthContext);
  
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(props.posts);

  useEffect(() => {
    // supabase
    //   .from('posts')
    //   .select('*')
    //   .order('create_at', { ascending: true })
    //   .then(response => setPosts(response.body));

    supabase
      .from('posts')
      .on('INSERT', response => {
        setPosts(state => [...state, response.new])
      })
      .subscribe();
  }, []);

  async function sendNewPost(event: FormEvent) {
    event.preventDefault();

    if (!newPost.trim) {
      return;
    }

    const { error } = await supabase.from('posts').insert({
      content: newPost,
    });

    if (error) {
      console.log(error);
      return;
    }

    setNewPost('');

  }

  return (
    <div>
      <form onSubmit={sendNewPost}>
        <textarea
          placeholder="White new post..."
          onChange={e => setNewPost(e.target.value)}
          value={newPost}
        />
        <button type="submit">Send</button>
      </form>

      <ul>
        {posts.map(post => {
          return (
            <li key={post.id}>
              {post.content}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await supabase.auth.api.getUserByCookie(ctx.req);

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const response = await supabase
    .from('posts')
    .select('*')
    .order('create_at', { ascending: true });

  return {
    props: {
      posts: response.body,
    }
  }
}