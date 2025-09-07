import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Target,
  Award,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  TrendingUp
} from 'lucide-react';
import { format, differenceInDays, isAfter } from 'date-fns';

const CampaignCard = ({ campaign, onParticipate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isAfter(now, end)) return 'completed';
    if (isAfter(now, start)) return 'active';
    return 'upcoming';
  };

  const status = getStatus(campaign.startDate, campaign.endDate);
  const daysLeft = differenceInDays(new Date(campaign.endDate), new Date());
  const progress = Math.min((campaign.currentParticipants / campaign.targetParticipants) * 100, 100);

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', label: 'Active' },
    upcoming: { color: 'bg-blue-100 text-blue-800', label: 'Upcoming' },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' }
  };

  const difficultyConfig = {
    easy: { color: 'text-green-600', label: 'Easy' },
    medium: { color: 'text-yellow-600', label: 'Medium' },
    hard: { color: 'text-red-600', label: 'Challenging' }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header with Image */}
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
        {campaign.imageUrl ? (
          <img 
            src={campaign.imageUrl} 
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">{campaign.type}</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </div>
        
        {/* Participation Badge */}
        {campaign.isParticipating && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            Joined
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Type */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{campaign.title}</h3>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
            {campaign.type}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {campaign.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {format(new Date(campaign.startDate), 'MMM dd')} - {format(new Date(campaign.endDate), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            {campaign.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-green-500" />
            {campaign.currentParticipants} / {campaign.targetParticipants} participants
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Award className="w-4 h-4 mr-2 text-yellow-500" />
            <span className={difficultyConfig[campaign.difficulty].color}>
              {difficultyConfig[campaign.difficulty].label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Participation Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onParticipate(campaign)}
            disabled={status === 'completed' || campaign.isParticipating}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              campaign.isParticipating
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : status === 'completed'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {campaign.isParticipating ? 'Already Joined' : status === 'completed' ? 'Campaign Ended' : 'Join Campaign'}
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            Details
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Campaign Details</h4>
            
            {/* Rewards */}
            {campaign.rewards && (
              <div className="mb-3">
                <div className="flex items-center text-sm text-gray-700 mb-2">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="font-medium">Rewards:</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{campaign.rewards}</p>
              </div>
            )}

            {/* Guidelines */}
            {campaign.guidelines && (
              <div className="mb-3">
                <div className="flex items-center text-sm text-gray-700 mb-2">
                  <Star className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-medium">Guidelines:</span>
                </div>
                <ul className="text-sm text-gray-600 ml-6 list-disc space-y-1">
                  {campaign.guidelines.map((guideline, index) => (
                    <li key={index}>{guideline}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Impact */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-blue-700 mb-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-medium">Environmental Impact:</span>
              </div>
              <p className="text-sm text-blue-600">{campaign.impactDescription}</p>
            </div>

            {/* Time Left */}
            {status === 'active' && (
              <div className="flex items-center mt-3 text-sm text-orange-600">
                <Clock className="w-4 h-4 mr-2" />
                {daysLeft > 0 ? `${daysLeft} days left` : 'Ending today'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;