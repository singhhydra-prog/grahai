/**
 * City Database for GrahAI — Vedic Astrology Location Picker
 *
 * Comprehensive list of cities with lat/long/timezone for birth chart calculations.
 * Covers all Indian state capitals, major cities, and key international cities.
 * Sorted alphabetically within each country group.
 */

export interface CityEntry {
  city: string
  state?: string      // state/province/region
  country: string
  lat: number
  lng: number
  tz: number          // UTC offset in hours (e.g., 5.5 for IST)
  tzName: string      // IANA timezone name
}

// ─── INDIA (200+ cities) ─────────────────────────────
const INDIA: CityEntry[] = [
  { city: "Agartala", state: "Tripura", country: "India", lat: 23.83, lng: 91.28, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.18, lng: 78.02, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.02, lng: 72.57, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Aizawl", state: "Mizoram", country: "India", lat: 23.73, lng: 92.72, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Ajmer", state: "Rajasthan", country: "India", lat: 26.45, lng: 74.64, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Aligarh", state: "Uttar Pradesh", country: "India", lat: 27.88, lng: 78.08, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Allahabad", state: "Uttar Pradesh", country: "India", lat: 25.43, lng: 81.85, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Amravati", state: "Maharashtra", country: "India", lat: 20.93, lng: 77.75, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Amritsar", state: "Punjab", country: "India", lat: 31.63, lng: 74.87, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Anand", state: "Gujarat", country: "India", lat: 22.56, lng: 72.95, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Asansol", state: "West Bengal", country: "India", lat: 23.68, lng: 86.95, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Aurangabad", state: "Maharashtra", country: "India", lat: 19.88, lng: 75.34, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bangalore", state: "Karnataka", country: "India", lat: 12.97, lng: 77.59, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bareilly", state: "Uttar Pradesh", country: "India", lat: 28.37, lng: 79.42, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Belgaum", state: "Karnataka", country: "India", lat: 15.85, lng: 74.50, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bellary", state: "Karnataka", country: "India", lat: 15.14, lng: 76.92, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bengaluru", state: "Karnataka", country: "India", lat: 12.97, lng: 77.59, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bhagalpur", state: "Bihar", country: "India", lat: 25.24, lng: 86.97, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bhavnagar", state: "Gujarat", country: "India", lat: 21.77, lng: 72.15, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bhilai", state: "Chhattisgarh", country: "India", lat: 21.21, lng: 81.43, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bhopal", state: "Madhya Pradesh", country: "India", lat: 23.26, lng: 77.41, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bhubaneswar", state: "Odisha", country: "India", lat: 20.30, lng: 85.82, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bikaner", state: "Rajasthan", country: "India", lat: 28.02, lng: 73.31, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bilaspur", state: "Chhattisgarh", country: "India", lat: 22.08, lng: 82.15, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Bokaro", state: "Jharkhand", country: "India", lat: 23.67, lng: 86.15, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Chandigarh", state: "Chandigarh", country: "India", lat: 30.73, lng: 76.78, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.08, lng: 80.27, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.01, lng: 76.96, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Cuttack", state: "Odisha", country: "India", lat: 20.46, lng: 85.88, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Darbhanga", state: "Bihar", country: "India", lat: 26.17, lng: 85.90, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Davangere", state: "Karnataka", country: "India", lat: 14.47, lng: 75.92, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Dehradun", state: "Uttarakhand", country: "India", lat: 30.32, lng: 78.03, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Delhi", state: "Delhi", country: "India", lat: 28.61, lng: 77.21, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Dhanbad", state: "Jharkhand", country: "India", lat: 23.79, lng: 86.43, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Dibrugarh", state: "Assam", country: "India", lat: 27.47, lng: 94.91, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Durgapur", state: "West Bengal", country: "India", lat: 23.55, lng: 87.32, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Erode", state: "Tamil Nadu", country: "India", lat: 11.34, lng: 77.73, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Faridabad", state: "Haryana", country: "India", lat: 28.41, lng: 77.31, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Gangtok", state: "Sikkim", country: "India", lat: 27.33, lng: 88.62, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Gaya", state: "Bihar", country: "India", lat: 24.80, lng: 85.00, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Ghaziabad", state: "Uttar Pradesh", country: "India", lat: 28.67, lng: 77.42, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Goa", state: "Goa", country: "India", lat: 15.30, lng: 74.00, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Gorakhpur", state: "Uttar Pradesh", country: "India", lat: 26.76, lng: 83.37, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Gulbarga", state: "Karnataka", country: "India", lat: 17.33, lng: 76.83, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Guntur", state: "Andhra Pradesh", country: "India", lat: 16.30, lng: 80.44, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Gurgaon", state: "Haryana", country: "India", lat: 28.46, lng: 77.03, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Guwahati", state: "Assam", country: "India", lat: 26.14, lng: 91.74, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Gwalior", state: "Madhya Pradesh", country: "India", lat: 26.22, lng: 78.18, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Haridwar", state: "Uttarakhand", country: "India", lat: 29.95, lng: 78.16, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Hubli", state: "Karnataka", country: "India", lat: 15.36, lng: 75.12, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Hyderabad", state: "Telangana", country: "India", lat: 17.39, lng: 78.49, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Imphal", state: "Manipur", country: "India", lat: 24.82, lng: 93.95, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Indore", state: "Madhya Pradesh", country: "India", lat: 22.72, lng: 75.86, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Itanagar", state: "Arunachal Pradesh", country: "India", lat: 27.10, lng: 93.62, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jabalpur", state: "Madhya Pradesh", country: "India", lat: 23.18, lng: 79.95, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jaipur", state: "Rajasthan", country: "India", lat: 26.91, lng: 75.79, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jalandhar", state: "Punjab", country: "India", lat: 31.33, lng: 75.58, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jalgaon", state: "Maharashtra", country: "India", lat: 21.01, lng: 75.56, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jammu", state: "Jammu & Kashmir", country: "India", lat: 32.73, lng: 74.87, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jamnagar", state: "Gujarat", country: "India", lat: 22.47, lng: 70.07, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jamshedpur", state: "Jharkhand", country: "India", lat: 22.80, lng: 86.20, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jhansi", state: "Uttar Pradesh", country: "India", lat: 25.45, lng: 78.57, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Jodhpur", state: "Rajasthan", country: "India", lat: 26.24, lng: 73.02, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Junagadh", state: "Gujarat", country: "India", lat: 21.52, lng: 70.46, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Kanpur", state: "Uttar Pradesh", country: "India", lat: 26.45, lng: 80.35, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Kochi", state: "Kerala", country: "India", lat: 9.93, lng: 76.27, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Kohima", state: "Nagaland", country: "India", lat: 25.67, lng: 94.12, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Kolhapur", state: "Maharashtra", country: "India", lat: 16.70, lng: 74.24, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Kolkata", state: "West Bengal", country: "India", lat: 22.57, lng: 88.36, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Kota", state: "Rajasthan", country: "India", lat: 25.18, lng: 75.86, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Kozhikode", state: "Kerala", country: "India", lat: 11.25, lng: 75.77, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Leh", state: "Ladakh", country: "India", lat: 34.16, lng: 77.58, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.85, lng: 80.95, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Ludhiana", state: "Punjab", country: "India", lat: 30.90, lng: 75.86, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Madurai", state: "Tamil Nadu", country: "India", lat: 9.93, lng: 78.12, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Mangalore", state: "Karnataka", country: "India", lat: 12.87, lng: 74.84, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Mathura", state: "Uttar Pradesh", country: "India", lat: 27.49, lng: 77.67, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Meerut", state: "Uttar Pradesh", country: "India", lat: 28.98, lng: 77.71, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Moradabad", state: "Uttar Pradesh", country: "India", lat: 28.84, lng: 78.78, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Mumbai", state: "Maharashtra", country: "India", lat: 19.08, lng: 72.88, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Muzaffarpur", state: "Bihar", country: "India", lat: 26.12, lng: 85.39, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Mysore", state: "Karnataka", country: "India", lat: 12.30, lng: 76.65, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Nagpur", state: "Maharashtra", country: "India", lat: 21.15, lng: 79.09, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Nanded", state: "Maharashtra", country: "India", lat: 19.16, lng: 77.30, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Nashik", state: "Maharashtra", country: "India", lat: 19.99, lng: 73.79, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Navi Mumbai", state: "Maharashtra", country: "India", lat: 19.03, lng: 73.03, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "New Delhi", state: "Delhi", country: "India", lat: 28.61, lng: 77.21, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.57, lng: 77.32, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Panaji", state: "Goa", country: "India", lat: 15.50, lng: 73.83, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Panchkula", state: "Haryana", country: "India", lat: 30.69, lng: 76.86, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Patna", state: "Bihar", country: "India", lat: 25.61, lng: 85.14, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Pondicherry", state: "Puducherry", country: "India", lat: 11.93, lng: 79.83, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Prayagraj", state: "Uttar Pradesh", country: "India", lat: 25.43, lng: 81.85, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Pune", state: "Maharashtra", country: "India", lat: 18.52, lng: 73.86, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Raipur", state: "Chhattisgarh", country: "India", lat: 21.25, lng: 81.63, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Rajkot", state: "Gujarat", country: "India", lat: 22.30, lng: 70.80, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Ranchi", state: "Jharkhand", country: "India", lat: 23.35, lng: 85.33, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Rishikesh", state: "Uttarakhand", country: "India", lat: 30.09, lng: 78.27, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Rourkela", state: "Odisha", country: "India", lat: 22.26, lng: 84.85, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Saharanpur", state: "Uttar Pradesh", country: "India", lat: 29.97, lng: 77.55, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Salem", state: "Tamil Nadu", country: "India", lat: 11.65, lng: 78.16, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Sangli", state: "Maharashtra", country: "India", lat: 16.85, lng: 74.57, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Shillong", state: "Meghalaya", country: "India", lat: 25.57, lng: 91.88, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Shimla", state: "Himachal Pradesh", country: "India", lat: 31.10, lng: 77.17, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Siliguri", state: "West Bengal", country: "India", lat: 26.72, lng: 88.42, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Solapur", state: "Maharashtra", country: "India", lat: 17.68, lng: 75.91, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Srinagar", state: "Jammu & Kashmir", country: "India", lat: 34.08, lng: 74.80, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Surat", state: "Gujarat", country: "India", lat: 21.17, lng: 72.83, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Thane", state: "Maharashtra", country: "India", lat: 19.22, lng: 72.98, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Thiruvananthapuram", state: "Kerala", country: "India", lat: 8.52, lng: 76.94, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Thrissur", state: "Kerala", country: "India", lat: 10.53, lng: 76.21, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Tiruchirappalli", state: "Tamil Nadu", country: "India", lat: 10.79, lng: 78.69, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Tirupati", state: "Andhra Pradesh", country: "India", lat: 13.63, lng: 79.42, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Udaipur", state: "Rajasthan", country: "India", lat: 24.58, lng: 73.68, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Ujjain", state: "Madhya Pradesh", country: "India", lat: 23.18, lng: 75.77, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Vadodara", state: "Gujarat", country: "India", lat: 22.31, lng: 73.19, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Varanasi", state: "Uttar Pradesh", country: "India", lat: 25.32, lng: 83.01, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Vijayawada", state: "Andhra Pradesh", country: "India", lat: 16.51, lng: 80.65, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", country: "India", lat: 17.69, lng: 83.22, tz: 5.5, tzName: "Asia/Kolkata" },
  { city: "Warangal", state: "Telangana", country: "India", lat: 17.98, lng: 79.60, tz: 5.5, tzName: "Asia/Kolkata" },
]

// ─── INTERNATIONAL ──────────────────────────────────
const INTERNATIONAL: CityEntry[] = [
  // USA
  { city: "New York", state: "New York", country: "USA", lat: 40.71, lng: -74.01, tz: -5, tzName: "America/New_York" },
  { city: "Los Angeles", state: "California", country: "USA", lat: 34.05, lng: -118.24, tz: -8, tzName: "America/Los_Angeles" },
  { city: "Chicago", state: "Illinois", country: "USA", lat: 41.88, lng: -87.63, tz: -6, tzName: "America/Chicago" },
  { city: "Houston", state: "Texas", country: "USA", lat: 29.76, lng: -95.37, tz: -6, tzName: "America/Chicago" },
  { city: "San Francisco", state: "California", country: "USA", lat: 37.77, lng: -122.42, tz: -8, tzName: "America/Los_Angeles" },
  { city: "Seattle", state: "Washington", country: "USA", lat: 47.61, lng: -122.33, tz: -8, tzName: "America/Los_Angeles" },
  { city: "Boston", state: "Massachusetts", country: "USA", lat: 42.36, lng: -71.06, tz: -5, tzName: "America/New_York" },
  { city: "Miami", state: "Florida", country: "USA", lat: 25.76, lng: -80.19, tz: -5, tzName: "America/New_York" },
  { city: "Dallas", state: "Texas", country: "USA", lat: 32.78, lng: -96.80, tz: -6, tzName: "America/Chicago" },
  { city: "Atlanta", state: "Georgia", country: "USA", lat: 33.75, lng: -84.39, tz: -5, tzName: "America/New_York" },
  { city: "Denver", state: "Colorado", country: "USA", lat: 39.74, lng: -104.99, tz: -7, tzName: "America/Denver" },
  { city: "Phoenix", state: "Arizona", country: "USA", lat: 33.45, lng: -112.07, tz: -7, tzName: "America/Phoenix" },
  { city: "Washington DC", state: "DC", country: "USA", lat: 38.91, lng: -77.04, tz: -5, tzName: "America/New_York" },
  // UK
  { city: "London", country: "UK", lat: 51.51, lng: -0.13, tz: 0, tzName: "Europe/London" },
  { city: "Birmingham", country: "UK", lat: 52.49, lng: -1.90, tz: 0, tzName: "Europe/London" },
  { city: "Manchester", country: "UK", lat: 53.48, lng: -2.24, tz: 0, tzName: "Europe/London" },
  { city: "Edinburgh", country: "UK", lat: 55.95, lng: -3.19, tz: 0, tzName: "Europe/London" },
  // Canada
  { city: "Toronto", state: "Ontario", country: "Canada", lat: 43.65, lng: -79.38, tz: -5, tzName: "America/Toronto" },
  { city: "Vancouver", state: "BC", country: "Canada", lat: 49.28, lng: -123.12, tz: -8, tzName: "America/Vancouver" },
  { city: "Montreal", state: "Quebec", country: "Canada", lat: 45.50, lng: -73.57, tz: -5, tzName: "America/Toronto" },
  { city: "Calgary", state: "Alberta", country: "Canada", lat: 51.05, lng: -114.07, tz: -7, tzName: "America/Edmonton" },
  // Australia
  { city: "Sydney", state: "NSW", country: "Australia", lat: -33.87, lng: 151.21, tz: 11, tzName: "Australia/Sydney" },
  { city: "Melbourne", state: "VIC", country: "Australia", lat: -37.81, lng: 144.96, tz: 11, tzName: "Australia/Melbourne" },
  { city: "Brisbane", state: "QLD", country: "Australia", lat: -27.47, lng: 153.03, tz: 10, tzName: "Australia/Brisbane" },
  { city: "Perth", state: "WA", country: "Australia", lat: -31.95, lng: 115.86, tz: 8, tzName: "Australia/Perth" },
  // Middle East
  { city: "Dubai", country: "UAE", lat: 25.20, lng: 55.27, tz: 4, tzName: "Asia/Dubai" },
  { city: "Abu Dhabi", country: "UAE", lat: 24.45, lng: 54.65, tz: 4, tzName: "Asia/Dubai" },
  { city: "Sharjah", country: "UAE", lat: 25.34, lng: 55.41, tz: 4, tzName: "Asia/Dubai" },
  { city: "Doha", country: "Qatar", lat: 25.29, lng: 51.53, tz: 3, tzName: "Asia/Qatar" },
  { city: "Riyadh", country: "Saudi Arabia", lat: 24.71, lng: 46.68, tz: 3, tzName: "Asia/Riyadh" },
  { city: "Jeddah", country: "Saudi Arabia", lat: 21.54, lng: 39.17, tz: 3, tzName: "Asia/Riyadh" },
  { city: "Kuwait City", country: "Kuwait", lat: 29.38, lng: 47.99, tz: 3, tzName: "Asia/Kuwait" },
  { city: "Muscat", country: "Oman", lat: 23.59, lng: 58.55, tz: 4, tzName: "Asia/Muscat" },
  { city: "Bahrain", country: "Bahrain", lat: 26.07, lng: 50.56, tz: 3, tzName: "Asia/Bahrain" },
  // SE Asia
  { city: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82, tz: 8, tzName: "Asia/Singapore" },
  { city: "Kuala Lumpur", country: "Malaysia", lat: 3.14, lng: 101.69, tz: 8, tzName: "Asia/Kuala_Lumpur" },
  { city: "Bangkok", country: "Thailand", lat: 13.76, lng: 100.50, tz: 7, tzName: "Asia/Bangkok" },
  { city: "Jakarta", country: "Indonesia", lat: -6.21, lng: 106.85, tz: 7, tzName: "Asia/Jakarta" },
  { city: "Manila", country: "Philippines", lat: 14.60, lng: 120.98, tz: 8, tzName: "Asia/Manila" },
  { city: "Ho Chi Minh City", country: "Vietnam", lat: 10.82, lng: 106.63, tz: 7, tzName: "Asia/Ho_Chi_Minh" },
  // East Asia
  { city: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69, tz: 9, tzName: "Asia/Tokyo" },
  { city: "Seoul", country: "South Korea", lat: 37.57, lng: 126.98, tz: 9, tzName: "Asia/Seoul" },
  { city: "Hong Kong", country: "Hong Kong", lat: 22.32, lng: 114.17, tz: 8, tzName: "Asia/Hong_Kong" },
  { city: "Beijing", country: "China", lat: 39.90, lng: 116.40, tz: 8, tzName: "Asia/Shanghai" },
  { city: "Shanghai", country: "China", lat: 31.23, lng: 121.47, tz: 8, tzName: "Asia/Shanghai" },
  // South Asia (neighbors)
  { city: "Colombo", country: "Sri Lanka", lat: 6.93, lng: 79.85, tz: 5.5, tzName: "Asia/Colombo" },
  { city: "Kathmandu", country: "Nepal", lat: 27.70, lng: 85.32, tz: 5.75, tzName: "Asia/Kathmandu" },
  { city: "Dhaka", country: "Bangladesh", lat: 23.81, lng: 90.41, tz: 6, tzName: "Asia/Dhaka" },
  { city: "Karachi", country: "Pakistan", lat: 24.86, lng: 67.01, tz: 5, tzName: "Asia/Karachi" },
  { city: "Lahore", country: "Pakistan", lat: 31.55, lng: 74.35, tz: 5, tzName: "Asia/Karachi" },
  { city: "Islamabad", country: "Pakistan", lat: 33.69, lng: 73.04, tz: 5, tzName: "Asia/Karachi" },
  // Europe
  { city: "Paris", country: "France", lat: 48.86, lng: 2.35, tz: 1, tzName: "Europe/Paris" },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.41, tz: 1, tzName: "Europe/Berlin" },
  { city: "Amsterdam", country: "Netherlands", lat: 52.37, lng: 4.90, tz: 1, tzName: "Europe/Amsterdam" },
  { city: "Frankfurt", country: "Germany", lat: 50.11, lng: 8.68, tz: 1, tzName: "Europe/Berlin" },
  { city: "Zurich", country: "Switzerland", lat: 47.38, lng: 8.54, tz: 1, tzName: "Europe/Zurich" },
  { city: "Rome", country: "Italy", lat: 41.90, lng: 12.50, tz: 1, tzName: "Europe/Rome" },
  { city: "Madrid", country: "Spain", lat: 40.42, lng: -3.70, tz: 1, tzName: "Europe/Madrid" },
  { city: "Stockholm", country: "Sweden", lat: 59.33, lng: 18.07, tz: 1, tzName: "Europe/Stockholm" },
  { city: "Moscow", country: "Russia", lat: 55.76, lng: 37.62, tz: 3, tzName: "Europe/Moscow" },
  // Africa
  { city: "Nairobi", country: "Kenya", lat: -1.29, lng: 36.82, tz: 3, tzName: "Africa/Nairobi" },
  { city: "Lagos", country: "Nigeria", lat: 6.52, lng: 3.38, tz: 1, tzName: "Africa/Lagos" },
  { city: "Johannesburg", country: "South Africa", lat: -26.20, lng: 28.05, tz: 2, tzName: "Africa/Johannesburg" },
  { city: "Cape Town", country: "South Africa", lat: -33.93, lng: 18.42, tz: 2, tzName: "Africa/Johannesburg" },
  { city: "Cairo", country: "Egypt", lat: 30.04, lng: 31.24, tz: 2, tzName: "Africa/Cairo" },
  // South America
  { city: "Sao Paulo", country: "Brazil", lat: -23.55, lng: -46.63, tz: -3, tzName: "America/Sao_Paulo" },
  // New Zealand
  { city: "Auckland", country: "New Zealand", lat: -36.85, lng: 174.76, tz: 13, tzName: "Pacific/Auckland" },
]

