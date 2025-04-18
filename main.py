from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from models import CityRequest, SiteResponseList, SiteResponse, PropertyType, OwnershipType
from services.detroit_data import DetroitDataService
from services.scoring import PropertyScorer
from typing import List, Dict, Optional
import os
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="AmpScout API",
    description="API for identifying and ranking potential EV charging station locations",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up templates and static files
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize services
data_service = DetroitDataService()
scorer = PropertyScorer()

# Sample data
PROPERTY_TYPES = [
    "commercial",
    "industrial",
    "vacant_lot",
    "parking_lot",
    "retail"
]

ZONING_TYPES = [
    "B4",  # General Business
    "M1",  # Limited Industrial
    "M2",  # Restricted Industrial
    "M3",  # General Industrial
    "M4"   # Intensive Industrial
]

# Sample sites data with Detroit coordinates
SAMPLE_SITES = [
    {
        "id": 1,
        "address": "123 Woodward Ave, Detroit, MI",
        "latitude": 42.3314,
        "longitude": -83.0458,
        "property_type": "commercial",
        "lot_size": 12000,
        "zoning": "B4",
        "ownership": "Private",
        "vacancy": "No",
        "poi_score": 0.92,
        "suitability_score": 0.95
    },
    {
        "id": 2,
        "address": "456 Michigan Ave, Detroit, MI",
        "latitude": 42.3401,
        "longitude": -83.0550,
        "property_type": "industrial",
        "lot_size": 25000,
        "zoning": "M1",
        "ownership": "Public",
        "vacancy": "Yes",
        "poi_score": 0.75,
        "suitability_score": 0.88
    },
    {
        "id": 3,
        "address": "789 Gratiot Ave, Detroit, MI",
        "latitude": 42.3489,
        "longitude": -83.0401,
        "property_type": "parking_lot",
        "lot_size": 8000,
        "zoning": "B4",
        "ownership": "Private",
        "vacancy": "No",
        "poi_score": 0.85,
        "suitability_score": 0.82
    },
    {
        "id": 4,
        "address": "321 Grand River Ave, Detroit, MI",
        "latitude": 42.3337,
        "longitude": -83.0552,
        "property_type": "retail",
        "lot_size": 15000,
        "zoning": "B4",
        "ownership": "Private",
        "vacancy": "No",
        "poi_score": 0.88,
        "suitability_score": 0.90
    },
    {
        "id": 5,
        "address": "654 Warren Ave, Detroit, MI",
        "latitude": 42.3412,
        "longitude": -83.0623,
        "property_type": "vacant_lot",
        "lot_size": 10000,
        "zoning": "M2",
        "ownership": "Public",
        "vacancy": "Yes",
        "poi_score": 0.65,
        "suitability_score": 0.70
    },
    {
        "id": 6,
        "address": "987 Jefferson Ave, Detroit, MI",
        "latitude": 42.3478,
        "longitude": -83.0345,
        "property_type": "industrial",
        "lot_size": 30000,
        "zoning": "M3",
        "ownership": "Private",
        "vacancy": "No",
        "poi_score": 0.72,
        "suitability_score": 0.85
    },
    {
        "id": 7,
        "address": "741 Cass Ave, Detroit, MI",
        "latitude": 42.3356,
        "longitude": -83.0524,
        "property_type": "commercial",
        "lot_size": 18000,
        "zoning": "B4",
        "ownership": "Private",
        "vacancy": "No",
        "poi_score": 0.95,
        "suitability_score": 0.93
    },
    {
        "id": 8,
        "address": "852 Fort St, Detroit, MI",
        "latitude": 42.3289,
        "longitude": -83.0492,
        "property_type": "parking_lot",
        "lot_size": 20000,
        "zoning": "B4",
        "ownership": "Public",
        "vacancy": "No",
        "poi_score": 0.82,
        "suitability_score": 0.87
    }
]

# Models
class Site(BaseModel):
    id: str
    latitude: float
    longitude: float
    name: str
    score: float
    status: str

class DashboardStats(BaseModel):
    totalSites: int
    highRoiSites: int
    readyForReview: int
    activeProjects: int

@app.get("/")
async def home(request: Request):
    """Render the home page"""
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "property_types": PROPERTY_TYPES,
            "zoning_types": ZONING_TYPES
        }
    )

@app.get("/api/potential-sites")
async def get_potential_sites(
    city: str,
    state: str,
    zip_code: Optional[str] = None,
    min_lot_size: Optional[int] = 5000,
    property_type: Optional[str] = None,
    zoning: Optional[str] = None
):
    """Get potential sites for EV charging station installation"""
    if city.lower() != "detroit" or state.upper() != "MI":
        raise HTTPException(
            status_code=400,
            detail="Currently only Detroit, MI is supported"
        )
    
    # Filter sites based on criteria
    filtered_sites = SAMPLE_SITES.copy()
    
    if min_lot_size:
        filtered_sites = [site for site in filtered_sites if site["lot_size"] >= min_lot_size]
    
    if property_type and property_type != "":
        filtered_sites = [site for site in filtered_sites if site["property_type"] == property_type]
    
    if zoning and zoning != "":
        filtered_sites = [site for site in filtered_sites if site["zoning"] == zoning]
    
    # Sort sites by suitability score
    filtered_sites.sort(key=lambda x: x["suitability_score"], reverse=True)
    
    return filtered_sites

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Routes
@app.get("/api/stats/dashboard", response_model=DashboardStats)
async def get_dashboard_stats():
    # This would typically come from a database
    return {
        "totalSites": 150,
        "highRoiSites": 45,
        "readyForReview": 12,
        "activeProjects": 8
    }

@app.get("/api/sites", response_model=List[Site])
async def get_sites():
    # This would typically come from a database
    return [
        {
            "id": "1",
            "latitude": 42.3314,
            "longitude": -83.0458,
            "name": "Downtown Detroit Location",
            "score": 85,
            "status": "available"
        }
    ]

# Serve static files
app.mount("/", StaticFiles(directory="dist", html=True))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 