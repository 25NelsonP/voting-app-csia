import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Login Success: currentUser:", decoded);
    setUser(decoded); // Save user information in the state
  };

  const handleLoginFailure = () => {
    console.log("Login failed");
    setUser(null); // Clear user information on login failure
  };

  return (
    <div style={styles.container}>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
      {user && (
        <div style={styles.profile}>
          <img src={user.get} alt="Profile" style={styles.profilePic} />
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  profile: {
    marginTop: "20px",
    textAlign: "center",
  },
  profilePic: {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
  },
};

export default LoginPage;
