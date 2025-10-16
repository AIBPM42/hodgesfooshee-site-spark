import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H&F</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">Hodges & Fooshee</h3>
                <p className="text-white/80">Realty</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Your trusted partners in luxury real estate, providing exceptional
              service and expertise for over 25 years.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-brand-200 transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-brand-200 transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-brand-200 transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-brand-200 transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-white/80 hover:text-brand-200 transition-smooth">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-brand-200 transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-brand-200 transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              <li className="text-white/80">Residential Sales</li>
              <li className="text-white/80">Luxury Properties</li>
              <li className="text-white/80">Investment Consulting</li>
              <li className="text-white/80">Market Analysis</li>
              <li className="text-white/80">Property Management</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-200 mt-0.5" />
                <div className="text-white/80">
                  <p>123 Main Street</p>
                  <p>Suite 100</p>
                  <p>Your City, ST 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-200" />
                <a href="tel:+15551234567" className="text-white/80 hover:text-brand-200 transition-smooth">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-200" />
                <a href="mailto:info@hodgesfooshee.com" className="text-white/80 hover:text-brand-200 transition-smooth">
                  info@hodgesfooshee.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 Hodges & Fooshee Realty. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-white/60 hover:text-brand-200 transition-smooth">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-brand-200 transition-smooth">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
