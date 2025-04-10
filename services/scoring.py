from typing import Dict
from models import PropertyType, OwnershipType
import numpy as np
from geopy.distance import geodesic

class PropertyScorer:
    def __init__(self):
        self.min_lot_size = 5000  # Minimum lot size in sq ft
        self.max_lot_size = 50000  # Maximum lot size in sq ft
        
    def calculate_suitability_score(self, property_data: Dict) -> float:
        """Calculate overall suitability score (0-100)"""
        scores = {
            'size_score': self._calculate_size_score(property_data['lot_size_sqft']),
            'vacancy_score': self._calculate_vacancy_score(property_data['vacancy_status']),
            'ownership_score': self._calculate_ownership_score(property_data['ownership_type']),
            'zoning_score': self._calculate_zoning_score(property_data['parcel_zoning']),
            'poi_score': property_data['poi_proximity_score']
        }
        
        # Weight the scores
        weights = {
            'size_score': 0.25,
            'vacancy_score': 0.20,
            'ownership_score': 0.15,
            'zoning_score': 0.25,
            'poi_score': 0.15
        }
        
        # Calculate weighted sum
        total_score = sum(score * weights[category] for category, score in scores.items())
        return round(total_score, 2)
    
    def _calculate_size_score(self, lot_size: float) -> float:
        """Calculate score based on lot size (0-20)"""
        if lot_size < self.min_lot_size:
            return 0
        if lot_size > self.max_lot_size:
            return 20
        return (lot_size - self.min_lot_size) / (self.max_lot_size - self.min_lot_size) * 20
    
    def _calculate_vacancy_score(self, is_vacant: bool) -> float:
        """Calculate score based on vacancy status (0-20)"""
        return 20 if is_vacant else 0
    
    def _calculate_ownership_score(self, ownership_type: OwnershipType) -> float:
        """Calculate score based on ownership type (0-15)"""
        return 15 if ownership_type == OwnershipType.PUBLIC else 0
    
    def _calculate_zoning_score(self, zoning: str) -> float:
        """Calculate score based on zoning (0-25)"""
        zoning_scores = {
            'Commercial': 25,
            'Mixed-Use': 20,
            'Industrial': 15,
            'Residential': 10,
            'Unknown': 5
        }
        return zoning_scores.get(zoning, 5)
    
    def calculate_poi_score(self, property_data: Dict, pois: Dict) -> float:
        """Calculate POI proximity score (0-20)"""
        if not pois:
            return 0
            
        property_coords = (property_data['latitude'], property_data['longitude'])
        total_score = 0
        
        # Score based on proximity to different types of POIs
        for poi_type, poi_list in pois.items():
            if not poi_list:
                continue
                
            # Find nearest POI of this type
            min_distance = min(
                geodesic(property_coords, (poi['lat'], poi['lng'])).miles
                for poi in poi_list
            )
            
            # Score based on distance (closer = higher score)
            if min_distance < 0.5:  # Within 0.5 miles
                total_score += 5
            elif min_distance < 1:  # Within 1 mile
                total_score += 3
            elif min_distance < 2:  # Within 2 miles
                total_score += 1
                
        return min(total_score, 20)  # Cap at 20 