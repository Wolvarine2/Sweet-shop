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
  'Laddu',
  'Barfi',
  'Halwa',
  'Milk Sweets',
  'Dry Sweets',
  'Traditional',
] as const;

export const initialSweets: Sweet[] = [
  {
    id: '1',
    name: 'Motichoor Laddu',
    category: 'Laddu',
    price: 299,
    quantity: 50,
    description: 'Delicious tiny boondi laddus made with gram flour, ghee, and sugar syrup',
    image: '🍬',
  },
  {
    id: '2',
    name: 'Kaju Barfi',
    category: 'Barfi',
    price: 499,
    quantity: 25,
    description: 'Rich and creamy cashew barfi with a smooth, melt-in-mouth texture',
    image: '🍬',
  },
  {
    id: '3',
    name: 'Gajar Halwa',
    category: 'Halwa',
    price: 349,
    quantity: 40,
    description: 'Traditional carrot halwa cooked in milk, ghee, and garnished with dry fruits',
    image: '🍬',
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    category: 'Milk Sweets',
    price: 249,
    quantity: 60,
    description: 'Soft, spongy milk dumplings soaked in sweet rose-flavored syrup',
    image: '🍬',
  },
  {
    id: '5',
    name: 'Soan Papdi',
    category: 'Dry Sweets',
    price: 199,
    quantity: 80,
    description: 'Flaky, crispy sweet made with gram flour, ghee, and sugar',
    image: '🍬',
  },
  {
    id: '6',
    name: 'Rasgulla',
    category: 'Milk Sweets',
    price: 279,
    quantity: 50,
    description: 'Soft, spongy cottage cheese balls soaked in light sugar syrup',
    image: '🍬',
  },
  {
    id: '7',
    name: 'Besan Laddu',
    category: 'Laddu',
    price: 229,
    quantity: 45,
    description: 'Traditional gram flour laddus with ghee, sugar, and cardamom',
    image: '🍬',
  },
  {
    id: '8',
    name: 'Jalebi',
    category: 'Traditional',
    price: 179,
    quantity: 0,
    description: 'Crispy, spiral-shaped sweet made from fermented batter, deep-fried and soaked in sugar syrup',
    image: '🍬',
  },
  {
    id: '9',
    name: 'Pista Barfi',
    category: 'Barfi',
    price: 449,
    quantity: 35,
    description: 'Creamy pistachio barfi with a rich, nutty flavor',
    image: '🍬',
  },
  {
    id: '10',
    name: 'Kheer',
    category: 'Milk Sweets',
    price: 199,
    quantity: 30,
    description: 'Traditional rice pudding cooked in milk, garnished with nuts and saffron',
    image: '🍬',
  },
];
