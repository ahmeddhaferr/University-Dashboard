import React from 'react'
import Car from './components/Car'
import { useState , useEffect} from 'react'

const App = () => {
const [cars, setCars] = useState([])

useEffect(() => {
 fetch('api/v1/cars')
 .then(res => res.json())
 .then(data => setCars(data))
 .catch(err => console.log(err)) 

}, [])
 console.log(cars)

  return (
    <div>
      
      <h1>Wellcome to the Car Store</h1>

      {cars.map((car) => (
        <Car key={car.id} {...car} />
      ))}
    </div>
  )
}

export default App