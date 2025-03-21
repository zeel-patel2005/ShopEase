import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-10">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">ShopEase</h2>
            <p className="text-gray-600 max-w-xs">Making your shopping experience easier and more enjoyable.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Shop Column */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    Shipping
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ShopEase. All rights reserved. Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}

