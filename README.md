# EV Charging Site Selection

A web application for identifying and ranking potential EV charging station locations in Detroit, MI.

## Features

- Interactive map view of potential sites
- Filter sites by property type, zoning, and lot size
- Detailed site information including suitability scores
- Responsive design for desktop and mobile

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/AbdullahiAyantayo/ampscout.git
cd ampscout
```

2. Set up Python environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Build frontend assets:
```bash
npm run build
```

5. Start the development server:
```bash
uvicorn main:app --reload
```

6. Open http://localhost:8000 in your browser

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub account
- Node.js installed
- Python installed

### Steps

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the application:
```bash
vercel
```

4. Follow the prompts:
   - Select your scope (personal account or organization)
   - Choose to create a new project
   - Enter project name (e.g., "ampscout")
   - Use current directory (press Enter)
   - Select "Other" for framework preset
   - Use default settings (press Enter)

5. Environment Variables:
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add variables from .env.example

6. Automatic Deployments:
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Git
   - Connect your GitHub repository
   - Enable automatic deployments

### Vercel Configuration Files

1. `vercel.json` - Main configuration file
2. `vercel-python.json` - Python-specific settings
3. `requirements.txt` - Python dependencies
4. `.env.example` - Example environment variables

### Troubleshooting

1. Build Fails:
   - Check Python version (Vercel uses Python 3.9)
   - Verify all dependencies in requirements.txt
   - Check build logs in Vercel dashboard

2. Static Files Not Loading:
   - Verify static file paths in vercel.json
   - Check if files are included in deployment
   - Clear browser cache

3. API Errors:
   - Check environment variables
   - Verify CORS settings
   - Check server logs in Vercel dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 