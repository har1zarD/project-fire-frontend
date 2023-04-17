import React from "react";

function Login() {
  return (
    <div className="w-1/1 h-screen flex items-center justify-center ">
      <form className="w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 justify-center text-center leading-10">Log in</h2>
        <div className="mb-4"> 
          <label className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email">Email</label>
          <input className="shadow mt-0.5 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"/></div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password">Password</label>
          <input
            className="shadow mt-0.5 appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter your password"/></div>
        <button 
            className="bg-buttonColor hover:bg-green-900 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline justify-center items-center mx-auto w-full content-center"
            type="button">Log In</button>
        <div className="flex items-center justify-between bloc">
          <label className="block mt-3 text-rempassColor">
            <input className="mr-2 leading-tight accent-[#1A3835]" type="checkbox" />
            <span className="text-sm">Remember password</span>
          </label>
          <a className="inline-block mt-2 align-baseline underline font-bold text-sm text-textColor hover:text-green-900"
            href="#">Forgot Password?</a>
        </div>
        <div className="flex items-center justify-center mt-6">
          
        </div>
      </form>
    </div>
  );
}

export default Login;