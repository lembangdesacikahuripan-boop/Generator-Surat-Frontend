tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "primary": "#52796f",
                "accent": "#84a98c",
                "sidebar": "#2f3e46",
                "app-bg": "#cad2c5",
                "secondary": "#354f52",
                "soft-accent": "#84a98c",
                "heading": "#2f3e46",
                "surface": "#ffffff",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f2f4f6",
                "surface-container": "#eceef0",
                "surface-container-high": "#e6e8ea",
                "surface-bright": "#ffffff",
                "on-surface": "#191c1e",
                "background": "#F2F2ED",
                "error": "#ba1a1a",
                "error-container": "#ffdad6"
            },
            "borderRadius": {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
            },
            "spacing": {
                "container-max-width": "1280px",
                "sidebar-width": "260px",
                "gutter": "24px",
                "stack-sm": "8px",
                "stack-md": "16px",
                "stack-lg": "32px"
            },
            "fontFamily": {
                "label-caps": ["Poppins", "sans-serif"],
                "body-md": ["Poppins", "sans-serif"],
                "title-sm": ["Poppins", "sans-serif"],
                "body-sm": ["Poppins", "sans-serif"],
                "display-lg": ["Poppins", "sans-serif"],
                "headline-md": ["Poppins", "sans-serif"]
            },
            "fontSize": {
                "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700" }],
                "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                "title-sm": ["18px", { "lineHeight": "24px", "fontWeight": "600" }],
                "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                "display-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }]
            }
        }
    }
}