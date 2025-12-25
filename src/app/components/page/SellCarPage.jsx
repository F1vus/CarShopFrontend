import "styles/profilePage/_car-sell-page.scss";
import React, { useState, useEffect } from "react";
import carService from "services/car.service.js";

function SellCarPage() {
    const [dane, setDane] = useState({
        name: "",
        price: "",
        description: "",
        color: "",
        mileage: "",
        carState: "",
        petrolType: "",
        engineCapacity: "",
        power: "",
        year: "",
        photos: "",
        producent: ""
    });

    const [metadata, setMetadata] = useState({
        color: [],
        carState: [],
        petrolType: [],
        producent: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDane(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!dane.name) newErrors.name = "Car name is required";
        if (!dane.producent) newErrors.producent = "Producent is required";
        if (!dane.description) newErrors.description = "Description is required";
        if (!dane.price || Number(dane.price) <= 0) newErrors.price = "Price must be > 0";
        if (!dane.year || Number(dane.year) <= 0) newErrors.year = "Year is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url) => /^https?:\/\/.+/.test(url);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const photoUrls = dane.photos
            ? dane.photos.split(",").map(url => url.trim())
            : [];

        for (const url of photoUrls) {
            if (!isValidUrl(url)) {
                alert("Niepoprawny URL zdjęcia");
                return;
            }
        }

        const payload = {
            name: dane.name,
            price: Number(dane.price),
            description: dane.description,
            mileage: Number(dane.mileage),
            engineCapacity: Number(dane.engineCapacity),
            power: Number(dane.power),
            year: Number(dane.year),
            carState: dane.carState,

            color: dane.color ? { id: Number(dane.color) } : null,
            petrolType: dane.petrolType ? { id: Number(dane.petrolType) } : null,
            producent: dane.producent ? { id: Number(dane.producent) } : null,

            photos: photoUrls.map(url => ({ url }))
        };

        try {
            setIsSubmitting(true);
            await carService.createCar(payload);
            alert("Samochód został wystawiony!");
            setDane({
                name: "",
                price: "",
                description: "",
                color: "",
                mileage: "",
                carState: "",
                petrolType: "",
                engineCapacity: "",
                power: "",
                year: "",
                photos: "",
                producent: ""
            });
        } catch (error) {
            console.error(error);
            alert("Błąd podczas tworzenia ogłoszenia");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const data = await carService.getMetadata();
                setMetadata(data);
            } catch (error) {
                console.error("Failed to load metadata:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMetadata();
    }, []);

    if (isLoading) {
        return (
            <div className="car-sell">
                <h1>Ładowanie danych formularza...</h1>
            </div>
        );
    }


    return (
        <div className="car-sell">
            <header className="car-sell__header_inside">Sprzedaj swój samochód</header>
            <h1 className="car-sell__title">Wypełnij poniższy formularz, aby wystawić swój samochód na sprzedaż.</h1>

            <form  className="car-sell__form"  onSubmit={handleSubmit}>
                <h2 className="car-sell__powdstawoweInformacje">Podstawowe informacje</h2>

                <div className="car-sell__podstawowe-informacje">

                    <div className="form-item">
                        <label htmlFor="carName">Nazwa samochodu</label>
                        <input type="text" id="carName" className="car-sell__nazwa-samochodu" name="name" value={dane.name} onChange={handleChange} />
                    </div>

                    <div className="form-item">
                        <label htmlFor="price">Cena</label>
                        <input type="number" id="price" className="car-sell__cena" name="price" value={dane.price} onChange={handleChange} />
                    </div>

                    <div className="form-item">
                        <label htmlFor="manufacturer">Producent</label>
                        <select id="manufacturer" className="car-sell__producent" name="producent" value={dane.producent} onChange={handleChange}>
                            <option value="" disabled>Wybierz producenta</option>
                            {metadata.producent.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-item">
                        <label htmlFor="year">Rok</label>
                        <input type="number" id="year" className="car-sell__rok" name="year" value={dane.year} onChange={handleChange} />
                    </div>
                </div>



                <h2 className="car-sell__specyfikacjeTechniczne">Specyfikacje techniczne</h2>
                <div className="car-sell__specyfikacje-techniczne">

                    <div className="form-item">
                        <label htmlFor="mileage">Przebieg (km)</label>
                        <input type="number" id="mileage" className="car-sell__przebieg" name="mileage" value={dane.mileage} onChange={handleChange} />
                    </div>

                    <div className="form-item">
                        <label htmlFor="engineCapacity">Pojemność silnika (l)</label>
                        <input type="number" id="engineCapacity" className="car-sell__pojemnosc-silnika" name="engineCapacity" value={dane.engineCapacity} onChange={handleChange} />
                    </div>

                    <div className="form-item">
                        <label htmlFor="power">Moc</label>
                        <input type="number" id="power" className="car-sell__moc" name="power" value={dane.power} onChange={handleChange} />
                    </div>


                    <div className="form-item">
                        <label htmlFor="fuelType">Rodzaj paliwa</label>
                        <select id="fuelType" className="car-sell__rodzaj-paliwa" name="petrolType" value={dane.petrolType} onChange={handleChange}>
                            <option value="" disabled>Wybierz paliwo</option>
                            {metadata.petrolType.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <h2 className="car-sell__wyglad-stan-naglowek">Wygląd i stan</h2>

                <div className="car-sell__wyglad-stan">


                    <div className="form-item">
                        <label htmlFor="color">Kolor</label>
                        <select id="color" className="car-sell__kolor" name="color" value={dane.color} onChange={handleChange}>
                            <option value="" disabled>Wybierz kolor</option>
                            {metadata.color.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>


                    <div className="form-item">
                        <label htmlFor="condition">Warunek</label>
                        <select id="condition" className="car-sell__stan" name="carState" value={dane.carState} onChange={handleChange}>
                            <option value="" disabled>Wybierz warunek</option>
                            {metadata.carState.map((item, index) => (
                                <option key={item.id || index} value={item.id || item}>{item.name || item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="car-sell__opis-zdjecia">
                    <h2>Opis i zdjęcia</h2>

                    <label htmlFor="description">Opis</label>
                    <textarea id="description" className="car-sell__opis" name="description" value={dane.description} onChange={handleChange} />

                    <label htmlFor="photoUrl">Adresy URL zdjęć</label>
                    <button className="car-sell__dodaj-zdjecie" type="button">+ Dodaj kolejne zdjęcie</button>
                    <input type="text" id="photoUrl" className="car-sell__url" name="photos" value={dane.photos} onChange={handleChange} />

                </div>

                <div className="car-sell__buttons">
                    <button className="car-sell__wyczysc" type="reset">Wyczyść</button>

                    <button className="car-sell__wystaw-auto" type="submit" disabled={isSubmitting} >Wystaw moje auto</button>
                </div>


            </form>
        </div>
    );
}

export default SellCarPage;
