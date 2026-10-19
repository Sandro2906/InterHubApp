export default function Footer() {
  return (
     <footer className="bg-gray-900 text-white py-6">
      <h1 className="text-center text-lg font-semibold">
        © {new Date().getFullYear()} Sandro App
      </h1>
    </footer>
  );
}