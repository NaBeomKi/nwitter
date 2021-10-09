import React, { useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "firebase";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

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
      <div className="authContainer">
        <FontAwesomeIcon
          icon={faTwitter}
          color={"#04AAFF"}
          size="3x"
          style={{ marginBottom: 30 }}
        />
        <div className="authBtns">
          <button onClick={onSocialClick} name="google" className="authBtn">
            Continue with Google <FontAwesomeIcon icon={faGoogle} />
          </button>
          <button onClick={onSocialClick} name="github" className="authBtn">
            Continue with Github <FontAwesomeIcon icon={faGithub} />
          </button>
        </div>
      </div>
      {error}
    </div>
  );
};

export default Auth;
