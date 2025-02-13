import { useState } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-gray-200 flex items-center justify-center min-h-screen">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {isLogin ? (
          <>
            <div className="w-full md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-6">Signin</h2>
              <form>
                <div className="mb-4">
                  <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" type="text" placeholder="ByteWebster" />
                </div>
                <div className="mb-4">
                  <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" type="password" placeholder="Password" />
                </div>
                <div className="mb-6">
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Signin</button>
                </div>
              </form>
            </div>
            <div className="w-full md:w-1/2 bg-green-500 text-white p-8 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
              <p className="mb-4 text-center">We are so happy to have you here again!</p>
              <button onClick={() => setIsLogin(false)} className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700">No account yet? Signup.</button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-500 text-white p-8 md:w-1/2 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold mb-4">Come join us!</h2>
              <p className="text-center mb-6">Create an account to get exclusive offers!</p>
              <button onClick={() => setIsLogin(true)} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-full">Already have an account? Signin.</button>
            </div>
            <div className="p-8 md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Signup</h2>
              <form>
                <input type="text" placeholder="Full Name" className="w-full p-3 mb-4 border rounded-lg" />
                <input type="text" placeholder="ByteWebster" className="w-full p-3 mb-4 border rounded-lg" />
                <input type="email" placeholder="support@bytewebster.com" className="w-full p-3 mb-4 border rounded-lg" />
                <input type="password" placeholder="Password" className="w-full p-3 mb-4 border rounded-lg" />
                <input type="password" placeholder="Confirm Password" className="w-full p-3 mb-4 border rounded-lg" />
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Upload Profile Picture:</label>
                  <input type="file" className="w-full p-2 border rounded-lg" accept="image/*" />
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mb-4">Signup</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}