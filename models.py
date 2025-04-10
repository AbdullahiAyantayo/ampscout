from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class PropertyType(str, Enum):
    VACANT_LOT = "vacant_lot"
    ABANDONED_BUILDING = "abandoned_building"
    PARKING_STRUCTURE = "parking_structure"
    COMMERCIAL_SPACE = "commercial_space"
    PUBLIC_LOT = "public_lot"

class OwnershipType(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"

class SiteResponse(BaseModel):
    site_id: str
    address: str
    latitude: float
    longitude: float
    lot_size_sqft: float
    property_type: PropertyType
    parcel_zoning: str
    ownership_type: OwnershipType
    vacancy_status: bool
    poi_proximity_score: float = Field(ge=0, le=20)
    suitability_score: float = Field(ge=0, le=100)

class CityRequest(BaseModel):
    city: str
    state: str
    zip_code: Optional[str] = None

class SiteResponseList(BaseModel):
    sites: List[SiteResponse] 