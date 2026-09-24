const getNextApplicationId = () => {
  const currentYear = new Date().getFullYear();

  const lastId = Number(localStorage.getItem("lastApplicationId") || 0);

  const nextId = lastId + 1;

  localStorage.setItem("lastAppllicationId", nextId);

  return `DV-${currentYear}-${String(nextId).padStart(5, "0")}`;
};

export default getNextApplicationId;
