import { useState } from 'react';
import CampaignCard from '../components/campaigns/campaignCard';
import ParticipationModal from '../components/campaigns/ParticipationModal';
import { Plus, Filter, Search } from 'lucide-react';

const Campaigns = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      title: 'Campus E-Waste Awareness Week',
      type: 'Awareness Campaign',
      description: 'Join us for a week-long event to learn about e-waste management and participate in collection drives across campus.',
      startDate: '2023-09-15',
      endDate: '2023-09-22',
      location: 'Main Campus',
      currentParticipants: 124,
      targetParticipants: 200,
      difficulty: 'easy',
      imageUrl: '/api/placeholder/400/200',
      rewards: 'Certificate of Participation + Eco-friendly merchandise',
      guidelines: [
        'Register before September 10th',
        'Attend at least 3 workshop sessions',
        'Collect and submit minimum 5 e-waste items'
      ],
      impactDescription: 'This campaign aims to collect over 500kg of e-waste and educate 200+ students about responsible disposal.',
      isParticipating: false
    },
    // More campaigns...
  ]);

  const handleParticipate = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleParticipationSubmit = (participationData) => {
    // Update campaign participation status
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === participationData.campaignId
        ? { 
            ...campaign, 
            currentParticipants: campaign.currentParticipants + 1,
            isParticipating: true 
          }
        : campaign
    ));
    
    // Here you would typically send the data to your backend
    console.log('Participation data:', participationData);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = filter === 'all' || campaign.status === filter;
    const matchesSearch = searchQuery === '' || 
                         campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Awareness Campaigns</h2>
          <p className="text-gray-600">Join initiatives to promote e-waste management and sustainability</p>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {['all', 'active', 'upcoming', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map(campaign => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onParticipate={handleParticipate}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Filter className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try adjusting your search query' : 'No campaigns available at the moment'}
          </p>
        </div>
      )}

      {/* Participation Modal */}
      {selectedCampaign && (
        <ParticipationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          campaign={selectedCampaign}
          onParticipate={handleParticipationSubmit}
        />
      )}
    </div>
  );
};

export default Campaigns;