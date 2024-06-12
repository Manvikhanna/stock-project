"use client"
import Header from '@/components/Header';
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  // // Sample stock data
  // const stock = [
  //   { id: 1, name: 'Product 1', quantity: 10, Price: 50 },
  //   { id: 2, name: 'Product 2', quantity: 5, Price: 150 },
  //   { id: 3, name: 'Product 3', quantity: 15, Price: 200 },
  //   // Add more stock data as needed
  // ];

  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])

  // const [alert, setalert] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json();
      setProducts(rjson.products)

    }
    fetchProducts()
  }, [])

const buttonAction = async (action, slug, initialQuantity) => {

  let index = products.findIndex((item)=> item.slug == slug)
  let newProducts = JSON.parse(JSON.stringify(products))
  if(action == "plus")
  {
    newProducts[index].quantity = parseInt(initialQuantity) + 1
  }
  else
  {
    newProducts[index].quantity = parseInt(initialQuantity) - 1
  }
  setProducts(newProducts)

let indexdrop = dropdown.findIndex((item)=>item.slug == slug)
let newDropdown = JSON.parse(JSON.stringify(dropdown))
  if(action == "plus")
  {
    newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
  }
  else
  {
    newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
  }
  setDropdown(newDropdown)

  console.log(action,slug)
  setLoadingaction(true)
  const response = await fetch('/api/action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      action,slug,initialQuantity
    )
  });
  let r = await response.json();
  console.log(r)
  setLoadingaction(false)
}


  const addProduct = async (e) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          productForm
        )
        
      });

      if (response.ok) {
        // Product added successfully, do something
        alert('Product added successfully!');
        // setalert("Your Product has been added successfully!")
        // Clear input fields
        // console.log("Product added successfully");
        setProductForm({})
        setproductName('');
        setproductQuantity('');
        setproductQuantity('');
      }
      else {
        // Error handling
        alert('Failed to add product');
      }
    }
    catch (error) {
      console.error('Error:', error);
      alert('Failed to add product');
    }
    const response = await fetch('/api/product')
    let rjson = await response.json();
    setProducts(rjson.products)
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit = async (e) => {
    setQuery(e.target.value)
    if (!loading) {
      setLoading(true)
      setDropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json();
      setDropdown(rjson.products)
      setLoading(false)
    }
    else
    {
      setDropdown([])
    }
  }

  return (
    <>
      <Header />
      <div className='container mx-auto p-8 my-8'>
        {/* <div className="text-green-800 text-center">{alert}</div> */}
        <h1 className='text-3xl font-semibold mb-6'>Search a Product </h1>
        <div className="flex mb-2">
          <input
            // onBlur={() => { setDropdown([]) }}
            onChange={onDropdownEdit}
            type="text"
            placeholder="Search..."
            className="px-2 py-1 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          />
          <select className="px-4 py-2 border border-l-0 rounded-r-md bg-white">
            <option value="">All</option>
            <option value="product1">Category 1</option>
            <option value="product2">Category 2</option>
            <option value="product3">Category 3</option>
            {/* Add more options as needed */}
          </select>
        </div>
        {loading && <div className='flex justify-center items-center'> <svg
          width="30px"
          height="30px"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#000"
            stroke-width="8"
            fill="none"
            stroke-dasharray="180"
            stroke-dashoffset="0"
            transform="rotate(90 50 50)"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="1.5s"
              repeatCount="indefinite"
              from="0"
              to="360"
            />
          </circle>
        </svg>
        </div>
        }

        <div className='dropcontainer absolute w-[89vw] border-1 bg-blue-50 rounded-md'>

          {dropdown.map(item => {
            return <div key={item.slug} className='container flex justify-between py-3 my-2 '>

              <span className='slug'> {item.slug} ({item.quantity} available for {item.price}) </span>

              <div className='nx-5'>
                <button onClick={()=>{buttonAction("minus", item.slug, item.quantity)}} disabled={loadingaction} className="subtract inline-block px-4 py-1 cursor-pointer text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300 disabled bg-blue-200">-</button>
                <span className='quantity inline-block w-3 mx-3'> {item.quantity} </span>
                {/* <span className='subtract add px-4 py-1 bg-purple-400 rounded-xl'>-</span> */}
                <button onClick={()=>{buttonAction("plus", item.slug, item.quantity)}} disabled={loadingaction} className="add inline-block px-4 py-1 cursor-pointer text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300 disabled bg-blue-200">+</button>

              </div>
            </div>
          })}
        </div>
      </div>

      <div className='container mx-auto p-8 my-8'>
        <h1 className="text-3xl font-semibold mb-4">Add a Product</h1>
        {/* <button onClick={addProduct} type='submit' className='bg=blue-500 text-white px-4 py-2' >Add a Product</button> */}

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <label htmlFor="productName" className="block text-gray-700 font-bold mb-2">Product Slug:</label>
            <input value={productForm?.slug || ""} name='slug' onChange={handleChange} type="text" id="productName" className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="px-6 py-4">
            <label htmlFor="productQuantity" className="block text-gray-700 font-bold mb-2">Product Quantity:</label>
            <input value={productForm?.quantity || ""} name='quantity' onChange={handleChange} type="number" id="productQuantity" className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="px-6 py-4">
            <label htmlFor="productQuantity" className="block text-gray-700 font-bold mb-2">Price:</label>
            <input value={productForm?.price || ""} name='price' onChange={handleChange} type="number" id="productQuantity" className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div className="px-6 py-4">
          <button onClick={addProduct} type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:shadow-outline">
  Add Product
</button>

          </div>
        </div>
      </div>
      <div className='container my-8 mx-auto p-8'>

        <h1 className="text-3xl font-semibold mb-4">Display Current Stock</h1>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                {/* <th className="py-2 px-4">ID</th> */}
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Price</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {products.map(product => {
                return <tr key={product.slug}>
                  {/* <td className="py-2 px-4">{product.id}</td> */}
                  <td className="py-2 px-4">{product.slug}</td>
                  <td className="py-2 px-4">{product.quantity}</td>
                  <td className="py-2 px-4">{product.price}</td>
                </tr>
              })}

              {/* {stock.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.Price}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

