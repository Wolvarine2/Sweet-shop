export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
  imageUrl?: string; // Optional image URL from backend
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export const categories = [
  'Chocolates',
  'Gummies',
  'Hard Candy',
  'Lollipops',
  'Caramels',
  'Mints',
] as const;

export const initialSweets: Sweet[] = [
  {
    id: '1',
    name: 'Rainbow Gummy Bears',
    category: 'Gummies',
    price: 149,
    quantity: 50,
    description: 'Colorful, chewy gummy bears in assorted fruit flavors',
    image: '🐻',
  },
  {
    id: '2',
    name: 'Dark Chocolate Truffles',
    category: 'Chocolates',
    price: 399,
    quantity: 25,
    description: 'Rich, velvety dark chocolate truffles with a smooth center',
    image: '🍫',
  },
  {
    id: '3',
    name: 'Strawberry Lollipops',
    category: 'Lollipops',
    price: 49,
    quantity: 100,
    description: 'Sweet strawberry flavored lollipops on a stick',
    image: '🍭',
  },
  {
    id: '4',
    name: 'Salted Caramels',
    category: 'Caramels',
    price: 249,
    quantity: 40,
    description: 'Buttery caramels with a hint of sea salt',
    image: '🍬',
  },
  {
    id: '5',
    name: 'Peppermint Drops',
    category: 'Mints',
    price: 99,
    quantity: 80,
    description: 'Refreshing peppermint hard candies',
    image: '🌿',
  },
  {
    id: '6',
    name: 'Sour Worms',
    category: 'Gummies',
    price: 179,
    quantity: 60,
    description: 'Tangy sour gummy worms in neon colors',
    image: '🪱',
  },
  {
    id: '7',
    name: 'Milk Chocolate Bar',
    category: 'Chocolates',
    price: 199,
    quantity: 35,
    description: 'Creamy milk chocolate bar with smooth texture',
    image: '🍫',
  },
  {
    id: '8',
    name: 'Fruit Hard Candy',
    category: 'Hard Candy',
    price: 79,
    quantity: 0,
    description: 'Assorted fruit flavored hard candies',
    image: '🍬',
  },
  {
    id: '9',
    name: 'Swirl Lollipop',
    category: 'Lollipops',
    price: 129,
    quantity: 45,
    description: 'Large colorful swirl lollipop with multiple flavors',
    image: '🍭',
  },
  {
    id: '10',
    name: 'Butter Toffee',
    category: 'Caramels',
    price: 219,
    quantity: 30,
    description: 'Traditional English butter toffee',
    image: '🧈',
  },
];
