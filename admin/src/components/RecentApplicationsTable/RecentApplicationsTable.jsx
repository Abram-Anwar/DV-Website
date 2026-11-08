import { Link } from "react-router-dom";
import "./recentApplicationsTable.css";

const formatData = (value) => {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const RecentApplicationsTable = ({ rows }) => {
  //? Nothing to show: print a message instead of an empty table
  if (rows.length === 0) {
    return <p className="table-empty">لا توجد طلبات جاهزة للتقديم حالياً.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>اسم المتقدم</th>
            <th>الحالة الاجتماعية</th>
            <th className="cell-center">عدد الأطفال</th>
            <th>حالة الدفع</th>
            <th>حالة التقديم</th>
            <th>تاريخ الإنشاء</th>
            <th>الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td dir="rtl" className="cell-id">
                {row.applicationNumber}
              </td>
              <td>{row.applicantName}</td>
              <td>{row.maritalStatus}</td>
              <td className="cell-center">{row.childrenCount}</td>
              <td>
                <span className="badge badge-paid">مدفوع</span>
              </td>
              <td>
                <span className="badge badge-ready">جاهز للتقديم</span>
              </td>
              <td>{formatData(row.createdAt)}</td>
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
  );
};

export default RecentApplicationsTable;
