const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
    const payload = isSignUp
      ? { name: form.name, email: form.email, password: form.password }
      : { email: form.email, password: form.password };

    const { data } = await axios.post(backendUrl + endpoint, payload);

    if (data.success) {
      localStorage.setItem("token", data.token); // ← save token
      toast.success(isSignUp ? "Account created! Welcome 🎉" : "Welcome back!");
      setIsLoggedin(true);
      await getUserData();
      const me = await axios.get(backendUrl + "/api/user/data");
      navigate(me.data.userData?.isAdmin ? "/admin" : "/");
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};