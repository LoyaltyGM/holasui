const plugin = require('tailwindcss/plugin');

module.exports = {
    content: ["./src/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    plugins: [
    ],
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },

        extend: {
            colors: {
                // primary colors
                bgColor: "#FEF7EC",
                darkColor: "#171717",
                redColor: "#E15A8C",
                yellowColor: "#FEB958",
                yellowColorHover: "#e5a44a",
                purpleColor: "#5A5A95",
                orangeColor: "#FB7850",

                purple: "#7343DF",
                gray: "#F2F3F4",
                white: "#FFFFFF",
                graySupport: "#666666",
                // text
                black: "#1C1823",
                black2: "#322F37",
                gray2: "#AAAAAA",
                gray3: "#CCCCCC",
                // additional colors
                yellow: "#F8E155",
                pink: "#EF5390",
                lilac: "#E3D9F9",
                darkBlue: "#1E1E30", //70% transparent
                gray5: "#AAAAAB",    // 50% transparent
                // button
                btnHover: "#5E37B5",
                btnActive: "#885CEB",
                btnDisabled: "#E0E0E0",
                // Alert
                green: "#54A547",
                red: "#EB4747"
                
            },
            fontFamily: {
                'body': ["Inter"],
                "sans": ["Inter"]
            }
        },
    },
};
