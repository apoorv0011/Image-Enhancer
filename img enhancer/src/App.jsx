import Home from "./components/Home";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          AI image Enhancer{" "}
        </h1>
        <p className="text-lg text-gray-500">Upload Image</p>
      </div>

      <Home />

      <div className="text-sm mt-6 text-gray-500">
        <p>© 2025 <a href="https://github.com/apoorv0011" target="_blank" rel="noopener noreferrer">Apoorv Pachori</a> All rights reserved.</p>

      </div>
    </div>
  );
};

export default App;
