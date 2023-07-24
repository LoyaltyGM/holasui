import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

export const MainImageLoading = ({ src, placeholderSrc, className, ...props }) => {
    const [imageSrc, setImageSrc] = useState(placeholderSrc);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImageSrc(src);
            setLoading(false);
        };
    }, [src]);

    return (
        <motion.img
            src={imageSrc}
            alt={props.alt || ""}
            className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}
        />
    );
};
