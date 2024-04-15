import { useEffect, useState } from "react";
import axios from 'axios';
const Search = () =>{
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [show, setShow] = useState(false);
    
    

  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleProductClick = (productName) => {
    setSearchTerm(productName);
    setFilteredProducts([]);
  };

    const getData = async () =>{
        try{
            const data = await axios.get("https://dummyjson.com/products?limit=100");
            setProducts(data?.data?.products);
            console.log(data?.data?.products)
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getData();
    },[])

    return(
        <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        onFocus={()=>{setShow(true)}}
        onBlur={()=>{setShow(false); setFilteredProducts([])}}
      />
      {show && filteredProducts.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 999, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,.1)', maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredProducts.map(product => (
              <li key={product.id} onClick={() => handleProductClick(product.title)} style={{ padding: '8px', cursor: 'pointer' }}>
                {product.title} - {product.description} - ${product.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    )
}

export default Search;