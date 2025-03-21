import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="space-y-4">
            <h2 className="footer-title">ShopEase</h2>
            <p className="footer-text">
              Making your shopping experience easier and more enjoyable.
            </p>
            <div className="footer-icons">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Shop</h4>
              <ul>
                <li><Link to="#">New Arrivals</Link></li>
                <li><Link to="#">Best Sellers</Link></li>
                <li><Link to="#">Sale</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="#">Contact Us</Link></li>
                <li><Link to="#">FAQs</Link></li>
                <li><Link to="#">Shipping</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><Link to="#">About Us</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} ShopEase. All rights reserved. Made with ❤️ by Zeel & Yashesh
          </p>
        </div>
      </div>
    </footer>
  );
}
