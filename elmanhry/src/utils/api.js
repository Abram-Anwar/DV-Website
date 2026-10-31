const API_URL = import.meta.env.VITE_API_URL;

//? Sends the application to the server and returns its JSON response
export async function submitApplication(payload) {
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Request failded");
    error.issues = data.errors;   //? zod issues when the status is 400
    throw error;
  }
  
  return data; //? { applicationId, applicationNumber }
}
