// Placeholder product data for development
// Real product data will come from the backend API

export const categories = [
  { id: 'tomatoes', name: 'Tomatoes', icon: '🍅', description: 'Premium Italian tomatoes' },
  { id: 'pasta', name: 'Pasta', icon: '🍝', description: 'Authentic Italian pasta' },
  { id: 'olive-oils', name: 'Olive Oils', icon: '🫒', description: 'Extra virgin & specialty oils' },
  { id: 'wines', name: 'Wines', icon: '🍷', description: 'Fine Italian wines' },
  { id: 'truffles', name: 'Truffles', icon: '🍄', description: 'Premium truffle products' },
  { id: 'infused-oils', name: 'Infused Oils', icon: '🌿', description: 'Flavored specialty oils' },
  { id: 'legumes', name: 'Legumes', icon: '🫘', description: 'Beans, peas & lentils' },
  { id: 'vinegar', name: 'Vinegar', icon: '🫙', description: 'Artisanal vinegars' },
];

export const products = Array.from({ length: 24 }, (_, i) => {
  const num = i + 1;
  const categoryIndex = i % categories.length;
  const category = categories[categoryIndex];
  const prices = [4.99, 6.99, 8.99, 12.99, 14.99, 18.99, 22.99, 29.99];
  const price = prices[i % prices.length];

  return {
    id: num,
    name: `Item ${num}`,
    price,
    category: category.id,
    categoryName: category.name,
    description: `Premium quality ${category.name.toLowerCase()} product. Sourced directly from Italian producers with authentic Mediterranean flavor.`,
    image: null, // placeholder — will use CSS background
  };
});

export const featuredProducts = products.slice(0, 6);

export const getProductById = (id) => products.find((p) => p.id === Number(id));

export const getProductsByCategory = (categoryId) =>
  categoryId === 'all'
    ? products
    : products.filter((p) => p.category === categoryId);