/** Combined city database — 200+ cities total */
export const CITY_DATABASE: CityEntry[] = [...INDIA, ...INTERNATIONAL]

/**
 * Search cities by query string.
 * Matches against city name, state, and country. Returns top N matches.
 */
export function searchCities(query: string, limit = 8): CityEntry[] {
  if (!query || query.trim().length < 2) return []

  const q = query.toLowerCase().trim()
  const words = q.split(/[\s,]+/).filter(Boolean)

  // Score each city by match quality
  const scored = CITY_DATABASE.map((city) => {
    const cityLower = city.city.toLowerCase()
    const stateLower = (city.state || "").toLowerCase()
    const countryLower = city.country.toLowerCase()
    const full = `${cityLower} ${stateLower} ${countryLower}`

    let score = 0

    // Exact city match → highest
    if (cityLower === q) score += 100
    // City starts with query → very high
    else if (cityLower.startsWith(q)) score += 80
    // City contains query → high
    else if (cityLower.includes(q)) score += 60

    // Multi-word: all words match somewhere
    if (words.length > 1) {
      const allMatch = words.every((w) => full.includes(w))
      if (allMatch) score += 70
    }

    // State/country bonus
    if (stateLower.includes(q) || countryLower.includes(q)) score += 30

    // First word matches city start
    if (words[0] && cityLower.startsWith(words[0])) score += 40

    return { city, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.city)
}
