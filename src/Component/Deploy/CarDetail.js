import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Share2, Heart, MoreHorizontal, Mail, Phone } from 'lucide-react';
import './CarDetail.css';
import {useState, useEffect} from 'react';
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { MdOutlineArrowOutward } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { useRef } from "react";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

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

function CarDetail({ cars }) {
  const { vin } = useParams();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesPerPage = 4;
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (cars && Array.isArray(cars)) {
      setMainImage(cars.find(c => c.VIN === vin).img_src[0]);
    }
  }, [cars, vin]);

  useEffect(() => {
    axios.get("http://18.224.62.233:8080/api/loggn", { withCredentials: true })
      .then(response => {
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
    axios.get("http://18.224.62.233:8080/api/loggout", { withCredentials: true})
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

  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await axios.get("http://18.224.62.233:8080/api/favorites", {
        withCredentials: true
      });
      return response.data.favorites;
    },
    cacheTime: Infinity,
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://18.224.62.233:8080/api/favorites",
        {vin: car.VIN},
        {withCredentials: true}
      );
      return response.data;
    },
    onSuccess: () => {
      // refetch();
      queryClient.invalidateQueries({queryKey: ['favorites']});
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete("http://18.224.62.233:8080/api/favorites", {
        data: {vin: car.VIN},
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: () => {
      // refetch();
      queryClient.invalidateQueries({queryKey: ['favorites']});
    },
  });

  if (!cars || !Array.isArray(cars)) {
    return <div></div>;
  }

  const car = cars.find(c => c.VIN === vin);

  if (!car) {
    return <div>Car not found</div>;
  }


  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - imagesPerPage, 0));
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + imagesPerPage, car.img_src.length - imagesPerPage)
    );
  };

  const isFavorited = favorites?.includes(car.VIN);

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      notify();
      return;
    }
    if (isFavorited) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const visibleImages = car.img_src.slice(currentIndex, currentIndex + imagesPerPage);

  const handleThumbnailClick = (img) => {
    setMainImage(img); // Update the main image when a thumbnail is clicked
  };


  // const handleFavoriteClick = async () => {
  //   const newFavoriteStatus = !isFavorited;
  //   setIsFavorited(newFavoriteStatus);

  //   if (newFavoriteStatus) {
  //     try {
  //       // add car to favorites
  //       // console.log(car.VIN);
  //       const response = await axios.post("http://localhost:5000/favorites", {
  //         vin: car.VIN,
  //       }, {
  //         withCredentials: true // Include cookies in the request
  //       });

  //       if (response.status === 200) {
  //         // console.log(document.cookie);
  //         console.log("Car added to favorites", response.data);
  //       } else {
  //         console.error("Failed to add car to favorites");
  //       }
  //     } catch (error) {
  //       console.error("Error adding car to favorites:", error);
  //     }
  //   } else {
  //     // remove car from favorites
  //     try {
  //       const response = await axios.delete("http://localhost:5000/favorites", {
  //         data: {
  //           vin: car.VIN,
  //         },
  //         withCredentials: true // Include cookies in the request
  //       });

  //       if (response.status === 200) {
  //         // console.log(document.cookie);
  //         console.log("Car removed from favorites", response.data);
  //       } else {
  //         console.error("Failed to remove car from favorites");
  //       }
  //     } catch (error) {
  //       console.error("Error removing car from favorites:", error);
  //     }
  //   }
  // };

  return (
    <div className="car-detail-layout">

      {/* Sidebar Navigation */}
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

      {/* Main Content */}
      <main className="main-content">
        <header className="detail-header">
          <div>
            <button className="back-button" onClick={() => window.history.back()}>
              <IoMdArrowBack className="back-icon" />
              Back
            </button>
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
            )}
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
        <h1 className="car-name">{car.year} {car.make} {car.model_trim}</h1>

        <div className="car-detail-content">
          <div className="car-images-and-info">
            <div className="car-images">
              <div className="thumbnail-column">
                <button className="scroll-button left" onClick={scrollLeft} disabled={currentIndex === 0}>
                  <FaCaretUp />
                </button>
                {visibleImages.map((img, index) => (
                  <img
                    src={img}
                    alt={`Thumbnail view ${currentIndex + index + 1}`}
                    className="thumbnail"
                    key={currentIndex + index}
                    onClick={() => handleThumbnailClick(img)} // Make the thumbnail clickable
                    style={{
                      border: mainImage === img ? "2px solid #6c5ce7" : "none", // Highlight selected thumbnail
                    }}
                  />
                ))}
                <button
                  className="scroll-button right"
                  onClick={scrollRight}
                  disabled={currentIndex + imagesPerPage >= car.img_src.length}
                >
                  <FaCaretDown />
                </button>
              </div>

              <div className="main-image-container">
                {isLoading ? (
                  <button className="perfect-fit-badge" disabled>
                    Loading...
                  </button>
                ) : (
                  <button className="perfect-fit-badge" onClick={() => handleFavoriteClick()}>
                    <Star className="star-icon" style={{ color: isFavorited ? "red" : "black" }} />
                    {isFavorited ? 'Unfavorite' : 'Favorite'}
                  </button>
                )}
                <img src={mainImage} alt={`${car.year} ${car.make} ${car.model_trim}`} className="main-image" />
                {/* <img src={car.img_src} alt={`${car.year} ${car.make} ${car.model_trim}`} className="main-image" /> */}
              </div>
            </div>
            
            <div className="car-info">
              <div className="price-section">
                <h2>{car.primary_price.toLocaleString()}</h2>
                <div className="location">
                  <IoLocationOutline />
                  {car.location}
                </div>
              </div>

              {/* <div className="action-buttons">
                <button className="action-btn"><Share2 /></button>
                <button className="action-btn"><Heart /></button>
                <button className="action-btn"><MoreHorizontal /></button>
              </div> */}

              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Condition:</span>
                  <span className="spec-value">{car.stock_type}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Mileage:</span>
                  <span className="spec-value">{car.mileage}</span>
                </div>
              </div>

              <div className="overview-section">
                <h3>Overview</h3>
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="overview-label">Color: </span>
                    <span className="overview-value">{car["Exterior color"]}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Fuel Type: </span>
                    <span className="overview-value">{car["Fuel type"]}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">MPG: </span>
                    <span className="overview-value">{car.MPG}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">VIN: </span>
                    <span className="overview-value">{car.VIN}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="staff-and-reviews">
            <div className="staff-bio">
              <h3>{car.seller_info}</h3>
              <div className="staff-profile">
                {/* <img src="/placeholder.svg?height=80&width=80" alt="Staff" className="staff-image" /> */}
                <h4>{car.seller_address}</h4>
                <a href={car.seller_website} target="_blank" rel="noopener noreferrer" className="seller-website">
                  Seller Website
                  <GoArrowUpRight />
                </a>
                <button 
                  className="car-on-seller-website" 
                  onClick={() => window.open(car.car_on_seller_website, '_blank')}
                >
                  See Car on {car.seller_info}
                </button>
              </div>
            </div>

            <div className="car-reviews">
              <h3>Car Reviews</h3>
              <div className="rating-display">
                <span className="rating-number">{car.car_rating}</span>
                <div className="stars" aria-label={`Rated ${car.car_rating} out of 5 stars`}>
                  {[...Array(5)].map((_, index) => (
                    <span 
                      key={index} 
                      className={`star ${index < Math.floor(car.car_rating) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <a href={car.car_total_reviews} className="reviews-link">
                  (See all {car.car_total_reviews_text?.replace(/[()]/g, '')??'0 reviews'})
                </a>
              </div>
              <h4 className="recent-reviews-header">Most Recent Reviews:</h4>
              <div className="review-container">
                <div className="rating-row">
                  <span className="rating-number">{car.review_1_rating}</span>
                  <div className="stars" aria-label={`Rated ${car.review_1_rating} out of 5 stars`}>
                    {[...Array(5)].map((_, index) => (
                      <span 
                        key={index} 
                        className={`star ${index < car.review_1_rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              
                <h3 className="review-title">{car.review_1_heading}</h3>
                <p className="review-text">{car.review_1_text}</p>

                <div className="rating-row">
                  <span className="rating-number">{car.review_2_rating}</span>
                  <div className="stars" aria-label={`Rated ${car.review_2_rating} out of 5 stars`}>
                    {[...Array(5)].map((_, index) => (
                      <span 
                        key={index} 
                        className={`star ${index < car.review_2_rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              
                <h3 className="review-title">{car.review_2_heading}</h3>
                <p className="review-text">{car.review_2_text}</p>
              </div>
              {/* <p>No reviews at the moment!</p> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CarDetail;