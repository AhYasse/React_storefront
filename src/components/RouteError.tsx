import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function RouteError() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';
  let status = 500;

  // Handle HTTP errors (like 404 or 500 from loaders)
  if (isRouteErrorResponse(error)) {
    status = error.status;
    errorMessage = error.statusText || errorMessage;
  } 
  // Handle standard JavaScript errors
  else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">{status}</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Oops! Something went wrong.</h2>
      <p className="text-gray-600 mb-8 max-w-md">{errorMessage}</p>
      <Link 
        to="/" 
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
}