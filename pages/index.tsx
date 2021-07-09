import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase"

export default function Home() {
  const { user } = useContext(AuthContext);

  console.log(user);

  const login = async () => {
    const { error } = await supabase.auth.signIn({
      provider: 'github',
    })

    if (error) {
      console.log(error);
      return;
    }
  }

  const logout = async () => {
    await supabase.auth.signOut();
  }

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
