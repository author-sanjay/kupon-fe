import React, { useState } from "react";
import "./Login.css"; // Import the CSS file for transitions
import { motion } from "framer-motion";
import axios from "axios";
import {
  CircleCheckBig,
  IdCard,
  KeyRound,
  Mail,
  User,
  UsersRound,
} from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../Context/AuthContext";
import { DNA } from "react-loader-spinner";
const Login = () => {
  const { setUserAuth } = useAuth();
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpStep, setSignUpStep] = useState(1);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignUpPassword = (confirmPassword: string) => {
    if (password === confirmPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    const isValid = /\S+@\S+\.\S+/.test(email);
    setEmailValid(isValid);
    setEmail(e.target.value);
  };

  const handleLogin = () => {
    setLoading(true);
    const data = { email: email, password: password };
    axios
      .post("https://kupon-f86c.onrender.com/auth/login", data)
      .then((response) => {
        setUserAuth(response.data.access_token);
        enqueueSnackbar("Login Success", {
          variant: "success",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error: " + err.response.data.message, {
          variant: "success",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
        setLoading(false);
      });
  };
  const handleSignup = () => {
    setLoading(true);
    const data = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName.length > 0 ? middleName : null,
      isCompany: false,
    };
    axios
      .post("https://kupon-f86c.onrender.com/user/register", data)
      .then((response) => {
        setEmail("");
        setPassword("");
        setLogin(true);
        setEmailValid(false);
        enqueueSnackbar(
          "Success: Your Account has been registered. Please Login to your account",
          { variant: "success", autoHideDuration: 3000, preventDuplicate: true }
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
        setLoading(false);
        setLogin(true);
        setEmail("");
        setEmailValid(false);
        setPassword("");
        setFirstName("");
        setLastName("");
        setMiddleName("");
      });
  };
  return (
    <div className="w-screen h-screen flex flex-row bg-white text-black">
      <div
        className={`transition-all duration-500 ease-in-out flex items-center justify-center text-white p-8 ${
          login ? "w-3/5 bg-white" : "w-2/5 bg-black rounded-r-[2vw]"
        }`}
      >
        {login ? (
          <>
            <motion.div
              className="w-1/3 h-full flex flex-col justify-center items-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <span className="text-black text-[6vh] font-bold font-serif">
                Sign In
              </span>
              <span className="text-black text-center text-[1.5vh] font-thin">
                Look We have more discount coupons for you
              </span>

              <div className="relative flex items-center mt-10 w-full">
                <Mail className="absolute left-3 text-gray-500" />
                <input
                  type="email"
                  onChange={handleEmailChange}
                  className={`border border-gray-300 text-black rounded-lg p-2 pl-10 w-full transition-all duration-300 ${
                    emailValid ? "border-green-500" : ""
                  }`}
                  placeholder="Email"
                />
                {emailValid && (
                  <CircleCheckBig className="absolute right-3 text-green-500" />
                )}
              </div>

              <div className="relative flex items-center w-full mt-5">
                <KeyRound className="absolute left-3 text-gray-500" />
                <input
                  type="password"
                  className="border border-gray-300 text-black rounded-lg p-2 pl-10 w-full transition-all duration-300"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {loading ? (
                <DNA
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                />
              ) : (
                <motion.button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded-lg mt-5 w-full hover:bg-blue-600 transition-colors duration-300 ${
                    !emailValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!emailValid}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                >
                  Login
                </motion.button>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Welcome Back!
            </h1>
            <p className="mb-8 text-white">
              We missed you! Explore new features and updates.
            </p>
            <button className="px-10 py-2 bg-black border-white border-2 rounded-lg text-white hover:bg-white hover:text-black transition">
              Log In
            </button>
          </div>
        )}
      </div>
      <div
        className={`transition-all duration-500 ease-in-out flex items-center justify-center p-8 ${
          login ? "w-2/5 bg-black rounded-l-[2vw]" : "w-3/5 bg-white"
        }`}
      >
        {login ? (
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">Hello, Friend</h1>
            <p className="mb-8">
              You are just a few clicks away from more than 25% Discount on your
              saving
            </p>
            <button
              className="px-4 py-2 bg-black border-white border-2 rounded-lg text-white hover:bg-white hover:text-black transition"
              onClick={() => setLogin(false)}
            >
              Sign Up Now
            </button>
          </div>
        ) : (
          <>
            <motion.div
              className="w-1/3 h-full flex flex-col justify-center items-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
            >
              <span className="text-black text-[6vh] font-bold font-serif">
                Sign Up
              </span>
              <span className="text-black text-center text-[1.5vh] font-thin">
                Level Up your shopping experience
              </span>

              {signUpStep == 1 ? (
                <>
                  <div className="relative flex items-center mt-10 w-full">
                    <Mail className="absolute left-3 text-gray-500" />
                    <input
                      value={email}
                      type="email"
                      onChange={handleEmailChange}
                      className={`border border-gray-300 text-black rounded-lg p-2 pl-10 w-full transition-all duration-300 ${
                        emailValid ? "border-green-500" : ""
                      }`}
                      placeholder="Email"
                    />
                    {emailValid && (
                      <CircleCheckBig className="absolute right-3 text-green-500" />
                    )}
                  </div>
                  <div className="relative flex items-center mt-2 w-full">
                    <KeyRound className="absolute left-3 text-gray-500" />
                    <input
                      value={password}
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className={`border border-gray-300 text-black rounded-lg p-2 pl-10 w-full transition-all duration-300`}
                      placeholder="Password"
                    />
                  </div>
                  <div className="relative flex items-center mt-2 w-full">
                    <KeyRound className="absolute left-3 text-gray-500" />
                    <input
                      type="password"
                      onChange={(e) => handleSignUpPassword(e.target.value)}
                      className={`border border-gray-300 text-black rounded-lg p-2 pl-10 w-full transition-all duration-300 ${
                        passwordMatch ? "border-green-500" : ""
                      }`}
                      placeholder="Confirm Password"
                    />
                    {passwordMatch && (
                      <CircleCheckBig className="absolute right-3 text-green-500" />
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded-lg mt-5 w-full hover:bg-blue-600 transition-colors duration-300 ${
                      !emailValid || !passwordMatch
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!emailValid || !passwordMatch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSignUpStep(2)}
                  >
                    Continue
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="relative flex items-center mt-10 w-full">
                    <User className="absolute left-3 text-gray-500" />
                    <input
                      value={firstName}
                      type="text"
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-gray-300 text-black rounded-lg p-2 pl-10 w-full"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="relative flex items-center mt-2 w-full">
                    <UsersRound className="absolute left-3 text-gray-500" />
                    <input
                      value={middleName}
                      type="text"
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="border border-gray-300 text-black rounded-lg p-2 pl-10 w-full"
                      placeholder="Middle Name"
                    />
                  </div>
                  <div className="relative flex items-center mt-2 w-full">
                    <IdCard className="absolute left-3 text-gray-500" />
                    <input
                      value={lastName}
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-gray-300 rounded-lg  text-black p-2 pl-10 w-full"
                      placeholder="Last Name"
                    />
                  </div>
                  {loading ? (
                    <DNA
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperClass="dna-wrapper"
                    />
                  ) : (
                    <motion.button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded-lg mt-5 w-full hover:bg-blue-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignup}
                    >
                      Sign Up
                    </motion.button>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
