'use client';

export default function Logo() {
    return (
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Rayoy logo"
        >
            {/* Orbit ring */}
            <ellipse
                cx="18"
                cy="18"
                rx="16"
                ry="16"
                stroke="#2DD4BF"
                strokeWidth="1.5"
                opacity="0.6"
            />
            {/* Smaller orbit */}
            <ellipse
                cx="18"
                cy="18"
                rx="10"
                ry="10"
                stroke="#2DD4BF"
                strokeWidth="1"
                opacity="0.3"
            />
            {/* R lettermark */}
            <text
                x="18"
                y="22"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="16"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
            >
                R
            </text>
            {/* Accent dot on orbit */}
            <circle cx="34" cy="18" r="2" fill="#2DD4BF" />
        </svg>
    );
}
