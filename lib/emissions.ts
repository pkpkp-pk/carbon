// Simplified Emission Factors for the Baseline Assessment

interface OnboardingData {
  country: string
  regionType: string
  transportModes: string
  weeklyKm: number
  flightsYear: number
  dietType: string
  foodSourcing: string
  homeType: string
  homeSize: string
  energySource: string
  heatingSystem: string
  householdSize: number
  monthlySpend: number
  consumptionModifiers: string
}

export function calculateBaseline(data: OnboardingData): number {
  let totalKgCo2 = 0

  // 1. Location & Home (Grid Factor + Heating)
  // Dummy logic for grid factor
  const gridFactor = data.country === 'US' ? 0.4 : 0.25 // kg CO2 per kWh
  const homeSizeSqft = data.homeSize === 'Large' ? 2000 : data.homeSize === 'Medium' ? 1000 : 500
  const annualKwh = homeSizeSqft * 10 
  let homeEmissions = annualKwh * gridFactor
  if (data.energySource === 'Renewable') homeEmissions *= 0.1
  totalKgCo2 += (homeEmissions / (data.householdSize || 1))

  // 2. Transport
  // Dummy logic: driving is ~0.2 kg per km
  const drivingFactor = data.transportModes.includes('Car') ? 0.2 : 0.05
  const annualKm = data.weeklyKm * 52
  totalKgCo2 += annualKm * drivingFactor
  
  // Flights (dummy logic: 500kg per flight)
  totalKgCo2 += data.flightsYear * 500

  // 3. Diet
  const dietFactors: Record<string, number> = {
    'Meat-eater': 3000,
    'Pescatarian': 2000,
    'Vegetarian': 1500,
    'Vegan': 1000
  }
  let dietEmissions = dietFactors[data.dietType] || 2500
  if (data.foodSourcing.includes('Local')) dietEmissions *= 0.9
  totalKgCo2 += dietEmissions

  // 4. Shopping
  // Dummy logic: $1 spend = 0.5kg CO2
  let shoppingEmissions = data.monthlySpend * 12 * 0.5
  if (data.consumptionModifiers.includes('Secondhand')) shoppingEmissions *= 0.7
  totalKgCo2 += shoppingEmissions

  return totalKgCo2
}
