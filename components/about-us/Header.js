"use client"
import React from "react";

export default function Header() {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <section className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">About Us</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-6xl mx-auto">
            Automax Solutions India Private Limited, also known as <span className="font-semibold text-indigo-600">AUTOBSe</span>, is a premier vehicle auction company committed to revolutionizing the way people buy and sell vehicles. With a deep understanding of the automotive market and a passion for innovation, we provide a dynamic and transparent auction platform for buyers and sellers alike.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mt-4">
            Incorporated on 24 May 2021, we are dedicated to providing a reliable vehicle auction platform with excellent customer service and a broad selection of vehicles to meet every need.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mt-4">
            We specialize in connecting buyers and sellers through a seamless and exciting vehicle auction experience.
          </p>
        </section>

        <section className="mb-12">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              "Our mission is to facilitate seamless transactions and exceptional value in the automotive marketplace, providing a trusted platform where buyers and sellers connect to achieve optimal outcomes with integrity, efficiency, and unparalleled customer service."
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              "Our vision is to create a dynamic and trusted marketplace where automotive enthusiasts and industry professionals converge to seamlessly buy and sell vehicles. Through innovative technology, transparent processes, and personalized service, we aim to become the preferred platform for individuals and businesses seeking efficient, reliable, and rewarding vehicle auctions. Our goal is to empower our community to achieve their automotive aspirations with confidence and ease."
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-500 rounded-full">
                  <span className="text-white text-2xl font-semibold">T</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-gray-800">Transparency</h3>
                  <p className="text-lg text-gray-600">
                    We believe in a fair and open bidding process, providing comprehensive vehicle information to help buyers make informed decisions.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-500 rounded-full">
                  <span className="text-white text-2xl font-semibold">C</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-gray-800">Customer Focus</h3>
                  <p className="text-lg text-gray-600">
                    Our customers are at the heart of everything we do. We are dedicated to offering personalized support and guidance throughout the auction process.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-500 rounded-full">
                  <span className="text-white text-2xl font-semibold">I</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-gray-800">Innovation</h3>
                  <p className="text-lg text-gray-600">
                    We continuously seek to enhance our platform with cutting-edge technology to ensure a seamless and enjoyable user experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-500 rounded-full">
                  <span className="text-white text-2xl font-semibold">I</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-gray-800">Integrity</h3>
                  <p className="text-lg text-gray-600">
                    We uphold the highest standards of honesty and integrity in all our transactions and interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our History</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded with a vision to transform the vehicle auction industry, AUTOBSE - Automax Solutions has grown into a trusted name in automotive auctions. Our journey is marked by continuous growth, innovation, and a steadfast commitment to our clients.
            </p>
          </div>
        </section>

        <section>
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Board of Directors</h2>
            <div className="space-y-4 grid grid-cols-1">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Mohammedkutty T K</h3>
                <p className="text-lg text-gray-600">Chairman</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Mohammed Shihaz</h3>
                <p className="text-lg text-gray-600">Managing Director</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">C. Anand Kumar</h3>
                <p className="text-lg text-gray-600">CEO</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
