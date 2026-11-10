import { Link } from "react-router-dom";
import "../../styles/table.css";

const formatDate = (value) => {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const status = {
  submitted: {
    label: "تم التقديم",
    className: "badge-submitted",
  },
  not_submitted: {
    label: "لم يتم التقديم",
    className: "badge-not-submitted",
  },
};

const paymentStatus = {
  not_started: {
    label: "لم يبدأ الدفع بعد",
    className: "badge-not-started",
  },
  pending: {
    label: "قيد الانتظار",
    className: "badge-pending",
  },
  paid: {
    label: "مدفوع",
    className: "badge-paid",
  },
  failed: {
    label: "فشل الدفع",
    className: "badge-failed",
  },
  cancelled: {
    label: "تم الإلغاء",
    className: "badge-cancelled",
  },
};

const ApplicationsTable = ({ data, onPageChange }) => {
  const { rows, total, page, pageSize } = data;

  //? At least 1 page, so an empty table shows "1 / 1" instead of "1 / 0"
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  function handleNextBtn() {
    onPageChange(page + 1);
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleBackBtn() {
    onPageChange(page - 1);
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>اسم المتقدم</th>
              <th>الحالة الاجتماعية</th>
              <th>عدد الأطفال</th>
              <th>حالة الدفع</th>
              <th>حالة التقديم</th>
              <th>تاريخ الإنشاء</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="cell-id">
                  {row.applicationNumber}
                </td>
                <td>{row.applicantName}</td>
                <td>{row.maritalStatus}</td>
                <td className="cell-center">{row.childrenCount}</td>
                <td>
                  <span
                    className={`badge ${paymentStatus[row.paymentStatus]?.className || ""}`}
                  >
                    {paymentStatus[row.paymentStatus]?.label || "غير معروف"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${status[row.applicationStatus]?.className || ""}`}
                  >
                    {status[row.applicationStatus]?.label || "غير معروف"}
                  </span>
                </td>
                <td>{formatDate(row.createdAt)}</td>
                <td>
                  <Link to={`/applications/${row.id}`} className="table-action">
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <p className="pagination-info">
          عرض {startItem} - {endItem} من {total} طلب
        </p>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={handleBackBtn}
          >
            السابق
          </button>

          <span className="pagination-current">
            {page} / {totalPages}
          </span>

          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={handleNextBtn}
          >
            التالي
          </button>
        </div>
      </div>
    </>
  );
};

export default ApplicationsTable;
