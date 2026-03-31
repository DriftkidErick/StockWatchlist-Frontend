import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [message, setMessage] = useState("");

  const [ticker, setTicker] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [savedPrice, setSavedPrice] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");

  const authHeaders = {
    Authorization: `Basic ${token}`,
  };

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/watchlist", {
        headers: authHeaders,
      });

      setWatchlist(response.data);
      setMessage("");
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      setMessage("Failed to load watchlist.");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/watchlist",
        {
          ticker,
          companyName,
          savedPrice: Number(savedPrice),
          dateAdded: new Date().toISOString().split("T")[0],
        },
        {
          headers: authHeaders,
        }
      );

      setTicker("");
      setCompanyName("");
      setSavedPrice("");
      setSearchQuery("");
      setSearchResults([]);
      setMessage("");

      fetchWatchlist();
    } catch (error) {
      console.error("Failed to add stock:", error);

      const backendMessage =
        error.response?.data?.message || "Failed to add stock.";

      setMessage(backendMessage);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:8080/api/stocks/search?query=${searchQuery}`,
        {
          headers: authHeaders,
        }
      );

      setSearchResults(response.data);
      setMessage("");
    } catch (error) {
      console.error("Failed to search stocks:", error);
      setMessage("Failed to search stocks.");
    }
  };

  const handleSelectStock = async (stock) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/stocks/price?ticker=${stock.symbol}`,
        {
          headers: authHeaders,
        }
      );

      setTicker(stock.symbol);
      setCompanyName(stock.instrumentName);
      setSavedPrice(String(response.data));
      setSearchResults([]);
      setSearchQuery(stock.instrumentName);
      setMessage("");
    } catch (error) {
      console.error("Failed to fetch price:", error);
      setMessage("Failed to fetch stock price.");
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/watchlist/${id}`, {
        headers: authHeaders,
      });

      setMessage("");
      fetchWatchlist();
    } catch (error) {
      console.error("Failed to delete stock:", error);

      const backendMessage =
        error.response?.data?.message || "Failed to delete stock.";

      setMessage(backendMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">StockWatchlist</span>
          <div>
            <span className="text-white me-3">{username}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: "1000px" }}>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title mb-3">Search Stock</h3>

            <form onSubmit={handleSearch}>
              <div className="row g-3">
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by company or ticker"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <button type="submit" className="btn btn-secondary w-100">
                    Search
                  </button>
                </div>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div className="list-group mt-3">
                {searchResults.slice(0, 5).map((stock, index) => (
                  <button
                    key={index}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelectStock(stock)}
                  >
                    <strong>{stock.symbol}</strong> - {stock.instrumentName} ({stock.exchange})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title mb-3">Add Stock</h3>

            <form onSubmit={handleAddStock}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Ticker</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="AAPL"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Apple Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Saved Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="200.00"
                    value={savedPrice}
                    onChange={(e) => setSavedPrice(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Add Stock
              </button>
            </form>

            {message && (
              <div className="alert alert-danger mt-3 mb-0">
                {message}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3">Your Watchlist</h3>

          {watchlist.length === 0 ? (
            <div className="alert alert-info">
              No stocks yet. Add your first one above 🚀
            </div>
          ) : (
            <div className="row g-3">
              {watchlist.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        {item.ticker} - {item.companyName}
                      </h5>

                      <p className="mb-1">
                        <strong>Saved Price:</strong> ${item.savedPrice?.toFixed(2)}
                      </p>

                      <p className="mb-1">
                        <strong>Current Price:</strong> ${item.currentPrice?.toFixed(2)}
                      </p>

                      <p
                        className={`mb-1 ${
                          item.priceChange >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        <strong>Price Change:</strong> ${item.priceChange?.toFixed(2)}
                      </p>

                      <p
                        className={`mb-1 ${
                          item.percentChange >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        <strong>Percent Change:</strong> {item.percentChange?.toFixed(2)}%
                      </p>

                      <p className="mb-0">
                        <strong>Date Added:</strong> {item.dateAdded}
                      </p>

                      <button
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={() => handleDeleteStock(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;