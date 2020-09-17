import React, { useState, useEffect } from "react";
import "./App.css";
import "./responsive.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import InfoBox from "./Components/InfoBox";
import Table from "./Components/Table";
import { sortData, prettyPrintStat } from "./Components/util";
import LineGraph from "./Components/LineGraph";
import Map from "./Components/Map";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app__root">
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl>
              <Select
                className="app_dropdown"
                variant="outlined"
                value={country}
                onChange={onCountryChange}
              >
                <MenuItem value="worldwide">worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox
              isRed
              title="Confirmed"
              active={casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0,0")}
              onClick={(e) => setCasesType("cases")}
            />
            <InfoBox
              isGreen
              title="Recovered"
              active={casesType === "recovered"}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0,0")}
              onClick={(e) => setCasesType("recovered")}
            />
            <InfoBox
              isGrey
              title="Deaths"
              active={casesType === "deaths"}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0,0")}
              onClick={(e) => setCasesType("deaths")}
            />
          </div>
          <Map
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
          />
        </div>

        <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Coutry</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app_graph" casesType={casesType} />
          </CardContent>
        </Card>
      </div>
      <div className="app__ownerInfo">
        <Card>
          <CardContent>
            <Typography>
              Made with{" "}
              <span role="img" aria-label="heart">
                ❤️
              </span>{" "}
              by Tejas Devani
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
