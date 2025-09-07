const Footer = () => {
    return (
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-recycle text-green-600 text-xl mr-2"></i>
              <span className="text-sm font-semibold">E-Waste Management System</span>
            </div>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="mt-4 text-center md:text-left">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} E-Waste Management System. All rights reserved.
            </p>
          </div>
          
          <div className="mt-2 flex flex-wrap justify-center md:justify-start space-x-4">
            <a href="#" className="text-xs text-gray-500 hover:text-green-600">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-green-600">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-green-600">Contact Us</a>
            <a href="#" className="text-xs text-gray-500 hover:text-green-600">Help Center</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;