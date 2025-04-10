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
git clone https://github.com/yourusername/ev-charging-site-selection.git
cd ev-charging-site-selection
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

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Create a `vercel.json` file in your project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    },
    {
      "src": "static/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/main.py"
    }
  ]
}
```

3. Deploy to Vercel:
```bash
vercel
```

4. Follow the prompts to complete the deployment:
   - Set up your project
   - Link to your GitHub repository
   - Configure environment variables if needed

5. After deployment, Vercel will provide you with a URL for your application

## Environment Variables

Create a `.env` file in your project root with the following variables:
```
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 