import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import ListingForm from "../components/ListingForm";
import config from "../../backend.config.json";

const EditListing = ({ showMsg }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // listing form
  const [title, setTitle] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [amenities, setAmenities] = useState("");

  // fetch exist data
  const loadDetail = async () => {
    try {
      const res = await fetch(
        `http://localhost:${config.BACKEND_PORT}/listings/${id}`
      );
      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || "Failed to load listing", "error");
        return;
      }

      const lst = data.listing;

      // set initial values
      setTitle(lst.title);
      setPrice(lst.price);
      setType(lst.metadata?.type || "");
      setBathrooms(lst.metadata?.bathrooms || "");
      setBedrooms(lst.metadata?.bedrooms || "");
      setAmenities(lst.metadata?.amenities || "");

      // address
      setStreet(lst.address?.street || "");
      setCity(lst.address?.city || "");
      setState(lst.address?.state || "");
      setPostcode(lst.address?.postcode || "");
    } catch {
      showMsg("Network error", "error");
    }
  };

  useEffect(() => {
    loadDetail();
  }, []);

  //save newform
  const handleSave = async () => {
    const newform = {
      title,
      address: {
        street,
        city,
        state,
        postcode: Number(postcode),
      },
      price: Number(price),
      metadata: {
        type,
        bathrooms: Number(bathrooms),
        bedrooms: Number(bedrooms),
        amenities
      },
    };

    try {
      const res = await fetch(
        `http://localhost:${config.BACKEND_PORT}/listings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newform),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || "Update failed", "error");
        return;
      }

      showMsg("Listing updated!", "success");
      setTimeout(() => navigate("/host"), 1000);
    } catch {
      showMsg("Network error", "error");
    }
  };

  // login guard
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <ListingForm
      formtitle="edit"
      title={title} setTitle={setTitle}
      street={street} setStreet={setStreet}
      city={city} setCity={setCity}
      stateVal={state} setStateVal={setState}
      postcode={postcode} setPostcode={setPostcode}
      price={price} setPrice={setPrice}
      type={type} setType={setType}
      bathrooms={bathrooms} setBathrooms={setBathrooms}
      bedrooms={bedrooms} setBedrooms={setBedrooms}
      amenities={amenities} setAmenities={setAmenities}

      onSubmit={handleSave}
      submitLabel="save"
    />
  );
};

export default EditListing;
