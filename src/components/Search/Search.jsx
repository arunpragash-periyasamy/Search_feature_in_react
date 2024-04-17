
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import './Search.css'

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
    setSelectedIndex(0);
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

  useEffect(() => {
    if (searchTerm === "") {
      setSelectedIndex(0);
      if (listRef.current && listRef.current.children.length > 0) {
        listRef.current.children[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [searchTerm])

  return (
    <div className="container">
  <div className="row">
    <div className="col">
      <input type="text" placeholder="Search..." value={searchTerm} onChange={handleChange} onFocus={() => { setShow(true) }} onBlur={() => { setTimeout(() => setShow(false), 2000) }} onKeyDown={handleKeyDown} ref={inputRef} className="form-control mb-3" />
      <div className="d-flex">
        <div style={{ flex: '1', height: '200px', scrollbarWidth: 'none' }} className="flex-fill overflow-hidden">
          {show && filteredProducts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: '1 1 auto' }} ref={listRef} className="list-unstyled">
                {filteredProducts.map((product, index) => (
                  <li key={product.id} onClick={() => handleProduct(product.title)} style={{ padding: '8px', cursor: 'pointer', backgroundColor: selectedIndex === index ? '#e0e0e0' : 'transparent' }}>
                    {product.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div style={{ flex: '1', maxWidth: '50%' }} className="flex-fill">
          {show && filteredProducts.length > 0 && (
            <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px' }}>
              <h3>Description</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{filteredProducts[selectedIndex]?.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default Search;