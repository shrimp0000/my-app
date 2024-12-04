import React from 'react';
import {useState, useEffect} from 'react';
import './CarListings.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CAR_MAKES = [
  "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
  "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Daewoo", "Daihatsu",
  "Dodge", "Donkervoort", "DS", "Ferrari", "Fiat", "Fisker", "Ford", "Honda",
  "Hummer", "Hyundai", "Infiniti", "Iveco", "Jaguar", "Jeep", "Kia", "KTM",
  "Lada", "Lamborghini", "Lancia", "Land Rover", "Landwind", "Lexus", "Lotus",
  "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini",
  "Mitsubishi", "Morgan", "Nissan", "Opel", "Peugeot", "Porsche", "Renault",
  "Rolls-Royce", "Rover", "Saab", "Seat", "Skoda", "Smart", "SsangYong",
  "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

const notify = () => {
  toast.warn('You are not logged in!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
};

function CarListings({ cars }) {
  const [conditionFilter, setConditionFilter] = useState('all');
  const [makeFilter, setMakeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    
    axios.get("http://3.15.198.73:8080/api/loggn", { withCredentials: true })
      .then(response => {
        console.log(2, response.data);
        if (response.data.status === "success") {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error("Error checking login status:", error);
        // setIsLoggedIn(false);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = "/loggn";
  };

  const handleLogout = () => {
    axios.get("http://3.15.198.73:8080/api/loggout", { withCredentials: true})
      .then(response => {
        if (response.data.status === "success") {
          setIsLoggedIn(false);
        } else {
          console.error("Failed to log out");
        }
      })
      .catch(error => {
        console.error("Error logging out:", error);
      });
  };  

  const handleConditionFilterChange = (event) => {
    setConditionFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleMakeFilterChange = (event) => {
    setMakeFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
    setCurrentPage(1);
  };

  // Check if cars is undefined or null
  if (!cars || !Array.isArray(cars)) {
    return <div></div>;
  }

  const filteredCars = cars.filter(car => {
    const price = parseInt(car.primary_price.replace(/[^0-9]/g, ''), 10);
    return (
    (conditionFilter === 'all' || car.stock_type.toLowerCase() === conditionFilter) &&
    (makeFilter === 'all' || car.make.toLowerCase() === makeFilter) &&
    (priceFilter === 'all' || 
      (priceFilter === 'low' && price < 15000) ||
      (priceFilter === 'medium' && price >= 15000 && price <= 30000) ||
      (priceFilter === 'high' && price > 30000))
    );
});

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const paginatedCars = paginate(filteredCars, carsPerPage, currentPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    
    <div className="container">
      <header className="detail-header">
        <div>
          {/* <button className="back-button" onClick={() => window.history.back()}>
            <IoMdArrowBack className="back-icon" />
            Back
          </button> */}
        </div>
        <div className="header-buttons">
          {isLoggedIn ? (
            <button className="favorites-button" onClick={() => window.location.href = "/favorites"}>
              My Favorite Cars
            </button>
          ) : (
            <button className="favorites-button" onClick={notify}>
              My Favorite Cars
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
              />
            </button>
          )

          }
          {isLoggedIn ? (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </header>
      <h1>Featured Cars</h1>
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="condition-filter">Filter by condition: </label>
          <select 
            id="condition-filter" 
            value={conditionFilter} 
            onChange={handleConditionFilterChange}
            className="filter-dropdown"
          >
            <option value="all">All Cars</option>
            <option value="new">New Cars</option>
            <option value="used">Used Cars</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="make-filter">Filter by make: </label>
          <select 
            id="make-filter" 
            value={makeFilter} 
            onChange={handleMakeFilterChange}
            className="filter-dropdown"
          >
            <option value="all">All Makes</option>
            {CAR_MAKES.map((make) => (
              <option key={make} value={make.toLowerCase()}>
                {make}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="price-filter">Filter by price: </label>
          <select 
            id="price-filter" 
            value={priceFilter} 
            onChange={handlePriceFilterChange}
            className="filter-dropdown"
          >
            <option value="all">All Prices</option>
            <option value="low">Below $15000</option>
            <option value="medium">$15000 to $30000</option>
            <option value="high">Above $30000</option>
          </select>
        </div>
      </div>
      <div className="car-grid">
        {paginatedCars.map((car, index) => (
          <div key={index} className="car-card">
            <img
              src={car.img_src[0]}
              alt={`${car.year} ${car.make} ${car.model_trim}`}
              className="car-image"
            />
            <div className="car-content">
              <div className="car-header">
                <Link 
                  to={`/car/${car.VIN}`}
                  className="car-title-link"
                >
                  <h2>{car.year} {car.make} {car.model_trim}</h2>
                </Link>
                <span className="mileage-badge">{car.mileage || '0 mi.'}</span>
              </div>
              <p className="car-price">{car.primary_price}</p>
              <div className="car-details">
                <p>{car.location || 'Location not available'}</p>
                <p>{car.dealer_name}</p>
                <p className="car-condition">Condition: {car.stock_type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CarListings;