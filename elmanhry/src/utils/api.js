const API_URL = import.meta.env.VITE_API_URL;

//? Sends the application (JSON + images) as multipart FormData
export async function submitApplication(payload, files) {
  const body = new FormData();

  //? The JSON travels as a string inside one text field
  body.append("data", JSON.stringify(payload));

  //? Files: only append the ones that exist
  if (files.applicantImage) body.append("applicantImage", files.applicantImage);
  if (files.spouseImage) body.append("spouseImage", files.spouseImage);
  files.childImages.forEach((file) => body.append("childImages", file));

  //? Do NOT set Content-Type: the browser adds it with the right boundary
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.issues = data.errors; //? zod issues when the status is 400
    throw error;
  }

  return data; //? { applicationId, applicationNumber }
}

//? TEMPORARY: records a fake payment on the server
export async function payTest(applicationId) {
  const res = await fetch(`${API_URL}/payments/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Payment failed");
    error.status = res.status;
    throw error;
  }

  return data; //? { paid: true }
}