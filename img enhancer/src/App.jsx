import Home from "./components/Home";

const App = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10 w-full max-w-4xl">
        <h1 className="text-6xl font-extrabold text-indigo-800 mb-4 tracking-tight">
          AI Image Enhancer
        </h1>
        <p className="text-xl text-gray-600">
          Transform your photos with intelligent AI.
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <Home />
      </main>

      <footer className="mt-12 text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/apoorv0011"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Apoorv Pachori
          </a>{" "}
          All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;