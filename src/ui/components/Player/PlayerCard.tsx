import React from 'react';
import './PlayerCard.css';


interface PlayerCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ title, subtitle, imageUrl }) => {
  return (
    <div className="player-card">
      <div className="player-card-img" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div className="player-card-info">
        <p className="player-text-title">{title}</p>
        <p className="player-text-body">{subtitle}</p>
        {/* Playback controls can be added here */}
      </div>
    </div>
  );
};

export default PlayerCard;