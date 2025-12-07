
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-terminal p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-terminal-error">404</h1>
        <p className="text-base sm:text-xl text-terminal-dim mb-4 sm:mb-6">Oops! Page not found</p>
        <Link to="/" className="inline-block text-sm sm:text-base text-terminal-accent hover:text-terminal-text underline px-4 py-2">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
