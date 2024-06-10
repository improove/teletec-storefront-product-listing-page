import { useEffect, useRef, useState } from 'preact/compat';

import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

export const Image = ({
  image,
  alt,
  carouselIndex,
  index,
}: {
  image: { src: string; srcset: any } | string;
  alt: string;
  carouselIndex: number;
  index: number;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const entry = useIntersectionObserver(imageRef, { rootMargin: '200px' });

  useEffect(() => {
    if (!entry) return;

    if (entry?.isIntersecting && index === carouselIndex) {
      setIsVisible(true);

      setImageUrl((entry?.target as HTMLElement)?.dataset.src || '');
    }
  }, [entry, carouselIndex, index, image]);

  return (
    <img
      className="lazyloaded"
      ref={imageRef}
      src={`${imageUrl}?optimize=medium&bg-color=255,255,255&fit=bounds&height=250&width=250&canvas=250:250`}
      data-src={typeof image === 'object' ? `${image.src}?optimize=medium&bg-color=255,255,255&fit=bounds&height=250&width=250&canvas=250:250` :
        `${image}?optimize=medium&bg-color=255,255,255&fit=bounds&height=250&width=250&canvas=250:250`}
      srcset={typeof image === 'object' ? image.srcset : null}
      alt={alt}
    />
  );
};
