import "./FAQ.css";

const faqs = [
  {
    question: "هل موقع المناهري جهة حكومية؟",
    answer:
      "لا، نحن مكتب استشاري خاص مستقل يهدف لتسهيل ومراجعة معاملات التقديم ونفي كافة الأخطاء الناتجة عن التعبئة العشوائية.",
  },
  {
    question: "كم يستغرق الوقت لمراجعة الطلب؟",
    answer:
      "يتم فحص وتجهيز البيانات خلال 24 إلى 48 ساعة كحد أقصى من إتمام عملية الدفع.",
  },
  {
    question: "ماذا يحدث اذا وجد اي بيانات خاطئه؟",
    answer: "سيتم التواصل على الهاتف للتأكيد على صحة البيانات",
  },
];

const FAQ = () => {
  return (
    <section className="faq" id="faq">
      <div className="faq-container">
        {/* Section Header */}
        <div className="faq-header">
          <h2>الأسئلة الشائعة</h2>
          <p>إجابات على أكثر الاستفسارات تكراراً من عملائنا.</p>
        </div>

        {/* FAQ Items */}
        <div className="faq-list">
          {faqs.map((faq) => {
            return (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;