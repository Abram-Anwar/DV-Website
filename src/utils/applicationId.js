const getNextApplicationId = () => {
  const lastId = Number(localStorage.getItem("lastApplicationId") || 0);

  const nextId = lastId + 1;

  localStorage.setItem("lastAppllicationId", nextId);

  return String(nextId).padStart(5, "0");
};

export default getNextApplicationId;
