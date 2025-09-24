import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server');
    }
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
);

export const api = {
  getTimeline: async () => {
    try {
      const response = await apiClient.get('/timeline');
      return response;
    } catch (error) {
      console.warn('Timeline API not available, using mock data');
      return {
        data: [
          {
            id: 1,
            era: "Ancient Times",
            title: "Early Agriculture",
            dateRange: "10,000 - 3,000 BCE",
            description: "The development of farming fundamentally changed human civilization. Early humans transitioned from hunting and gathering to cultivating crops and domesticating animals.",
            image: "/images/ancient-farming.jpg",
            tags: ["agriculture", "civilization", "tools", "crops"]
          },
          {
            id: 2,
            era: "Medieval Period",
            title: "Three-Field System",
            dateRange: "500 - 1500 CE",
            description: "Medieval farmers developed the three-field system, rotating crops to maintain soil fertility and increase agricultural productivity across Europe.",
            image: "/images/medieval-farming.jpg",
            tags: ["medieval", "crop rotation", "productivity", "europe"]
          },
          {
            id: 3,
            era: "Industrial Revolution",
            title: "Agricultural Revolution",
            dateRange: "1760 - 1840",
            description: "The Agricultural Revolution brought mechanization, selective breeding, and new farming techniques that dramatically increased food production.",
            image: "/images/industrial-farming.jpg",
            tags: ["industrial", "mechanization", "productivity", "innovation"]
          },
          {
            id: 4,
            era: "Modern Era",
            title: "Precision Agriculture",
            dateRange: "1990 - Present",
            description: "Modern farming uses GPS, drones, sensors, and data analytics to optimize crop yields while minimizing environmental impact.",
            image: "/images/modern-farming.jpg",
            tags: ["technology", "precision", "sustainability", "data"]
          }
        ]
      };
    }
  },

  getContentById: async (id) => {
    try {
      const response = await apiClient.get(`/content/${id}`);
      return response;
    } catch (error) {
      console.warn('Content API not available, using mock data');
      return {
        data: {
          id: parseInt(id),
          era: "Ancient Times",
          title: "Early Agriculture",
          dateRange: "10,000 - 3,000 BCE",
          subtitle: "The Birth of Civilization Through Farming",
          description: "The development of farming fundamentally changed human civilization.",
          image: "/images/ancient-farming-hero.jpg",
          blocks: [
            {
              type: "text",
              title: "The Agricultural Revolution",
              content: "Around 10,000 years ago, humans began transitioning from a nomadic lifestyle of hunting and gathering to settling in one place and growing their own food. This shift, known as the Neolithic Revolution or Agricultural Revolution, marked the beginning of civilization as we know it."
            },
            {
              type: "timeline",
              title: "Key Developments",
              events: [
                {
                  date: "10,000 BCE",
                  title: "First Domesticated Crops",
                  description: "Wheat and barley were first cultivated in the Fertile Crescent"
                },
                {
                  date: "9,000 BCE",
                  title: "Animal Domestication",
                  description: "Sheep, goats, and cattle were domesticated for food and labor"
                },
                {
                  date: "8,000 BCE",
                  title: "Agricultural Tools",
                  description: "Development of the plow and other farming implements"
                }
              ]
            },
            {
              type: "comparison",
              title: "Before vs After Agriculture",
              before: {
                title: "Hunter-Gatherer Life",
                description: "Nomadic lifestyle, small groups, limited food security, constant movement in search of resources."
              },
              after: {
                title: "Agricultural Communities",
                description: "Permanent settlements, larger populations, food surplus, specialization of labor, development of civilization."
              }
            }
          ],
          gallery: [
            {
              src: "/images/ancient-tools-1.jpg",
              caption: "Early farming tools discovered in archaeological sites"
            },
            {
              src: "/images/ancient-tools-2.jpg",
              caption: "Primitive plows used in early agriculture"
            },
            {
              src: "/images/ancient-crops.jpg",
              caption: "Ancient varieties of wheat and barley"
            }
          ]
        }
      };
    }
  },

  createContent: async (contentData) => {
    const response = await apiClient.post('/content', contentData);
    return response;
  },

  updateContent: async (id, contentData) => {
    const response = await apiClient.put(`/content/${id}`, contentData);
    return response;
  },

  deleteContent: async (id) => {
    const response = await apiClient.delete(`/content/${id}`);
    return response;
  },

  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response;
    } catch (error) {
      console.warn('Stats API not available, using mock data');
      return {
        data: {
          totalContent: 12,
          totalVisits: 1547,
          recentActivities: [
            {
              description: "New content added: Industrial Revolution",
              timestamp: "2 hours ago"
            },
            {
              description: "Timeline updated with new artifacts",
              timestamp: "1 day ago"
            },
            {
              description: "System backup completed successfully",
              timestamp: "2 days ago"
            }
          ]
        }
      };
    }
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  }
};

export default api;