import Link from "next/link";

const navigation = {
  main: [
    { name: "About", href: "/" },
    // { name: "Auctions", href: "/auctions" },
    // { name: "Dealer Experience", href: "/dealer-experience" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/tnc" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link href={item.href}>
                <a className="text-base text-gray-500 hover:text-gray-900">
                  {item.name}
                </a>
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2022 Automax Solutions India Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
