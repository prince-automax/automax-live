    module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': {
                    DEFAULT: '#1E3A8A',
                    hover: '#1E40AF'
                },
                'secondary': {
                    DEFAULT: '#F09720',
                    hover: '#FBBF24'
                },
                blue: {
                    900: '#031B4D',
                },
            }
        },
        fontFamily:{
            poppins:["Poppins","sans-serif"],
            inter:["Inter"],
            ubuntu:["Ubuntu"],
            roboto:["Roboto"]
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('tailwind-scrollbar-hide')
    ],
}