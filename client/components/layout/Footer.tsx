import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-kanxa-navy text-white">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-kanxa-blue to-kanxa-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KS</span>
              </div>
              <span className="text-xl font-bold">Kanxa Safari</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Your trusted partner for transportation, construction materials, and machinery services. 
              Delivering excellence across Nepal with premium technology-driven solutions.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-white/60 hover:text-kanxa-blue cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-white/60 hover:text-kanxa-blue cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-white/60 hover:text-kanxa-orange cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-white/60 hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Transportation Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transportation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/buses" className="text-white/80 hover:text-kanxa-blue transition-colors">Bus Services</Link></li>
              <li><Link to="/cargo" className="text-white/80 hover:text-kanxa-blue transition-colors">Cargo Trucks</Link></li>
              <li><Link to="/tours" className="text-white/80 hover:text-kanxa-blue transition-colors">Custom Tours</Link></li>
              <li><Link to="/booking" className="text-white/80 hover:text-kanxa-blue transition-colors">Book Online</Link></li>
              <li><Link to="/routes" className="text-white/80 hover:text-kanxa-blue transition-colors">Route Information</Link></li>
            </ul>
          </div>

          {/* Construction & Garage */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/materials" className="text-white/80 hover:text-kanxa-orange transition-colors">Building Materials</Link></li>
              <li><Link to="/machinery" className="text-white/80 hover:text-kanxa-orange transition-colors">Construction Machinery</Link></li>
              <li><Link to="/garage" className="text-white/80 hover:text-kanxa-green transition-colors">Garage Services</Link></li>
              <li><Link to="/repairs" className="text-white/80 hover:text-kanxa-green transition-colors">Tractor Repairs</Link></li>
              <li><Link to="/parts" className="text-white/80 hover:text-kanxa-green transition-colors">Spare Parts</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-kanxa-blue flex-shrink-0" />
                <div>
                  <p className="text-white/80">Lamjung, Nepal</p>
                  <p className="text-white/60">Main Office & Terminal</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-kanxa-orange flex-shrink-0" />
                <p className="text-white/80">+977-XXX-XXXXXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-kanxa-green flex-shrink-0" />
                <p className="text-white/80">info@kanxasafari.com</p>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium mb-2">Operating Hours</h4>
              <div className="text-sm text-white/80 space-y-1">
                <p>Transportation: 24/7</p>
                <p>Construction: 6 AM - 8 PM</p>
                <p>Garage: 7 AM - 7 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © 2024 Kanxa Safari. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-6">
            <Link to="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link to="/support" className="text-white/60 hover:text-white text-sm transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
