import { useState } from "react";

import { IMAGE_PLACEHOLDER } from "../../config/constants";

export default function ProductImage({ src, alt, className, style }) {
  const [currentSrc, setCurrentSrc] = useState(src || IMAGE_PLACEHOLDER);

  return (
    <img
      src={currentSrc}
      alt={alt || "Product"}
      className={className}
      style={style}
      loading="lazy"
      onError={() => {
        if (currentSrc !== IMAGE_PLACEHOLDER) {
          setCurrentSrc(IMAGE_PLACEHOLDER);
        }
      }}
    />
  );
}
