import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import {Deploy} from './Component/Deploy/Deploy';
import {DeployInfo} from './Component/Deploy/Deploy';
import axios from 'axios';
import CarListings from './Component/Deploy/CarListings';
import CarDetail from './Component/Deploy/CarDetail';
import Login from './Component/Deploy/Login';
import Register from './Component/Deploy/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FavoriteCars from './Component/Deploy/FavoriteCars';
import { Query } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       gcTime: 1000 * 60 * 60 * 24, // 24 hours
//       // refetchOnWindowFocus: false,
//       // refetchOnMount: false,
//     },
//   },
// });
const queryClient = new QueryClient();
console.log(1)

function App() {
  // console.log(2)
  // ***
  // useState is to create variables [state, setState]
  // state: just like a variable, can be any name
  // setState: use this to update the variable state, can be any name
  // for example, [info, setInfo]
  // {}: an empty object in js, which the state variable is set to
  // ***


  // const [state, setState] = useState({})


  // ***
  // useEffect can fetch data
  // axios is for asynchronous api call, using async and await
  // ***


  // useEffect(() => {
  //   axios.get("/api").then(response => {
  //     if(response.status === 200){
  //       setState(response.data);
  //     }
  //   })
  //   .catch(error => console.log(error));
  // },[])

  // return (
  //   <div className="App">
  //     <CarListings />
  //   </div>
  // );

  const [carData, setCarData] = useState({});
  
  const fetchCarData = async () => {
    try {
      const response = await axios.get("http://3.15.198.73:8080/api/cars_data");
      if (response.status === 200) {
        setCarData(response.data);
      } else {
        console.error("Failed to fetch car data");
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
    }
  };

  useEffect(() => {
    fetchCarData();
  }, []);

  // return (
  //   <div className="App">
  //     <Deploy prop={state}/>
  //   </div>
  // );

  // return (
  //   <div className="App">
  //     <CarListings cars={carData}/>
  //   </div>
  // );

  // const [msg, setMsg] = useState({})

  // useEffect(() => {
  //   axios.get("/abc").then(response => {
  //     if(response.status === 200){
  //       setMsg(response.data);
  //     }
  //   })
  //   .catch(error => console.log(error));
  // },[])

  // const queryClient = new QueryClient();

  // const persister = createSyncStoragePersister({
  //   storage: window.localStorage,
  // })

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
      {/* <PersistQueryClientProvider persistOptions={{persister}} client={queryClient}> */}
        <Router>
          <Routes>
            <Route path="/" element={<CarListings cars={carData}/>} />
            <Route path="/car/:vin" element={<CarDetail cars={carData}/>} />
            <Route path="/loggn" element={<Login/>} />
            <Route path="/loggn/register" element={<Register/>} />
            <Route path="/favorites" element={<FavoriteCars cars={carData}/>} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      {/* </PersistQueryClientProvider> */}
      </QueryClientProvider>
    </div>
  );
}

export default App;