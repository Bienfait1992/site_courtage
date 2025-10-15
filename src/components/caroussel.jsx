import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const Carousel = () => {
  const slides = [
    { id: 1, image: "/assets/images/banierespub1.jpeg", title: "Fret Aérien" },
    { id: 2, image: "/assets/images/banierepub2.jpeg", title: "Transport Maritime" },
    { id: 3, image: "/assets/images/athletisme.jpg", title: "Fret Durable" },
    
   
    
  ];

  useEffect(() => {
    console.log("Carousel monté");
    console.log("Slides disponibles :", slides);
  }, []);

  return (
    <div className="w-full md:px-48">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        onSwiper={(swiper) => console.log("👉 Swiper initialisé :", swiper)}
        onSlideChange={(swiper) =>
          console.log("🔄 Changement de slide", swiper.activeIndex)
        }
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-64 md:h-96">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};


{/* <img src="/assets/images/ituri.jpg" alt="Fret Aérien" className="w-full h-full object-cover" /> */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                {slide.title}
              </div> */}