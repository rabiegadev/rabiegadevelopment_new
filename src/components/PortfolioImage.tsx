/* eslint-disable @next/next/no-img-element -- zewnętrzne URL bez domeny w next.config */
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

export function PortfolioImage({
  src,
  alt,
  className,
  fill,
  width = 1200,
  height = 675,
  sizes,
  priority,
}: Props) {
  if (src.startsWith("/")) {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          priority={priority}
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className ?? "absolute inset-0 h-full w-full object-cover"}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
