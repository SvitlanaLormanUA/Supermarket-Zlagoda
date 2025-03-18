import React from 'react';
import Slider from 'react-slick';

function Dashboard() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Supermarket Zlagoda</h1>

      <div className="dashboard-columns">
        <div className="slider-column">
          <Slider {...sliderSettings}>
            <div className="slider-image-wrapper">
              <img src="/assets/images/market.png" alt="Slide 1" />
            </div>
            <div className="slider-image-wrapper">
              <img src="/assets/images/market (1).png" alt="Slide 2" />
            </div>
            <div className="slider-image-wrapper">
              <img src="/assets/images/market (2).png" alt="Slide 3" />
            </div>
            <div className="slider-image-wrapper">
              <img src="/assets/images/market (3).png" alt="Slide 3" />
            </div>
            <div className="slider-image-wrapper">
              <img src="/assets/images/market (4).png" alt="Slide 3" />
            </div>
          </Slider>
        </div>

        <div className="info-column">
          <div className="info-box">
            <div className="text-box">
              <h3>-30% SALES</h3>
              <p>Tomorrow only: 30% discount on products!</p>
            </div>
            <img src="/assets/images/price-tag.png" alt="Image 1" className="info-image" />
          </div>

          <div className="info-box">
            <div className="text-box">
              <h3>New Stock</h3>
              <p>New stock arriving soon!</p>
            </div>
            <img src="/assets/images/box.png" alt="Image 2" className="info-image" />
          </div>
          <div className="info-box">
            <div className="text-box">
              <h3>Coming Soon</h3>
              <p>New products will be available in the store soon</p>
            </div>
            <img src="/assets/images/coming-soon.png" alt="Image 3" className="info-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
