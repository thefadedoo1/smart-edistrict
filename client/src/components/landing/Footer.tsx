import {
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Himseva eDistrict
          </h2>

          <p className="mt-4 leading-7">
            Himseva eDistrict is a digital governance platform
            that provides transparent, accountable and
            efficient delivery of public services through
            online applications and real-time workflow
            tracking.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white">
            Quick Links
          </h3>

          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="#"
                className="hover:text-white"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-white"
              >
                Services
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-white"
              >
                Features
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-white"
              >
                Workflow
              </a>
            </li>
          </ul>
        </div>

        {/* Popular Services */}
        <div>
          <h3 className="text-xl font-semibold text-white">
            Popular Services
          </h3>

          <ul className="mt-4 space-y-3">
            <li>Income Certificate</li>
            <li>Caste Certificate</li>
            <li>Residence Certificate</li>
            <li>Character Certificate</li>
            <li>Marriage Certificate</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white">
            Contact
          </h3>

          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <MapPin
                className="mt-1"
                size={18}
              />

              <span>
                Deputy Commissioner Office,
                <br />
                Himachal Pradesh
              </span>
            </div>

            <div className="flex gap-3">
              <Phone size={18} />

              <span>1800-123-4567</span>
            </div>

            <div className="flex gap-3">
              <Mail size={18} />

              <span>
                support@himsevaedistrict.gov.in
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <Globe size={18} />
            <span>Government of Himachal Pradesh</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Himseva eDistrict Portal.
        All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;