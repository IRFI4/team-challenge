import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from '../Card'
import Filter from './Filter'
import Icon from '../Icon'

const Main = ({ searchQuery }) => {
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({
    category: [],
    department: [],
    sizes: [],
    colors: [],
    brands: [],
    minPrice: 5,
    maxPrice: 150,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Fetching data from products
  useEffect(() => {
    axios.get('https://6609ac0e0f324a9a28839d4e.mockapi.io/product-list/shoes/products').then(res => {
      setItems(res.data)
    })
  }, [])

  //Filtering products by parameters 
  const filteredProducts = items.filter(product => {
    const categoryMatch = (filters.category && filters.category.length === 0) || filters.category.includes(product.category)
    const departmentMatch = (filters.department && filters.department.length === 0) || filters.department.includes(product.department)
    const sizeMatch = (filters.sizes && filters.sizes.length === 0) || filters.sizes.some(size => product.sizes.includes(Number(size)))
    const colorMatch = (filters.colors && filters.colors.length === 0) || filters.colors.includes(product.color.toLowerCase())
    const brandMatch = (filters.brands && filters.brands.length === 0) || filters.brands.includes(product.brand)
    const priceMatch = product.price >= filters.minPrice && product.price <= filters.maxPrice
    return categoryMatch && departmentMatch && sizeMatch && colorMatch && brandMatch && priceMatch
  })

  //Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

  //Change page
  const paginate = (numberOfPage) => {
    setCurrentPage(numberOfPage)
    window.scrollTo(0, 0)
  }

  const nextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, pageNumbers.length))
    window.scrollTo(0, 0)
  }

  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
    window.scrollTo(0, 0)
  }

  // Setting parametrs for filter 
  const handleFilterChange = (filterType, value, checked) => {
    if (checked) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: [value]
      }))
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: value
      }))
    }
    setCurrentPage(1)
  }

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <div className='main-content'>
      <Filter onFilterChange={handleFilterChange} />
      <main>
        {currentItems.filter(item => item.description.toLowerCase().includes(searchQuery.toLowerCase())).map(obj => <Card
          key={obj.id}
          id={obj.id}
          object={obj}
          image={obj.imageUrl}
          brand={obj.brand}
          label={obj.label}
          discount={obj.discount}
          description={obj.description}
          price={obj.price}
          sizes={obj.sizes}
        />)}

        <div className='pagination'>
          <div onClick={prevPage} className='page'>
            <Icon id='paginate-arrow' className='paginate-arrow prev' />
          </div>

          {pageNumbers.map(number =>
            <div key={number} onClick={() =>
              paginate(number)} className={number !== currentPage ? 'page' : 'page active'} >{number}</div>
          )}

          <div onClick={nextPage} className='page'>
            <Icon id='paginate-arrow' className='paginate-arrow next' />
          </div>
        </div>

      </main>

    </div>
  )
}

export default Main