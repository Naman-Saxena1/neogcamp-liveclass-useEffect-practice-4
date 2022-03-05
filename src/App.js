import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    (async function () {
      const { data } = await axios.get("/api/addresses");
      setAddresses(data.addresses);
    })();
  }, []);

  const saveAddressHandler = async () => {
    try {
      setShowLoader(true);
      const res = await axios.post("/api/addresses", {
        address: {
          city: newAddress,
          id: uuidv4()
        }
      });
      setNewAddress("");
      setShowLoader(false);
      console.log("Post request: ", res);
      if (res.status === 201) {
        setAddresses((currentAddresses) =>
          currentAddresses.concat({
            city: res.data.address.city,
            id: res.data.address.id
          })
        );
      }
    } catch (e) {
      setShowLoader(false);
      setShowError(true);
      setTimeout(() => setShowError(false), 6000);
    }
  };

  return (
    <div className="App">
      <h1> address book </h1>
      <input
        type="text"
        value={newAddress}
        placeholder="enter city"
        onChange={(event) => {
          const { value } = event.target;
          setNewAddress(value);
        }}
      />
      <button onClick={saveAddressHandler}> Save Address </button>
      {showLoader && <p>Saving to server...</p>}
      {showError && <p>Couldn't save the data</p>}
      <ul>
        {addresses.map((address) => (
          <li key={address.id}>{address.city}</li>
        ))}
      </ul>
    </div>
  );
}
