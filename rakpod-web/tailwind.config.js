module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        iphoneSE: "320px",
        // => @media (min-width: 640px) { ... }

        ipad: "820px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1280px",
        // => @media (min-width: 1280px) { ... }
      },
    },
    fontFamily: {
      'Nato': ['Noto Sans Thai', "sans-serif"],
      // 'Sora': ['Sora', 'sans-serif'],
      // 'All': ['Sora','Noto Sans Thai','sans-serif']
    },
    preserts:[
      '@babel/preset-env',
      '@babel/preset-react',
    ]
    
  },
  plugins: [require("daisyui")],
};
