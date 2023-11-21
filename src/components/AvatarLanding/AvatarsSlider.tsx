import Slider from 'react-slick';
import { Box } from '@chakra-ui/react';

import Image1 from './images/slider/1.png';
import Image2 from './images/slider/2.png';
import Image3 from './images/slider/3.png';
import Image4 from './images/slider/4.png';
import Image5 from './images/slider/5.png';
import Image6 from './images/slider/6.png';
import Image7 from './images/slider/7.png';
import Image8 from './images/slider/8.png';
import Image9 from './images/slider/9.png';
import Image10 from './images/slider/10.png';
import Image11 from './images/slider/11.png';
import Image12 from './images/slider/12.png';

import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

const settings = {
  className: 'center',
  centerMode: true,
  centerPadding: '-15px',
  dots: true,
  infinite: true,
  speed: 200,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1023,
      settings: {
        arrows: false,
      },
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false,
      },
    },
  ],
};

const images = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
  Image9,
  Image10,
  Image11,
  Image12,
];

export const AvatarsSlider = () => {
  return (
    <Box mt="50px">
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index} pr={{ sm: '5px', xl: '30px' }}>
            <img src={image} alt="slider item" className="slider-image" />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
