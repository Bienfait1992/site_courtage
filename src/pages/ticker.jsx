import React from 'react';
import { HorizontalTicker } from 'react-infinite-ticker';

const items = [
  { id: 1, image: '/assets/images/ituri.jpg', alt: 'Fret Aérien' },
  { id: 2, image: '/assets/images/dev.jpg', alt: 'Transport Maritime' },
  { id: 3, image: '/assets/images/athletisme.jpg', alt: 'Fret Durable' },
  { id: 4, image: '/assets/images/ituri.jpg', alt: 'Livraison Express' },
  { id: 5, image: '/assets/images/dev.jpg', alt: 'Stockage Sécurisé' },
  { id: 6, image: '/assets/images/athletisme.jpg', alt: 'Solutions Sur Mesure' },
];

const Ticker = () => (
    <div className='md:px-48 mt-4'>
  <HorizontalTicker duration={15000}>
    {items.map(item => (
      <img
        key={item.id}
        src={item.image}
        alt={item.alt}
        className="h-10 mx-10 object-cover rounded"
      />
    ))}
  </HorizontalTicker>
  </div>
);

export default Ticker;
