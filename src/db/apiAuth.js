import supabase, { supabaseUrl } from "./supabase";

export async function login({ email, password }) {
  console.log(email, password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) return null;
  if (error) {
    throw new Error(error.message);
  }
  return session.session?.user;
}

export async function signUp({ name, email, password, profile }) {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
  const { error: SignupError } = await supabase.storage
    .from("profile")
    .upload(fileName, profile);

  if (SignupError) {
    throw new Error(SignupError.message);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile: `${supabaseUrl}/storage/v1/object/public/profile/${fileName}`,
      },
    },
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
