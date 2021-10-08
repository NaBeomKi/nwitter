import React, { useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "firebase";
import AuthForm from "components/AuthForm";

const Auth = () => {
  const [error, setError] = useState("");

  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;

    switch (name) {
      case "google": {
        provider = new GoogleAuthProvider();
        break;
      }
      case "github": {
        provider = new GithubAuthProvider();
        break;
      }
      default:
        break;
    }

    try {
      await signInWithPopup(authService, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
      {error}
    </div>
  );
};

export default Auth;
