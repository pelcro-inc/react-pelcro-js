module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT:
            "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), var(--plc-primary-lightness))",
          50: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) + 50%))",
          100: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) + 40%))",
          200: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) + 30%))",
          300: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) + 20%))",
          400: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) + 10%))",
          500: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), var(--plc-primary-lightness))",
          600: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) - 10%))",
          700: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) - 20%))",
          800: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) - 30%))",
          900: "hsl(var(--plc-primary-hue), var(--plc-primary-saturation), calc(var(--plc-primary-lightness) - 40%))"
        },
        black: "#000",
        white: "#fff",
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827"
        },
        red: {
          50: "#F4D2D1",
          100: "#EFBEBC",
          200: "#E59693",
          300: "#DB6E6A",
          400: "#D14641",
          500: "#B4302B",
          600: "#8B2521",
          700: "#621A17",
          800: "#390F0D",
          900: "#0F0404"
        },
        yellow: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f"
        },
        green: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95"
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843"
        }
      }
    }
  },
  plugins: []
};
