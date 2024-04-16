import { useEffect, useState } from "react";
import axios from 'axios';
const Search = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const searchTerms = e.target.value.toLowerCase().split(" ").filter(item=>item!=="");
    setSearchTerm(e.target.value);
    console.log(searchTerms);
    const filtered = products.filter(product => {
      // Check if any of the search terms are found in the title or description
      return searchTerms.some(term => {
        return product.title.toLowerCase().includes(term.toLowerCase()) ||
               product.description.toLowerCase().includes(term.toLowerCase());
      });
    });
    setFilteredProducts(filtered);
  };

  const handleProduct = (productName)=>{
    setSearchTerm(productName);
    setFilteredProducts([]);
    setShow(false);
  }

  const getData = async () => {
    try {
      const data = await axios.get("https://dummyjson.com/products?limit=100");
      setProducts(data?.data?.products);
      console.log(data?.data?.products)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  const clickedList = (e) =>{
    console.log("Heelo")
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => { setShow(true) }}
        onBlur={()=>{setTimeout(()=>setShow(false),3000)}}
      />
      {show && filteredProducts.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 999, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,.1)', maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredProducts.map(product => (
              <li key={product.id} onClick={() => handleProduct(product.title)} style={{ padding: '8px', cursor: 'pointer' }}>
                {product.title} - {product.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Search;