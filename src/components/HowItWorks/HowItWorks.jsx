import {
  MdOutlineAccountCircle,
  MdOutlineDescription,
  MdOutlineFactCheck,
  MdOutlineCreditCard,
  MdSend,
} from "react-icons/md";
import "./HowItWorks.css";

const steps = [
  {
    number: 1,
    icon: MdOutlineAccountCircle,
    title: "اختر حالتك",
    description: "حدد نوع الطلب المناسب لظروفك وحالتك الأجتماعية.",
  },
  {
    number: 2,
    icon: MdOutlineDescription,
    title: "املأ البيانات",
    description: "قم بتعبئة النموذج الإلكتروني الواضح خطوة بخطوة.",
  },
  {
    number: 3,
    icon: MdOutlineFactCheck,
    title: "راجع معلوماتك",
    description: "تأكد من دقة المعلومات المدخلة قبل المتابعة.",
  },
  {
    number: 4,
    icon: MdOutlineCreditCard,
    title: "ادفع رسوم الخدمة",
    description: "إتمام الدفع بأمان عبر بواباتنا المعتمدة.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-container">
        {/* Srction Header */}
        <div className="how-it-works-header">
          <h2>كيف تعمل خدمتنا؟</h2>

          <p>خطوات واضحة ومبسطة لضمان تقديم طلبك بنجاح وبدون تعقيدات.</p>
        </div>

        {/* Steps */}
        <div className="steps-grid">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div className="step-card" key={step.number}>
                <div className="step-number">
                  <span>{step.number}</span>
                </div>

                <div className="step-content">
                  <Icon className="step-icon" />

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </div>
              </div>
            );
          })}
          {/* Step 5 */}
          <div className="step-card step-five">
            <div className="step-number">
              <span>5</span>
            </div>

            <div className="step-five-content">
              <div className="step-five-icon">
                <MdSend />
              </div>

              <div>
                <h3>تم ارسال الطلب</h3>

                <p>
                  بمجرد الانتهاء، سيتم توجيه طلبك لفريقنا للمراجعة النهائية
                  وتقديم المشورة اللازمة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
