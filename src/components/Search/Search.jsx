import { useEffect, useState, useRef } from "react";
import axios from 'axios';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const handleChange = (e) => {
    setShow(true);
    const searchTerms = e.target.value.toLowerCase().split(" ").filter(item => item !== "");
    setSearchTerm(e.target.value);

    const filtered = products.filter(product => {
      return searchTerms.every(term => {
        return product.title.toLowerCase().includes(term) || product.description.toLowerCase().includes(term);
      });
    });

    setFilteredProducts(filtered);
    setSelectedIndex(0);
  };

  const handleProduct = (productName) => {
    setSearchTerm(productName);
    setFilteredProducts([]);
    setShow(false);
    setSelectedIndex(-1);
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      listRef.current.children[selectedIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (e.key === "ArrowDown" && selectedIndex < filteredProducts.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      listRef.current.children[selectedIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (e.key === "Enter") {
      if (selectedIndex !== -1) {
        handleProduct(filteredProducts[selectedIndex].title);
      } else if (filteredProducts.length > 0) {
        handleProduct(filteredProducts[0].title);
      }
    }
  }

  const getData = async () => {
    try {
      const data = await axios.get("https://dummyjson.com/products?limit=100");
      setProducts(data?.data?.products);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show])

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => { setShow(true) }}
        onBlur={() => { setTimeout(() => setShow(false), 3000) }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      {show && filteredProducts.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 999, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,.1)', maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} ref={listRef}>
            {filteredProducts.map((product, index) => (
              <li
                key={product.id}
                onClick={() => handleProduct(product.title)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedIndex === index ? '#f0f0f0' : 'transparent'
                }}
              >
                {product.title} - {product.description}
              </li>
            ))}
            {filteredProducts.length === 0 && (
              <li style={{ padding: '8px' }}>No products found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Search;