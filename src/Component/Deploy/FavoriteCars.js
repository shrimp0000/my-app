import React from 'react';
import {useState, useEffect} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import './FavoriteCars.css';
import { IoMdArrowBack } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

function FavoriteCars({ cars }) {
  
  const [FavCars, setFavCars] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 10;
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   axios.get("http://localhost:5000/loggn", { withCredentials: true })
  //     .then(response => {
  //       if (response.data.status === "success") {
  //         setIsLoggedIn(true);
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error checking login status:", error);
  //       // setIsLoggedIn(false);
  //     });
  // }, []);

  // const handleLogin = () => {
  //   window.location.href = "http://localhost:3000/loggn";
  // };

  // const handleLogout = () => {
  //   axios.get("http://localhost:5000/loggout", { withCredentials: true})
  //     .then(response => {
  //       if (response.data.status === "success") {
  //         setIsLoggedIn(false);
  //       } else {
  //         console.error("Failed to log out");
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error logging out:", error);
  //     });
  // };  

  const deleteFavCar = async (VIN) => {
    try {
      const response = await axios.delete("http://18.224.62.233:8080/api/favorites",{
        headers: {
          "Content-Type": "application/json",
        },
        data: {vin: VIN},
        withCredentials: true
      });
      if (response.status === 200) {
        fetchFavCars();
      } else {
        console.error("Failed to delete favorite car");
      }
    } catch (error) {
      console.error("Error deleting favorite car:", error);
    }
  }

  const fetchFavCars = async () => {
    try {
      const response = await axios.get("http://18.224.62.233:8080/api/favorites", {
        withCredentials: true
      });
      if (response.status === 200) {
        setFavCars(response.data);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch favorite cars");
      }
    } catch (error) {
      console.error("Error fetching favorite cars:", error);
    }
  };

  useEffect(() => {
    fetchFavCars();
  }, []);

  if (!cars || !Array.isArray(cars)) {
    return <div></div>;
  }

  if (!FavCars) {
    return <div></div>;
  }
  
  const favoriteCarData = cars.filter(car => FavCars.favorites?.includes(car.VIN));
  console.log(favoriteCarData);


  const totalPages = Math.ceil(favoriteCarData.length / carsPerPage);
  const paginatedCars = paginate(favoriteCarData, carsPerPage, currentPage);
  console.log(paginatedCars);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="favorite-cars-layout">
      {/* <nav className="sidebar">
        <div className="sidebar-brand">Menu</div>
        <div className="sidebar-menu">
          <Link to="/" className="menu-item">Dashboard</Link>
          <Link to="/cars" className="menu-item active">All Cars</Link>
          <Link to="/testLogin" className="menu-item">Test Login</Link>
          <Link to="/favorites" className="menu-item">Favorite Cars</Link>
          <Link to="/ABC" className="menu-item">ABC</Link>
          <Link to="/ABC" className="menu-item">ABC</Link>
          <Link to="/ABC" className="menu-item">ABC</Link>
          <Link to="/ABC" className="menu-item">ABC</Link>
        </div>
        <div className="sidebar-footer">
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
      </nav> */}

      <div className="main-content">
        <header className="detail-header">
          <div>
            <button className="back-button" onClick={() => window.history.back()}>
              <IoMdArrowBack className="back-icon" />
              Back
            </button>
          </div>
          {/* <div className="header-buttons">
            {isLoggedIn ? (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="login-button" onClick={handleLogin}>
                Login
              </button>
            )}
          </div> */}
        </header>    
        <h1>My Favorite Cars</h1>
        <div className="car-grid">
          {paginatedCars.length === 0 ? "No favorite cars found" :
           paginatedCars.map((car, index) => (
            <div key={index} className="car-card">
              <div className="img-container">
                <button className="favorite-car-button" onClick={() => deleteFavCar(car.VIN)}>
                  <IoMdClose color="black"/>
                </button>
                <img
                  src={car.img_src[0]}
                  alt={`${car.year} ${car.make} ${car.model_trim}`}
                  className="car-image"
                />
              </div>
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
    </div>
  );
  
}

export default FavoriteCars;