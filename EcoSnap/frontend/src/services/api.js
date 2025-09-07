/*central API service layer
E-Waste API Functions (ewasteAPI)- These handle all e-waste operations:
- getBySerial(serial)- Fetch an item using its QR/serial number., Used when scanning QR codes.
- updateStatusBySerial(serial, status)- Updates status (pending, in-transit, done) using serial.
- updateStatusWithRole(qrId, role, licenseNo, registrationNo)- Role-based update (vendor or company) with validation.
- acceptItem(itemId, vendorId, notes)- Vendor accepts a donor’s e-waste item.
- updateToInTransit(itemId, vendorId, notes)- Vendor marks the item as in-transit.
- markAsDone(itemId, companyId, notes)- Company marks the item as completed (recycled/disposed).
- create(ewasteData)- Add a new e-waste item (used by vendors or companies).
- getAll()- Fetch all items (for vendors and companies).
- getByDonorId(donorId)- Fetch items submitted by a specific donor (used for donor view)., Includes console logs for debugging.

User API Functions (userAPI)- handle user management:
- createOrUpdateUser(role, userData)- Creates or updates a user in your backend based on their role (donor, vendor, company).
- getUserByClerkId(clerkId)- Fetches a user by their Clerk ID., Returns null if the user doesn’t exist.
*/
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// E-waste API functions
export const ewasteAPI = {
  // Get e-waste by serial number (for QR scanning)
  getBySerial: async (serial) => {
    try {
      const response = await api.get(`/ewastes/serial/${serial}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error("E-waste item not found");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch e-waste item"
      );
    }
  },

  // Update status by serial number
  updateStatusBySerial: async (serial, status) => {
    try {
      const response = await api.put(`/ewastes/serial/${serial}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update status");
    }
  },

  // Update status with role-based validation
  updateStatusWithRole: async (qrId, role, licenseNo, registrationNo) => {
    try {
      const response = await api.post('/ewastes/update-status', {
        qrId,
        role,
        licenseNo,
        registrationNo
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update status"
      );
    }
  },

  // Accept e-waste item (vendor function)
  acceptItem: async (itemId, vendorId, notes = "") => {
    try {
      const response = await api.put(`/ewastes/${itemId}/accept`, {
        vendorId,
        notes,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to accept item");
    }
  },

  // Update item to "in transit" (vendor function)
  updateToInTransit: async (itemId, vendorId, notes = "") => {
    try {
      const response = await api.put(`/ewastes/${itemId}/in-transit`, {
        vendorId,
        notes,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to update item to in transit"
      );
    }
  },

  // Mark item as done (company function)
  markAsDone: async (itemId, companyId, notes = "") => {
    try {
      const response = await api.put(`/ewastes/${itemId}/done`, {
        companyId,
        notes,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to mark item as done"
      );
    }
  },

  // Create new e-waste item
  create: async (ewasteData) => {
    try {
      const response = await api.post("/ewastes", ewasteData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to create e-waste item"
      );
    }
  },

  // Get all e-waste items
  getAll: async () => {
    try {
      const response = await api.get("/ewastes");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch e-waste items"
      );
    }
  },

  // Get e-waste items by donor ID (Clerk ID)
  getByDonorId: async (donorId) => {
    try {
      console.log("🌐 API: Calling getByDonorId with donorId:", donorId);
      const response = await api.get(`/ewastes/donor/${donorId}`);
      console.log("🌐 API: Response received:", response.data.length, "items");
      console.log("🌐 API: Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("🌐 API: Error in getByDonorId:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch donor e-waste items"
      );
    }
  },
};

// User management API functions
export const userAPI = {
  // Create or update user based on role
  createOrUpdateUser: async (role, userData) => {
    try {
      console.log('API: Creating/updating user with role:', role, 'data:', userData);
      const response = await api.post(`/users/${role}`, userData);
      console.log('API: User creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error creating/updating user:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw new Error(
        error.response?.data?.error || "Failed to create/update user"
      );
    }
  },

  // Get user by Clerk ID
  getUserByClerkId: async (clerkId) => {
    try {
      console.log('API: Fetching user for clerkId:', clerkId);
      const response = await api.get(`/users/clerk/${clerkId}`);
      console.log('API: Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error fetching user:', error);
      if (error.response?.status === 404) {
        return null; // User not found
      }
      if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
  },
};

// Gemini API for e-waste classification
// Note: If you encounter 429 (rate limit) errors, consider:
// 1. Using a different API key
// 2. Implementing a queue system for API calls
// 3. Increasing the MIN_CALL_INTERVAL value
const GEMINI_API_KEY ="AIzaSyAJiWbzaJJFQGwZAANH4uDKKIAsedDDqVI" //"AIzaSyAJiWbzaJJFQGwZAANH4uDKKIAsedDDqVI" //"AIzaSyA-e7XGdO-JGo9KphJmHzdD4TXo4I_ZfB4" //"AIzaSyDKsZdOXeRUTuNbXuREx0-Tfo5AHpga6rg";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Rate limiting variables
let lastApiCall = 0;
const MIN_CALL_INTERVAL = 2000; // 2 seconds between calls
let retryCount = 0;
const MAX_RETRIES = 3;

// Create a separate axios instance for Gemini API
const geminiApi = axios.create({
  baseURL: "https://generativelanguage.googleapis.com",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    key: GEMINI_API_KEY,
  },
});

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback classification function
const getFallbackClassification = (itemData) => {
  const typeLower = (itemData.itemType || '').toLowerCase();
  const conditionLower = (itemData.condition || '').toLowerCase();
  
  // Simple rule-based classification as fallback
  const hazardousTypes = ['battery', 'ups', 'crt', 'tube', 'bulb', 'toner', 'ink', 'headphones'];
  const reusableTypes = ['laptop', 'desktop', 'monitor', 'mobile', 'phone', 'tablet'];
  
  let hazardousPercentage = 0;
  let recyclablePercentage = 0;
  let reusablePercentage = 0;
  
  if (hazardousTypes.some(t => typeLower.includes(t)) || conditionLower.includes('leak')) {
    hazardousPercentage = 70;
    recyclablePercentage = 20;
    reusablePercentage = 10;
  } else if (reusableTypes.some(t => typeLower.includes(t)) && 
             (conditionLower.includes('working') || conditionLower.includes('good'))) {
    hazardousPercentage = 10;
    recyclablePercentage = 30;
    reusablePercentage = 60;
  } else {
    hazardousPercentage = 20;
    recyclablePercentage = 60;
    reusablePercentage = 20;
  }
  
  return {
    classification: {
      hazardous: {
        percentage: hazardousPercentage,
        components: hazardousPercentage > 0 ? ["Electronic components", "Potential hazardous materials"] : [],
        description: hazardousPercentage > 0 ? "Contains electronic components that may have hazardous materials" : "No significant hazardous materials detected"
      },
      recyclable: {
        percentage: recyclablePercentage,
        components: recyclablePercentage > 0 ? ["Plastic casing", "Metal components", "Circuit boards"] : [],
        description: recyclablePercentage > 0 ? "Contains recyclable materials like plastic, metal, and electronic components" : "Limited recyclable materials"
      },
      reusable: {
        percentage: reusablePercentage,
        components: reusablePercentage > 0 ? ["Functional components", "Repairable parts"] : [],
        description: reusablePercentage > 0 ? "Item may be reusable or have reusable components" : "Limited reusability"
      }
    },
    recommendations: {
      disposal_method: hazardousPercentage > 50 ? "Professional e-waste disposal" : "Standard e-waste recycling",
      safety_notes: hazardousPercentage > 50 ? "Handle with care, avoid exposure to internal components" : "Standard handling procedures apply",
      value_estimate: "To be determined by professional assessment"
    },
    environmental_impact: {
      co2_saved: "Varies based on disposal method",
      landfill_reduction: "Significant reduction through proper recycling"
    }
  };
};

export const geminiAPI = {
  // Classify e-waste item using Gemini AI
  classifyEwaste: async (itemData) => {
    console.log(itemData);
    
    // Rate limiting check
    const now = Date.now();
    if (now - lastApiCall < MIN_CALL_INTERVAL) {
      console.log('Rate limiting: Using fallback classification');
      return getFallbackClassification(itemData);
    }
    
    try {
      // Update last call time
      lastApiCall = now;
      
      const prompt = `
Analyze this e-waste item and provide a detailed classification:

Item Type: ${itemData.itemType}
Brand: ${itemData.brand || "Not specified"}
Model: ${itemData.model || "Not specified"}
Age: ${itemData.age || "Not specified"}
Weight: ${itemData.weight}
Condition: ${itemData.condition}
Picture: ${itemData.picture ? "Image provided" : "No image"}

Please provide a JSON response with the following structure:
{
  "classification": {
    "hazardous": {
      "percentage": number (0-100),
      "components": ["list of hazardous components"],
      "description": "explanation of hazardous elements"
    },
    "recyclable": {
      "percentage": number (0-100),
      "components": ["list of recyclable components"],
      "description": "explanation of recyclable elements"
    },
    "reusable": {
      "percentage": number (0-100),
      "components": ["list of reusable components"],
      "description": "explanation of reusable elements"
    }
  },
  "recommendations": {
    "disposal_method": "recommended disposal method",
    "safety_notes": "safety considerations",
    "value_estimate": "estimated value in USD"
  },
  "environmental_impact": {
    "co2_saved": "estimated CO2 saved in kg",
    "landfill_reduction": "estimated landfill space saved in cubic meters"
  }
}

Be specific and accurate in your analysis. Consider the item type, condition, and age when determining classifications.
`;

      const response = await geminiApi.post(
        "/v1beta/models/gemini-pro:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );
      
      console.log(response);
      const data = response.data;
      console.log(data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const text = data.candidates[0].content.parts[0].text;

        // Try to extract JSON from the response
        try {
          // Find JSON in the response (it might be wrapped in markdown)
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (parseError) {
          console.error("Error parsing Gemini response:", parseError);
        }

        // If JSON parsing fails, return a structured response
        return {
          raw_response: text,
          classification: {
            hazardous: {
              percentage: 0,
              components: [],
              description: "Analysis in progress",
            },
            recyclable: {
              percentage: 0,
              components: [],
              description: "Analysis in progress",
            },
            reusable: {
              percentage: 0,
              components: [],
              description: "Analysis in progress",
            },
          },
          recommendations: {
            disposal_method: "Standard e-waste disposal",
            safety_notes: "Handle with care",
            value_estimate: "To be determined",
          },
          environmental_impact: {
            co2_saved: "0 kg",
            landfill_reduction: "0 cubic meters",
          },
        };
      }

      throw new Error("Invalid response from Gemini API");
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        console.log('Rate limit exceeded, using fallback classification');
        return getFallbackClassification(itemData);
      }
      
      // Retry logic for other errors
      if (retryCount < MAX_RETRIES && error.response?.status >= 500) {
        retryCount++;
        console.log(`Retrying API call (${retryCount}/${MAX_RETRIES})...`);
        await delay(1000 * retryCount); // Exponential backoff
        return geminiAPI.classifyEwaste(itemData);
      }
      
      // Reset retry count on success or max retries
      retryCount = 0;
      
      // Use fallback classification for any other errors
      console.log('Using fallback classification due to API error');
      return getFallbackClassification(itemData);
    }
  },
};

export default api;
