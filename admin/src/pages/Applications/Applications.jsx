import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import ApplicationsTable from "../../components/ApplicationsTable/ApplicationsTable";
import "./applications.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Applications = () => {
  const [applications, setApplications] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //? What the user types (changes on every key)
  const [searchInput, setSearchInput] = useState("");
  //? What we actually send to the API (updates after the user stops typing)
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/admin/applications?page=${page}&search=${encodeURIComponent(search)}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Faild to fetch applications");
        }

        const data = await response.json();

        setApplications(data);
        setError("");
      } catch (err) {
        setError("حدث خطأ أثناء تحميل البيانات");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    const interval = setInterval(fetchApplications, 60000);

    return () => clearInterval(interval);
  }, [page, search]);

  if (error && !applications) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <p>جاري تحميل البيانات...</p>;
  }
  return (
    <section className="table-section">
      <div className="search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="بحث برقم الطلب، اسم المتقدم..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="table-section-header">
        <div>
          <h2 className="table-section-title">ادارة الطلبات</h2>
        </div>
      </div>
      <ApplicationsTable data={applications} onPageChange={setPage} />
    </section>
  );
};

export default Applications;
