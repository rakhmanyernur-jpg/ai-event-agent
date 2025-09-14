extend: {
    keyframes: {
        slide: {
            "0%, 20%": { transform: "translateY(0%)" },
            "25%, 45%": { transform: "translateY(-25%)" },
            "50%, 70%": { transform: "translateY(-50%)" },
            "75%, 95%": { transform: "translateY(-75%)" },
            "100%": { transform: "translateY(0%)" },
        },
    },
    animation: {
        "slide-words": "slide 8s infinite cubic-bezier(0.77, 0, 0.175, 1)",
  },
}
