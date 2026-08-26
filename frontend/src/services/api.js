// Simulating a backend database response
export const fetchDashboardData = async (petId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pet: {
          id: petId,
          name: "Buddy",
          breed: "Golden Retriever",
          age: "3 Yrs 2 Mos",
          weight: "28.6 kg",
          blood: "DEA 1.1",
          image: "/images/dash-dog-1.jpg"
        },
        health: {
          activity: 78,
          sleep: 82,
          calories: 90,
          hydration: 62
        }
      });
    }, 800); // Simulate network latency
  });
};
