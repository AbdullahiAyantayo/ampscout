import requests
import pandas as pd
from typing import List, Dict, Optional
from models import PropertyType, OwnershipType
import numpy as np
from datetime import datetime

class DetroitDataService:
    BASE_URL = "https://data.detroitmi.gov/resource"
    
    def __init__(self):
        self.parcels_url = f"{self.BASE_URL}/9rud-6fyu.json"
        self.public_parcels_url = f"{self.BASE_URL}/fz4s-46zy.json"
        self.structure_condition_url = f"{self.BASE_URL}/65v9-cms2.json"
        self.zoning_url = f"{self.BASE_URL}/jybz-y9vj.json"
        
    def fetch_parcels(self) -> pd.DataFrame:
        """Fetch all property parcels from Detroit's Open Data Portal"""
        try:
            response = requests.get(self.parcels_url, params={
                "$limit": 1000,
                "$where": "lot_size > 5000",  # Filter for minimum lot size
                "$select": "parcel_id,address,latitude,longitude,lot_size,structure_type,use_type,zoning"
            })
            response.raise_for_status()
            return pd.DataFrame(response.json())
        except Exception as e:
            print(f"Error fetching parcels: {e}")
            return pd.DataFrame()

    def fetch_public_parcels(self) -> pd.DataFrame:
        """Fetch publicly owned properties"""
        try:
            response = requests.get(self.public_parcels_url, params={
                "$limit": 1000,
                "$select": "parcel_id,owner_name"
            })
            response.raise_for_status()
            return pd.DataFrame(response.json())
        except Exception as e:
            print(f"Error fetching public parcels: {e}")
            return pd.DataFrame()

    def fetch_structure_condition(self) -> pd.DataFrame:
        """Fetch building condition data"""
        try:
            response = requests.get(self.structure_condition_url, params={
                "$limit": 1000,
                "$select": "parcel_id,condition"
            })
            response.raise_for_status()
            return pd.DataFrame(response.json())
        except Exception as e:
            print(f"Error fetching structure condition: {e}")
            return pd.DataFrame()

    def process_properties(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Process and combine property data with optional filters"""
        parcels = self.fetch_parcels()
        public_parcels = self.fetch_public_parcels()
        structure_condition = self.fetch_structure_condition()
        
        if parcels.empty:
            return []
            
        # Merge data
        parcels['public_owned'] = parcels['parcel_id'].isin(public_parcels['parcel_id'])
        
        # Apply filters if provided
        if filters:
            if 'min_lot_size' in filters:
                parcels = parcels[parcels['lot_size'] >= filters['min_lot_size']]
            if 'property_type' in filters:
                parcels = parcels[parcels['structure_type'] == filters['property_type']]
            if 'zoning' in filters:
                parcels = parcels[parcels['zoning'].str.contains(filters['zoning'], case=False, na=False)]
        
        # Process properties
        properties = []
        for _, row in parcels.iterrows():
            property_data = {
                'site_id': f"DET-{row.get('parcel_id', '')}",
                'address': row.get('address', ''),
                'latitude': float(row.get('latitude', 0)),
                'longitude': float(row.get('longitude', 0)),
                'lot_size_sqft': float(row.get('lot_size', 0)),
                'property_type': self._determine_property_type(row),
                'parcel_zoning': row.get('zoning', 'Unknown'),
                'ownership_type': OwnershipType.PUBLIC if row.get('public_owned') else OwnershipType.PRIVATE,
                'vacancy_status': self._determine_vacancy(row, structure_condition),
                'poi_proximity_score': 0,  # Will be calculated separately
                'suitability_score': 0  # Will be calculated separately
            }
            properties.append(property_data)
            
        return properties

    def _determine_property_type(self, row: pd.Series) -> PropertyType:
        """Determine the property type based on available data"""
        structure_type = str(row.get('structure_type', '')).lower()
        use_type = str(row.get('use_type', '')).lower()
        
        if 'vacant' in structure_type:
            return PropertyType.VACANT_LOT
        elif 'abandoned' in structure_type:
            return PropertyType.ABANDONED_BUILDING
        elif 'parking' in use_type:
            return PropertyType.PARKING_STRUCTURE
        elif row.get('public_owned'):
            return PropertyType.PUBLIC_LOT
        else:
            return PropertyType.COMMERCIAL_SPACE

    def _determine_vacancy(self, row: pd.Series, structure_condition: pd.DataFrame) -> bool:
        """Determine if a property is vacant"""
        if str(row.get('structure_type', '')).lower() == 'vacant':
            return True
        if not structure_condition.empty:
            condition = structure_condition[structure_condition['parcel_id'] == row.get('parcel_id')]
            if not condition.empty:
                return condition.iloc[0].get('condition', '').lower() == 'vacant'
        return False 