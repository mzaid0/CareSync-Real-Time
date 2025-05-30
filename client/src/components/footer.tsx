import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">© 2025 CareSync. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Button variant="link" className="text-gray-600">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-gray-600">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
