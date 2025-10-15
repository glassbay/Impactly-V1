// Import virtualized select component
import { VirtualizedSelect } from '@/components/ui/virtualized-select';

// Update the fetch function to support pagination and search
const fetchProducts = async (searchQuery = '', page = 1) => {
  try {
    const response = await fetch(
      `/api/products?page=${page}&limit=50&search=${encodeURIComponent(searchQuery)}`
    );
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return {
      items: data.products || [],
      hasMore: data.hasMore,
      total: data.total
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { items: [], hasMore: false, total: 0 };
  }
};

// Use virtualized select with lazy loading
<VirtualizedSelect
  placeholder="Select a gift card"
  loadOptions={async (search, prevOptions) => {
    const page = Math.floor(prevOptions.length / 50) + 1;
    const result = await fetchProducts(search, page);
    return {
      options: result.items.map(product => ({
        value: product.productId.toString(),
        label: `${product.brand.brandName} - ${product.productName}`
      })),
      hasMore: result.hasMore
    };
  }}
  value={selectedProduct}
  onChange={setSelectedProduct}
  isSearchable
  isClearable
  menuPlacement="auto"
  maxMenuHeight={300}
  // Load more items when user scrolls near bottom
  onMenuScrollToBottom={loadMore}
/>
