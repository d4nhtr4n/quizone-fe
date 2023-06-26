import { forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import images from "~/components/assets/images";
import styles from "./Image.module.scss";

const Image = forwardRef(
    (
        {
            src,
            alt,
            className,
            fallback: customFallback = images.noImage,
            small = false,
            ...props
        },
        ref
    ) => {
        if (small) customFallback = images.noImageSm;

        const handleError = (e) => {
            e.target.src = customFallback;
        };

        return (
            <img
                className={classNames(styles.wrapper, className)}
                ref={ref}
                src={src}
                alt={alt}
                loading="lazy"
                {...props}
                onError={handleError}
            />
        );
    }
);

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
};

export default Image;
