import React, { useEffect, useState } from 'react'
import { styles } from '../assets/dummyadmin'
import { FiHeart, FiStar, FiTrash2 } from 'react-icons/fi';
import { MdFastfood } from 'react-icons/md';
import axios from 'axios'

const List = () => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/items');
        setItems(data);
      } catch (error) {
        console.error('Error fetching items: ', error);
      } finally {
        setLoading(false)
      }
    };
    fetchItems();
  }, []);

  //DELETE ITEMS

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/items/${itemId}`)
      setItems(prev => prev.filter(item => item._id !== itemId))
      console.log('Deleted item ID: ', itemId)
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar className={`text-xl ${i < rating ? 'text-amber-400 fill-current' :
        'text-amber-100/30'
        }`}
        key={i} />
    ))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center p-6">
        <div className="text-center">
          {/* Animated loading icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-amber-800/80 to-orange-800/80 backdrop-blur-sm rounded-full p-6 border border-amber-400/30 shadow-2xl">
              <MdFastfood className="text-6xl text-amber-300 animate-spin" style={{ animationDuration: '2s' }} />
            </div>
          </div>

          {/* Loading text */}
          <h2 className="text-3xl font-bold text-amber-100 mb-2">Loading List</h2>
          <p className="text-amber-200/70">Fetching your delicious menu items...</p>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <div className='max-w-7xl mx-auto'>
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>
            Manage Menu Items
          </h2>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>
                    Image
                  </th>
                  <th className={styles.th}>
                    Name
                  </th>
                  <th className={styles.th}>
                    Category
                  </th>
                  <th className={styles.th}>
                    Price(₹)
                  </th>
                  <th className={styles.th}>
                    Rating
                  </th>
                  <th className={styles.th}>
                    Hearts
                  </th>
                  <th className={styles.thCenter}>
                    Delete
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map(item => (
                  <tr key={item._id} className={styles.tr}>
                    <td className={styles.imgCell}>
                      <img src={item.imageUrl} alt={item.name}
                        className={styles.img} />
                    </td>
                    <td className={styles.nameCell}>
                      <div className='space-y-1'>
                        <p className={styles.nameText}>{item.name}</p>
                        <p className={styles.descText}>{item.description}</p>
                      </div>
                    </td>

                    <td className={styles.categoryCell}>
                      {item.category}
                    </td>
                    <td className={styles.priceCell}>₹{item.price}</td>
                    <td className={styles.ratingCell}>
                      <div className='flex gap-1'>{renderStars(item.rating)}</div>
                    </td>
                    <td className={styles.heartsCell}>
                      <div className={styles.heartsWrapper}>
                        <FiHeart className='text-xl' />
                        <span >{item.hearts}</span>
                      </div>
                    </td>
                    <td className='p-4 text-center'>
                      <button onClick={() => handleDelete(item._id)}
                        className={styles.deleteBtn}>
                        <FiTrash2 className='text-2xl' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className={styles.emptyState}>
              No items found in the menu
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default List