import {
  FiCheckCircle,
  FiFileText,
  FiClock,
  FiCreditCard,
} from "react-icons/fi";
import { MdOutlinePayments } from "react-icons/md";
import { useEffect, useState } from "react";

import StatCard from "../../components/StatCard/StatCard";
import "./overview.css";
import RecentApplicationsTable from "../../components/RecentApplicationsTable/RecentApplicationsTable";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Overview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/overview`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch overview");
        }

        const data = await response.json();

        setOverview(data);
        setError("");
      } catch (err) {
        setError("حدث خطأ أثناء تحميل البيانات");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();

    const interval = setInterval(fetchOverview, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (number) => Number(number || 0).toLocaleString("en-US");

  if (loading) {
    return <p>جاري تحميل البيانات...</p>;
  }

  if (error && !overview) {
    return <p>{error}</p>;
  }

  return (
    <div className="overview">
      {error && <p>{error}</p>}

      <div className="stats-grid">
        {/* All applications → gray (default) */}
        <StatCard
          title="إجمالي الطلبات"
          value={formatNumber(overview.totalApplications)}
          unit="طلب"
          des="كل الطلبات المسجلة في النظام"
          icon={<FiFileText />}
          variant="default"
        />

        {/* Submitted → green */}
        <StatCard
          title="الطلبات المقدمة"
          value={formatNumber(overview.submittedApplications)}
          unit="طلب"
          des="تم التقديم عليها بالفعل"
          icon={<FiCheckCircle />}
          variant="success"
        />

        {/* Paid but not submitted yet → amber (needs action) */}
        <StatCard
          title="بانتظار التقديم"
          value={formatNumber(overview.readyToSubmitApplications)}
          unit="طلب"
          des="مدفوعة ولم يتم التقديم عليها بعد"
          icon={<FiClock />}
          variant="warning"
        />

        {/* Not paid yet → red */}
        <StatCard
          title="غير مدفوعة"
          value={formatNumber(overview.unpaidApplications)}
          unit="طلب"
          des="لم يتم سداد رسومها بعد"
          icon={<FiCreditCard />}
          variant="error"
        />

        {/* Total payments → blue */}
        <StatCard
          title="إجمالي المدفوعات"
          value={formatNumber(overview.totalPayments)}
          unit="ج.م"
          des="إجمالي الإيرادات المحصلة"
          icon={<MdOutlinePayments />}
          variant="primary"
        />
      </div>

      <section className="table-section">
        <div className="table-section-header">
          <div>
            <h2 className="table-section-title">طلبات جاهزة للتقديم</h2>
            <p className="table-section-subtitle">
              طلبات تم دفع رسومها وبانتظار تقديمك لها.
            </p>
          </div>

          <Link to="/applications" className="table-section-link">
            عرض كل الطلبات
          </Link>
        </div>

        <RecentApplicationsTable rows={overview.recentApplications} />
      </section>
    </div>
  );
};

export default Overview;
