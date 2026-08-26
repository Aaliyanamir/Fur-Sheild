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
        },
        chartData: [
          { month: 'May', weight: 29.5, calories: 950 },
          { month: 'Jun', weight: 29.2, calories: 920 },
          { month: 'Jul', weight: 29.0, calories: 900 },
          { month: 'Aug', weight: 28.8, calories: 880 },
          { month: 'Sep', weight: 28.7, calories: 860 },
          { month: 'Oct', weight: 28.6, calories: 850 }
        ],
        aiInsight: "Buddy's weight has stabilized at 28.6 kg, aligning perfectly with his reduced 850 kcal intake over the last 3 months. Considering his age and breed, this steady trajectory significantly reduces joint stress. Maintain current diet plan."
      });
    }, 800); // Simulate network latency
  });
};
