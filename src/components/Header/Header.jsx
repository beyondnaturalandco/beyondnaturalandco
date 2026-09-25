import { useEffect, useRef, useState } from "react";
import "./Header.css";

const slides = [
  {
    src: `${import.meta.env.BASE_URL}intro.webp`,
    alt: "Beyond Natural & Co. opening announcement with featured food",
  },
  {
    src: `${import.meta.env.BASE_URL}sweet-chili-crunch.webp`,
    alt: "Sweet Chili Crunch salad from Beyond Natural & Co.",
  },
  {
    src: `${import.meta.env.BASE_URL}ginger-soy-salmon.webp`,
    alt: "Ginger Soy Salmon grain bowl from Beyond Natural & Co.",
  },
];

const Header = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(null);

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = window.setInterval(showNext, 6000);
    return () => window.clearInterval(timer);
  }, [activeSlide]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = touchStartX.current - endX;
    touchStartX.current = null;

    if (Math.abs(distance) < 45) return;
    distance > 0 ? showNext() : showPrevious();
  };

  return (
    <header
      className="header header-slider"
      aria-label="Featured Beyond Natural menu"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="header-slides">
        {slides.map((slide, index) => (
          <div
            className={`header-slide ${index === activeSlide ? "active" : ""}`}
            key={slide.src}
            aria-hidden={index !== activeSlide}
          >
            <div
              className="header-slide-backdrop"
              style={{ backgroundImage: `url("${slide.src}")` }}
              aria-hidden="true"
            />
            <img
              src={slide.src}
              alt={slide.alt}
              className="header-slide-image"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="slider-arrow slider-arrow--left"
        onClick={showPrevious}
        aria-label="Previous featured item"
      >
        ‹
      </button>

      <button
        type="button"
        className="slider-arrow slider-arrow--right"
        onClick={showNext}
        aria-label="Next featured item"
      >
        ›
      </button>

      <div className="slider-dots" aria-label="Choose featured item">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.src}
            className={index === activeSlide ? "active" : ""}
            onClick={() => setActiveSlide(index)}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
